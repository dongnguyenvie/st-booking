Write-Host "=== Carousel Marketplace Local Setup ===" -ForegroundColor Cyan
Write-Host ""

# ── Copy .env files ──────────────────────────────────────────────
if (-not (Test-Path "apps/api/.env")) {
    Copy-Item "apps/api/.env.example" "apps/api/.env"
    Write-Host "[+] Created apps/api/.env from template" -ForegroundColor Green
} else {
    Write-Host "[=] apps/api/.env already exists, skipping" -ForegroundColor Yellow
}

if (-not (Test-Path "apps/frontend/.env.local")) {
    Copy-Item "apps/frontend/.env.example" "apps/frontend/.env.local"
    Write-Host "[+] Created apps/frontend/.env.local from template" -ForegroundColor Green
} else {
    Write-Host "[=] apps/frontend/.env.local already exists, skipping" -ForegroundColor Yellow
}

Write-Host ""

# ── Start Docker services ───────────────────────────────────────
Write-Host "[*] Starting Docker services (PostgreSQL + Redis)..." -ForegroundColor Cyan
docker compose -f docker-compose.dev.yml up -d
Write-Host "[+] Docker services running" -ForegroundColor Green
Write-Host ""

# ── Install dependencies ────────────────────────────────────────
Write-Host "[*] Installing dependencies..." -ForegroundColor Cyan
pnpm install
Write-Host "[+] Dependencies installed" -ForegroundColor Green
Write-Host ""

# ── Run Prisma migrations ───────────────────────────────────────
Write-Host "[*] Running database migrations..." -ForegroundColor Cyan
pnpm --filter api prisma:migrate:deploy
Write-Host "[+] Migrations applied" -ForegroundColor Green
Write-Host ""

# ── Done ─────────────────────────────────────────────────────────
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Start dev:  pnpm dev"
Write-Host "  API:        http://localhost:7001"
Write-Host "  Web:        http://localhost:3000"
Write-Host "  GraphiQL:   http://localhost:7001/graphql-ui"
Write-Host ""
Write-Host "  Demo accounts (set SEED_ON_START=true in apps/api/.env):" -ForegroundColor Yellow
Write-Host "  +----------------------------+-------------------------+--------------+"
Write-Host "  | Email                      | Password                | Role         |"
Write-Host "  +----------------------------+-------------------------+--------------+"
Write-Host "  | admin@canmorestays.dev         | Admin@2026!Secure       | Super Admin  |"
Write-Host "  | host@canmorestays.dev          | Host@2026!Secure        | Host Owner   |"
Write-Host "  | guest@canmorestays.dev         | Guest@2026!Secure       | Guest        |"
Write-Host "  +----------------------------+-------------------------+--------------+"
Write-Host ""
