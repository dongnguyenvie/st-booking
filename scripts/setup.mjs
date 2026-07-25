import { execSync } from 'node:child_process';
import { existsSync, copyFileSync } from 'node:fs';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const log = (msg) => console.log(msg);

log('=== Carousel Marketplace Local Setup ===\n');

// ── Copy .env files ─────────────────────────────────────────────
if (!existsSync('apps/api/.env')) {
  copyFileSync('apps/api/.env.example', 'apps/api/.env');
  log('[+] Created apps/api/.env from template');
} else {
  log('[=] apps/api/.env already exists, skipping');
}

if (!existsSync('apps/frontend/.env.local')) {
  copyFileSync('apps/frontend/.env.example', 'apps/frontend/.env.local');
  log('[+] Created apps/frontend/.env.local from template');
} else {
  log('[=] apps/frontend/.env.local already exists, skipping');
}

log('');

// ── Start Docker services ───────────────────────────────────────
log('[*] Starting Docker services (PostgreSQL + Redis)...');
run('docker compose -f docker-compose.dev.yml up -d');
log('[+] Docker services running\n');

// ── Install dependencies ────────────────────────────────────────
log('[*] Installing dependencies...');
run('pnpm install');
log('[+] Dependencies installed\n');

// ── Run Prisma migrations ───────────────────────────────────────
log('[*] Running database migrations...');
run('pnpm --filter api prisma:migrate:deploy');
log('[+] Migrations applied\n');

// ── Done ────────────────────────────────────────────────────────
log('=== Setup Complete ===');
log('');
log('  Start dev:  pnpm dev');
log('  API:        http://localhost:7001');
log('  Web:        http://localhost:3000');
log('  GraphiQL:   http://localhost:7001/graphql-ui');
log('');
log('  Demo accounts (set SEED_ON_START=true in apps/api/.env):');
log('  +----------------------------+-------------------------+--------------+');
log('  | Email                      | Password                | Role         |');
log('  +----------------------------+-------------------------+--------------+');
log('  | admin@canmorestays.dev         | Admin@2026!Secure       | Super Admin  |');
log('  | host@canmorestays.dev          | Host@2026!Secure        | Host Owner   |');
log('  | guest@canmorestays.dev         | Guest@2026!Secure       | Guest        |');
log('  +----------------------------+-------------------------+--------------+');
log('');
