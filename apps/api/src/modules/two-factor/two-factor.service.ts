import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../@core/prisma/prisma.service';
import { encryptString, decryptString } from '../@core/crypto/aes-gcm.util';
import { TotpHelper } from './two-factor.totp.helper';
import { EmailOtpHelper } from './two-factor.email.helper';
import { AttemptsTracker } from './two-factor.attempts';
import { TwoFactorMethod } from '@repo/core';
import { TwoFactorSetupInitOutput } from './dto/two-factor-setup-init.output';

/** In-memory store for pending TOTP secrets (pre-verification). TTL = 10 min. */
interface PendingTotpEntry {
  secret: string;
  expiresAt: number;
}

const PENDING_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name);
  private readonly pendingTotp = new Map<string, PendingTotpEntry>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly totp: TotpHelper,
    private readonly emailOtp: EmailOtpHelper,
    private readonly attempts: AttemptsTracker,
  ) {}

  /** Initialise 2FA setup — returns QR data (TOTP) or challengeId (EMAIL). */
  async setupInit(userId: string, method: TwoFactorMethod): Promise<TwoFactorSetupInitOutput> {
    const user = await this.requireUser(userId);

    if (method === TwoFactorMethod.TOTP) {
      const secret = this.totp.generateSecret();
      const otpauthUrl = this.totp.buildOtpauthUrl(secret, user.email);
      const qrCodeDataUrl = await this.totp.qrCodeDataUrl(otpauthUrl);

      // Cache secret in memory — do NOT persist until verified
      this.pendingTotp.set(userId, { secret, expiresAt: Date.now() + PENDING_TTL_MS });
      this.logger.log(`2fa_setup_init TOTP userId=${userId}`);
      return { secret, qrCodeDataUrl };
    }

    // EMAIL
    const challengeId = await this.emailOtp.createChallenge(userId, user.email);
    this.logger.log(`2fa_setup_init EMAIL userId=${userId} challengeId=${challengeId}`);
    return { challengeId };
  }

  /** Verify setup code — activates 2FA on success. */
  async setupVerify(userId: string, method: TwoFactorMethod, code: string): Promise<void> {
    if (this.attempts.isLocked(userId)) {
      throw new BadRequestException('Too many failed attempts — wait 10 minutes');
    }

    try {
      if (method === TwoFactorMethod.TOTP) {
        await this.verifyTotpSetup(userId, code);
      } else {
        await this.verifyEmailSetup(userId, code);
      }
    } catch (err) {
      this.attempts.recordFailure(userId);
      throw err;
    }

    this.attempts.reset(userId);
    this.logger.log(`2fa_enabled userId=${userId} method=${method}`);
  }

  /**
   * Disable 2FA. Always requires current password.
   * TOTP method also requires a valid TOTP code.
   * EMAIL method: password alone is sufficient (v1 simplification — no email round-trip on disable).
   */
  async disable(userId: string, password: string, code?: string): Promise<void> {
    const user = await this.requireUser(userId);

    if (!user.password) throw new UnauthorizedException('Password not set on this account');
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) throw new UnauthorizedException('Invalid password');

    if (!user.twoFactorEnabled) throw new BadRequestException('2FA is not enabled');

    if (user.twoFactorMethod === TwoFactorMethod.TOTP) {
      if (!code) throw new BadRequestException('TOTP code required to disable');
      if (this.attempts.isLocked(userId)) {
        throw new BadRequestException('Too many failed attempts — wait 10 minutes');
      }
      const secret = user.twoFactorSecret ? decryptString(user.twoFactorSecret) : null;
      if (!secret || !this.totp.verifyToken(secret, code)) {
        this.attempts.recordFailure(userId);
        throw new UnauthorizedException('Invalid TOTP code');
      }
    }
    // EMAIL: password-only for v1 (documented trade-off)

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        twoFactorSecret: null,
        twoFactorEnabledAt: null,
      },
    });

    this.attempts.reset(userId);
    this.logger.log(`2fa_disabled userId=${userId}`);
  }

  /**
   * Verify a 2FA code for an already-enabled user.
   * Used by login integration (phase 04).
   */
  async verifyCode(userId: string, method: TwoFactorMethod, code: string): Promise<void> {
    const user = await this.requireUser(userId);

    if (this.attempts.isLocked(userId)) {
      throw new BadRequestException('Too many failed attempts — wait 10 minutes');
    }

    try {
      if (method === TwoFactorMethod.TOTP) {
        const secret = user.twoFactorSecret ? decryptString(user.twoFactorSecret) : null;
        if (!secret || !this.totp.verifyToken(secret, code)) {
          throw new UnauthorizedException('Invalid TOTP code');
        }
      } else {
        await this.emailOtp.verifyChallenge(userId, code);
      }
    } catch (err) {
      this.attempts.recordFailure(userId);
      throw err;
    }

    this.attempts.reset(userId);
  }

  /**
   * Issue a new email OTP challenge for an existing user.
   * Used by login integration (phase 04) and resend flows.
   */
  async issueEmailChallenge(userId: string): Promise<string> {
    const user = await this.requireUser(userId);
    return this.emailOtp.createChallenge(userId, user.email);
  }

  // Private helpers

  private async verifyTotpSetup(userId: string, code: string): Promise<void> {
    const entry = this.pendingTotp.get(userId);
    if (!entry || Date.now() > entry.expiresAt) {
      this.pendingTotp.delete(userId);
      throw new BadRequestException('TOTP setup expired — call setupInit again');
    }

    if (!this.totp.verifyToken(entry.secret, code)) {
      throw new UnauthorizedException('Invalid TOTP code');
    }

    const encryptedSecret = encryptString(entry.secret);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: TwoFactorMethod.TOTP,
        twoFactorSecret: encryptedSecret,
        twoFactorEnabledAt: new Date(),
      },
    });
    this.pendingTotp.delete(userId);
  }

  private async verifyEmailSetup(userId: string, code: string): Promise<void> {
    await this.emailOtp.verifyChallenge(userId, code);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: TwoFactorMethod.EMAIL,
        twoFactorSecret: null,
        twoFactorEnabledAt: new Date(),
      },
    });
  }

  private async requireUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
