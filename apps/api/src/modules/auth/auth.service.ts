import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../@core/prisma/prisma.service';
import { SignInInput, SignInOutput } from './dtos/sign-in.dto';
import { RegisterUserInput } from './dtos/register-user.dto';
import { PaginationInput } from '@modules/@shared/dtos/pagination.input';
import { Auth0TokenPayload } from './services/auth0-token-validator.service';
import { Auth0ManagementService } from './services/auth0-management.service';
import { PreAuthTokenService } from './services/pre-auth-token.service';
import { TwoFactorService } from '../two-factor/two-factor.service';
import { Privilege, RoleName, TwoFactorMethod } from '@repo/core';
import { RateLimiterService } from '@core/rate-limit/rate-limiter.service';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;
const MAX_RESENDS = 3;
const RESEND_WINDOW_S = 5 * 60;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auth0Management: Auth0ManagementService,
    private readonly preAuthToken: PreAuthTokenService,
    private readonly twoFactorService: TwoFactorService,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  async register(dto: RegisterUserInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const auth0User = await this.auth0Management.createUser({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });
    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const signupRoleId = await this.resolveSignupRoleId();
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          auth0Id: auth0User.user_id,
          // Role comes from the configured default, never from the request.
          ...(signupRoleId && { userRoles: { create: { roleId: signupRoleId } } }),
        },
      });
      this.logger.log(`User registered: ${dto.email} (auth0: ${auth0User.user_id})`);
      const claims = await this.loadTokenClaims(user.id);
      const accessToken = this.generateToken(user.id, user.email, claims.privileges, claims.roleIds);
      return { accessToken, user };
    } catch (err) {
      await this.auth0Management.deleteUser(auth0User.user_id);
      throw err;
    }
  }

  async signIn(dto: SignInInput): Promise<SignInOutput> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.twoFactorEnabled) {
      const method = user.twoFactorMethod as TwoFactorMethod;
      const token = this.preAuthToken.issue(user.id);
      if (method === TwoFactorMethod.EMAIL) {
        await this.twoFactorService.issueEmailChallenge(user.id);
      }
      this.logger.log(`2fa_challenge_issued userId=${user.id} method=${method}`);
      return { twoFactorRequired: true, preAuthToken: token, twoFactorMethod: method };
    }

    const claims = await this.loadTokenClaims(user.id);
    const accessToken = this.generateToken(user.id, user.email, claims.privileges, claims.roleIds);
    return { accessToken, user, twoFactorRequired: false };
  }

  async verifyTwoFactor(preAuthToken: string, code: string) {
    const { sub: userId } = this.preAuthToken.verify(preAuthToken);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    if (!user.twoFactorEnabled || !user.twoFactorMethod) {
      throw new UnauthorizedException('2FA not enabled for this user');
    }
    await this.twoFactorService.verifyCode(userId, user.twoFactorMethod as TwoFactorMethod, code);
    const claims = await this.loadTokenClaims(userId);
    const accessToken = this.generateToken(userId, user.email, claims.privileges, claims.roleIds);
    this.logger.log(`2fa_verified userId=${userId}`);
    return { accessToken, user };
  }

  async resendEmailChallenge(preAuthToken: string): Promise<{ sent: boolean }> {
    const { sub: userId } = this.preAuthToken.verify(preAuthToken);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    if (user.twoFactorMethod !== TwoFactorMethod.EMAIL) {
      throw new BadRequestException('Resend only available for EMAIL 2FA method');
    }
    await this.checkResendRateLimit(userId);
    await this.twoFactorService.issueEmailChallenge(userId);
    this.logger.log(`2fa_email_resent userId=${userId}`);
    return { sent: true };
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  /**
   * The role a new self-signup gets. Read from the DB (roles.is_default) so an
   * admin can change it from the RBAC dashboard — deliberately NOT taken from
   * the request, because a client-supplied role is privilege escalation.
   *
   * Falls back to `guest` if nobody has marked a default, so signup never
   * silently produces a user with no access at all.
   */
  private async resolveSignupRoleId(): Promise<string | null> {
    const preferred = await this.prisma.role.findFirst({
      where: { isDefault: true, deletedAt: null },
      select: { id: true },
    });
    if (preferred) return preferred.id;

    const fallback = await this.prisma.role.findFirst({
      where: { name: RoleName.GUEST, deletedAt: null },
      select: { id: true },
    });
    if (fallback) {
      this.logger.warn(`No role marked is_default — falling back to "${RoleName.GUEST}"`);
      return fallback.id;
    }

    this.logger.error('No default role and no guest role — user created with no role');
    return null;
  }

  /** The user's role names + flattened permission keys — for client routing & UI gating. */
  async getMyAccess(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const rows = await this.prisma.userRole.findMany({
      where: { userId, role: { deletedAt: null } },
      select: {
        role: {
          select: {
            name: true,
            rolePermissions: { select: { permission: { select: { key: true } } } },
          },
        },
      },
    });
    const roles = rows.map((r) => r.role.name);
    const permissions = [
      ...new Set(rows.flatMap((r) => r.role.rolePermissions.map((rp) => rp.permission.key))),
    ];
    return { roles, permissions };
  }

  async signInByAuth0(payload: Auth0TokenPayload) {
    const { sub: auth0Id, email, name } = payload;
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ auth0Id }, ...(email ? [{ email }] : [])] },
    });
    if (!user) {
      if (!email) throw new UnauthorizedException('Email is required from Auth0 token');
      const signupRoleId = await this.resolveSignupRoleId();
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          auth0Id,
          ...(signupRoleId && { userRoles: { create: { roleId: signupRoleId } } }),
        },
      });
      this.logger.log(`New user created via Auth0: ${email}`);
    } else if (!user.auth0Id) {
      await this.prisma.user.update({ where: { id: user.id }, data: { auth0Id } });
    }
    const claims = await this.loadTokenClaims(user.id);
    const accessToken = this.generateToken(user.id, user.email, claims.privileges, claims.roleIds);
    return { accessToken, user };
  }

  async listUsers(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;
    const where = { deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      this.prisma.user.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  /**
   * Set a user's numeric privileges. SUPER_ADMIN-only at the resolver, because
   * the only meaningful privilege IS SUPER_ADMIN and it bypasses every RBAC
   * check — letting `user:manage` reach this would let any admin promote
   * themselves past the whole permission system.
   *
   * Two further guards here:
   *  - reject values that are not real Privilege members (the input is a bare
   *    number[], so `[999]` would otherwise be written straight to the column);
   *  - refuse to strip the last SUPER_ADMIN, which would lock everyone out of
   *    this mutation permanently — there would be nobody left allowed to call it.
   */
  async updateUserPrivileges(userId: string, privileges: number[], actingUserId: string) {
    const allowed = new Set(
      Object.values(Privilege).filter((v): v is Privilege => typeof v === 'number'),
    );
    const unknown = privileges.filter((p) => !allowed.has(p as Privilege));
    if (unknown.length) {
      throw new BadRequestException(`Unknown privilege value(s): ${unknown.join(', ')}`);
    }

    const target = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { privileges: true, email: true },
    });
    if (!target) throw new NotFoundException(`User ${userId} not found`);

    const wasSuperAdmin = target.privileges.includes(Privilege.SUPER_ADMIN);
    const willBeSuperAdmin = privileges.includes(Privilege.SUPER_ADMIN);
    if (wasSuperAdmin && !willBeSuperAdmin) {
      const othersRemaining = await this.prisma.user.count({
        where: {
          privileges: { has: Privilege.SUPER_ADMIN },
          deletedAt: null,
          id: { not: userId },
        },
      });
      if (othersRemaining === 0) {
        throw new BadRequestException(
          'Cannot remove the last super admin — promote another user first',
        );
      }
    }

    const updated = await this.prisma.user.update({ where: { id: userId }, data: { privileges } });
    // No audit table yet (see glossary "Audit event") — log it at minimum, since
    // this is the single most privilege-sensitive mutation in the system.
    this.logger.warn(
      `privileges_changed acting_user=${actingUserId} target=${target.email} ` +
        `from=[${target.privileges.join(',')}] to=[${privileges.join(',')}]`,
    );
    return updated;
  }

  async getDashboardStats() {
    const [totalUsers, activeUsers, totalRoles] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.role.count({ where: { deletedAt: null } }),
    ]);
    return { totalUsers, activeUsers, totalRoles };
  }

  /**
   * Per-account (not per-IP) resend cap, so it survives a client changing IP.
   * Redis-backed: an in-process counter would let N instances allow N x the cap.
   */
  private async checkResendRateLimit(userId: string): Promise<void> {
    const ok = await this.rateLimiter.consume(`rl:2fa-resend:${userId}`, MAX_RESENDS, RESEND_WINDOW_S);
    if (!ok) {
      throw new BadRequestException('Too many resend attempts — wait 5 minutes');
    }
  }

  private generateToken(
    userId: string,
    email: string,
    privileges: number[] = [],
    roleIds: string[] = [],
  ): string {
    return this.jwtService.sign({ sub: userId, email, privileges, roleIds });
  }

  private async loadTokenClaims(
    userId: string,
  ): Promise<{ privileges: number[]; roleIds: string[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { privileges: true, userRoles: { select: { roleId: true } } },
    });
    return {
      privileges: user?.privileges ?? [],
      roleIds: user?.userRoles.map((ur) => ur.roleId) ?? [],
    };
  }
}
