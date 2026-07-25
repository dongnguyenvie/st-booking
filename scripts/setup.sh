#!/usr/bin/env bash
set -e

echo "=== Carousel Marketplace Local Setup ==="
echo ""

# ── Copy .env files ──────────────────────────────────────────────
if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "[+] Created apps/api/.env from template"
else
  echo "[=] apps/api/.env already exists, skipping"
fi

if [ ! -f apps/frontend/.env.local ]; then
  cp apps/frontend/.env.example apps/frontend/.env.local
  echo "[+] Created apps/frontend/.env.local from template"
else
  echo "[=] apps/frontend/.env.local already exists, skipping"
fi

echo ""

# ── Start Docker services ───────────────────────────────────────
echo "[*] Starting Docker services (PostgreSQL + Redis)..."
docker compose -f docker-compose.dev.yml up -d
echo "[+] Docker services running"
echo ""

# ── Install dependencies ────────────────────────────────────────
echo "[*] Installing dependencies..."
pnpm install
echo "[+] Dependencies installed"
echo ""

# ── Run Prisma migrations ───────────────────────────────────────
echo "[*] Running database migrations..."
pnpm --filter api prisma:migrate:deploy
echo "[+] Migrations applied"
echo ""

# ── Done ─────────────────────────────────────────────────────────
echo "=== Setup Complete ==="
echo ""
echo "  Start dev:  pnpm dev"
echo "  API:        http://localhost:7001"
echo "  Web:        http://localhost:3000"
echo "  GraphiQL:   http://localhost:7001/graphql-ui"
echo ""
echo "  Demo accounts (set SEED_ON_START=true in apps/api/.env):"
echo "  ┌────────────────────────────┬─────────────────────────┬──────────────┐"
echo "  │ Email                      │ Password                │ Role         │"
echo "  ├────────────────────────────┼─────────────────────────┼──────────────┤"
echo "  │ admin@canmorestays.dev         │ Admin@2026!Secure       │ Super Admin  │"
echo "  │ host@canmorestays.dev          │ Host@2026!Secure        │ Host Owner   │"
echo "  │ guest@canmorestays.dev         │ Guest@2026!Secure       │ Guest        │"
echo "  └────────────────────────────┴─────────────────────────┴──────────────┘"
echo ""
