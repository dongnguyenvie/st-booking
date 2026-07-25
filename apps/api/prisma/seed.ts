// The schema's `client` generator writes to src/modules/@core/prisma/generated,
// not node_modules/@prisma/client — so that is where PrismaClient comes from.
// Importing it from '@prisma/client' compiles to nothing and fails at runtime.
import { PrismaClient } from '../src/modules/@core/prisma/generated';
import { PrismaPg } from '@prisma/adapter-pg';
import { Privilege, RoleName, PERMISSIONS, ROLE_PERMISSIONS, ROLE_DESCRIPTIONS } from '@repo/core';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Auth0 Management API helpers (mirrors Auth0ManagementService logic)
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
const AUTH0_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID!;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET!;

async function getManagementToken(): Promise<string> {
  const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Auth0 management token failed: ${JSON.stringify(err)}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function createAuth0User(
  token: string,
  email: string,
  password: string,
  name: string,
): Promise<string | null> {
  const res = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connection: 'Username-Password-Authentication',
      email,
      password,
      name,
    }),
  });

  if (res.status === 409) {
    // Already exists — fetch existing auth0Id by email
    const search = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (search.ok) {
      const users = (await search.json()) as Array<{ user_id: string }>;
      if (users.length > 0) return users[0]!.user_id;
    }
    console.log(`  ⚠️  ${email} already in Auth0, auth0Id not linked`);
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`  ❌ Auth0 create failed for ${email}: ${JSON.stringify(err)}`);
    return null;
  }

  const user = (await res.json()) as { user_id: string };
  return user.user_id;
}

// RS256 private key from env (base64-encoded PEM)
const privateKey = process.env.JWT_PRIVATE_KEY
  ? Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString('utf8')
  : null;

function generateToken(userId: string, email: string): string | null {
  if (!privateKey) return null;
  return jwt.sign({ sub: userId, email }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1d',
  });
}

/**
 * Must stay in step with SEED_USERS in
 * `src/modules/@core/seed/seed.service.ts`, which is what `SEED_ON_START=true`
 * runs at boot. Same three accounts, same passwords: two seed paths handing out
 * different credentials for the same email is worse than either one alone.
 *
 * This path exists for `prisma db seed` / `pnpm prisma:seed`, where the API is
 * not running. It is self-sufficient: it seeds the permission catalog, the four
 * roles + their permission sets, the demo users, and their role assignments.
 */
const DEMO_ACCOUNTS = [
  {
    email: 'admin@canmorestays.dev',
    password: 'Admin@2026!Secure',
    name: 'Admin',
    privileges: [Privilege.SUPER_ADMIN],
    roles: [RoleName.ADMIN],
  },
  {
    email: 'host@canmorestays.dev',
    password: 'Host@2026!Secure',
    name: 'Host Desk',
    privileges: [] as number[],
    roles: [RoleName.HOST_OWNER],
  },
  {
    email: 'guest@canmorestays.dev',
    password: 'Guest@2026!Secure',
    name: 'Avery Singh',
    privileges: [] as number[],
    roles: [RoleName.GUEST],
  },
];

/** Seed the permission catalog and the four roles with their permission sets. */
async function seedRbac() {
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { resource: p.resource, action: p.action, description: p.description },
      create: { key: p.key, resource: p.resource, action: p.action, description: p.description },
    });
  }

  for (const name of Object.values(RoleName)) {
    // Guest is the self-signup role; admins can move the flag later.
    const isDefault = name === RoleName.GUEST;
    const role = await prisma.role.upsert({
      where: { name },
      update: { description: ROLE_DESCRIPTIONS[name], isDefault },
      create: { name, description: ROLE_DESCRIPTIONS[name], isDefault },
    });
    const permissions = await prisma.permission.findMany({
      where: { key: { in: ROLE_PERMISSIONS[name] } },
      select: { id: true },
    });
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
      prisma.rolePermission.createMany({
        data: permissions.map((p) => ({ roleId: role.id, permissionId: p.id })),
        skipDuplicates: true,
      }),
    ]);
  }
  console.log(`✅ RBAC: ${PERMISSIONS.length} permissions, ${Object.values(RoleName).length} roles`);
}

async function main() {
  console.log('🌱 Seeding demo accounts (Auth0 + DB)...\n');

  await seedRbac();

  // Get Auth0 management token once
  let managementToken: string | null = null;
  try {
    managementToken = await getManagementToken();
    console.log('✅ Auth0 management token acquired\n');
  } catch (err) {
    console.warn('⚠️  Auth0 unavailable — skipping Auth0 creation, DB only\n', err);
  }

  const tokens: Record<string, string | null> = {};

  for (const account of DEMO_ACCOUNTS) {
    console.log(`→ ${account.email}`);

    // Create in Auth0
    let auth0Id: string | null = null;
    if (managementToken) {
      auth0Id = await createAuth0User(managementToken, account.email, account.password, account.name);
      if (auth0Id) console.log(`  ✅ Auth0: ${auth0Id}`);
    }

    // Upsert in DB
    const hashedPassword = await bcrypt.hash(account.password, 10);
    const user = await prisma.user.upsert({
      where: { email: account.email },
      // Re-seeding has to correct an existing row, not just link its auth0Id —
      // otherwise a user seeded before a password or privilege change keeps the
      // stale values and the credentials in the README stop working.
      update: {
        password: hashedPassword,
        name: account.name,
        privileges: account.privileges,
        ...(auth0Id ? { auth0Id } : {}),
      },
      create: {
        email: account.email,
        password: hashedPassword,
        name: account.name,
        privileges: account.privileges,
        ...(auth0Id ? { auth0Id } : {}),
      },
    });

    // Assign role(s) via user_roles.
    const roles = await prisma.role.findMany({
      where: { name: { in: account.roles } },
      select: { id: true },
    });
    for (const role of roles) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        create: { userId: user.id, roleId: role.id },
        update: {},
      });
    }
    console.log(`  ✅ DB: ${user.id} [${account.roles.join(',')}]`);

    tokens[account.email] = generateToken(user.id, user.email);
  }

  console.log('\n📋 Demo credentials:');
  for (const a of DEMO_ACCOUNTS) {
    console.log(`  ${a.email} | ${a.password}`);
  }

  if (privateKey) {
    console.log('\n🔑 JWT Tokens (RS256, 1 day):');
    for (const [email, token] of Object.entries(tokens)) {
      console.log(`  ${email}:\n  ${token}\n`);
    }
  } else {
    console.log('\n⚠️  JWT_PRIVATE_KEY not set — use login mutation to get tokens');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
