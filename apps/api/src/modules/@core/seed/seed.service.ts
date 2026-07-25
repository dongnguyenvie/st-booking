import { Injectable, Logger, OnApplicationBootstrap, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Auth0ManagementService } from '../../auth/services/auth0-management.service';
import { Privilege, RoleName, PERMISSIONS, ROLE_PERMISSIONS, ROLE_DESCRIPTIONS } from '@repo/core';
import * as bcrypt from 'bcrypt';

const SEED_USERS = [
  {
    email: 'admin@canmorestays.dev',
    password: 'Admin@2026!Secure',
    name: 'Admin',
    // SUPER_ADMIN is the only meaningful privilege — a break-glass bypass.
    privileges: [Privilege.SUPER_ADMIN],
    roles: [RoleName.ADMIN],
  },
  {
    email: 'host@canmorestays.dev',
    password: 'Host@2026!Secure',
    name: 'Host Desk',
    privileges: [],
    roles: [RoleName.HOST_OWNER],
  },
  {
    email: 'guest@canmorestays.dev',
    password: 'Guest@2026!Secure',
    name: 'Avery Singh',
    privileges: [],
    roles: [RoleName.GUEST],
  },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly auth0: Auth0ManagementService,
  ) {}

  async onApplicationBootstrap() {
    if (this.config.get<string>('SEED_ON_START') !== 'true') return;

    this.logger.log('Seeding...');
    // Seeding is best-effort. A throw escaping this lifecycle hook aborts the
    // whole Nest bootstrap, so a missing migration or an unreachable DB would
    // take the API down instead of just skipping demo data. Each step is caught
    // separately; they depend on each other only through data (assignment finds
    // no roles / no users and skips), so one failure still lets the rest run.
    const results = [
      await this.runStep('permissions', () => this.seedPermissions()),
      await this.runStep('roles', () => this.seedRoles()),
      await this.runStep('users', () => this.seedUsers()),
      await this.runStep('role assignment', () => this.assignRoles()),
    ];

    if (results.every(Boolean)) {
      this.logger.log('Seed complete');
    } else {
      this.logger.warn('Seed finished with errors — see above. App continues to boot.');
    }
  }

  /** Runs one seed step, logging and swallowing any failure. */
  private async runStep(name: string, step: () => Promise<void>): Promise<boolean> {
    try {
      await step();
      return true;
    } catch (err) {
      const e = err as Error;
      this.logger.error(`Seed step "${name}" failed: ${e?.message}`, e?.stack);
      return false;
    }
  }

  /** Upsert the permission catalog (the `resource:verb` action list). */
  private async seedPermissions() {
    for (const p of PERMISSIONS) {
      await this.prisma.permission.upsert({
        where: { key: p.key },
        update: { resource: p.resource, action: p.action, description: p.description },
        create: { key: p.key, resource: p.resource, action: p.action, description: p.description },
      });
    }
    this.logger.log(`Permissions: ${PERMISSIONS.length}`);
  }

  /** Upsert the four roles and (re)wire their permission sets. */
  private async seedRoles() {
    for (const name of Object.values(RoleName)) {
      // Guest is the self-signup role (glossary: hosts are Admin-onboarded,
      // never self-registered). An admin can move this flag from the dashboard.
      const isDefault = name === RoleName.GUEST;
      const role = await this.prisma.role.upsert({
        where: { name },
        update: { description: ROLE_DESCRIPTIONS[name], isDefault },
        create: { name, description: ROLE_DESCRIPTIONS[name], isDefault },
      });

      const keys = ROLE_PERMISSIONS[name];
      const permissions = await this.prisma.permission.findMany({
        where: { key: { in: keys } },
        select: { id: true },
      });

      await this.prisma.$transaction([
        this.prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
        this.prisma.rolePermission.createMany({
          data: permissions.map((p) => ({ roleId: role.id, permissionId: p.id })),
          skipDuplicates: true,
        }),
      ]);

      this.logger.log(`Role: ${name} [${keys.length} permissions]`);
    }
  }

  private async seedUsers() {
    for (const account of SEED_USERS) {
      const auth0Id = await this.ensureAuth0User(account);
      const hashedPassword = await bcrypt.hash(account.password, 10);

      await this.prisma.user.upsert({
        where: { email: account.email },
        update: {
          name: account.name,
          password: hashedPassword,
          privileges: account.privileges,
          ...(auth0Id && { auth0Id }),
        },
        create: {
          email: account.email,
          password: hashedPassword,
          name: account.name,
          privileges: account.privileges,
          ...(auth0Id && { auth0Id }),
        },
      });

      this.logger.log(`User: ${account.email} [${account.roles.join(',')}]`);
    }
  }

  /** Connect each seed user to their role(s) via user_roles. */
  private async assignRoles() {
    for (const account of SEED_USERS) {
      const user = await this.prisma.user.findUnique({ where: { email: account.email } });
      if (!user) continue;

      const roles = await this.prisma.role.findMany({
        where: { name: { in: account.roles } },
        select: { id: true, name: true },
      });
      if (roles.length === 0) continue;

      for (const role of roles) {
        await this.prisma.userRole.upsert({
          where: { userId_roleId: { userId: user.id, roleId: role.id } },
          create: { userId: user.id, roleId: role.id },
          update: {},
        });
      }

      this.logger.log(`Assigned [${roles.map((r) => r.name).join(', ')}] to ${user.email}`);
    }
  }

  private async ensureAuth0User(account: {
    email: string;
    password: string;
    name: string;
  }): Promise<string | null> {
    try {
      const result = await this.auth0.createUser({
        email: account.email,
        password: account.password,
        name: account.name,
      });
      return result.user_id;
    } catch (err) {
      if (err instanceof ConflictException) {
        // User exists in Auth0 — query Auth0 by email and reset password
        const auth0Id = await this.auth0.findUserByEmail(account.email);
        if (auth0Id) {
          await this.auth0.resetPassword(auth0Id, account.password);
          this.logger.log(`Auth0 password reset for: ${account.email}`);
        }
        return auth0Id;
      }
      this.logger.warn(`Auth0 unavailable, DB only: ${account.email}`);
      return null;
    }
  }
}
