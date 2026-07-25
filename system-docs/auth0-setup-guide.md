# Auth0 Setup Guide

How to obtain Auth0 credentials and initialize applications for the Carousel Marketplace monorepo.

## Overview

| Resource | Type | Used By | Purpose |
|----------|------|---------|---------|
| **Carousel Marketplace Web** | SPA | Next.js web | PKCE login flow, no secret needed |
| **Carousel Marketplace API** | API Resource Server | NestJS API | JWT validation, audience identifier |
| **M2M App** | Machine-to-Machine | NestJS API | Management API access (create users, etc.) |

## Step 1: Create Auth0 Tenant

1. Go to [auth0.com](https://auth0.com) → sign up / log in
2. Create tenant (e.g. `carousel-marketplace-core`)
3. Note **tenant domain**: `carousel-marketplace-core.jp.auth0.com`

## Step 2: Create M2M Application

> See [auth0-m2m-permissions.md](./auth0-m2m-permissions.md) for detailed scopes and permissions reference.

1. Auth0 Dashboard → **Applications** → **Create Application**
2. Name: `Carousel Marketplace M2M`
3. Type: **Machine to Machine**
4. Select API: **Auth0 Management API**
5. Grant required scopes (see [permissions doc](./auth0-m2m-permissions.md#required-scopes))
6. Click **Authorize**
7. Copy from **Settings** tab:
   - **Client ID** → `AUTH0_M2M_CLIENT_ID`
   - **Client Secret** → `AUTH0_M2M_CLIENT_SECRET`

## Step 3: Configure Environment Variables

`apps/api/.env`:
```env
AUTH0_DOMAIN=your-tenant.region.auth0.com
AUTH0_AUDIENCE=https://api.carousel-marketplace.com
AUTH0_M2M_CLIENT_ID=your_m2m_client_id
AUTH0_M2M_CLIENT_SECRET=your_m2m_client_secret
```

## Step 4: Run Init Script

```bash
# Preview (no changes)
node scripts/auth0-init.mjs --dry-run

# Create Auth0 apps + update .env files
node scripts/auth0-init.mjs
```

Script will:
1. Read M2M credentials from `apps/api/.env`
2. Authenticate with Auth0 Management API
3. Create SPA app ("Carousel Marketplace Web") → outputs `CLIENT_ID`
4. Create API Resource Server → uses `AUTH0_AUDIENCE` as identifier
5. Update `apps/frontend/.env.local` with SPA client ID, domain, audience
6. Update `apps/api/.env` with audience

Idempotent — skips if resources already exist.

## Step 5: Verify

**`apps/api/.env`:**
```env
AUTH0_DOMAIN=carousel-marketplace-core.jp.auth0.com
AUTH0_AUDIENCE=https://api.carousel-marketplace.com
AUTH0_M2M_CLIENT_ID=<your_m2m_id>
AUTH0_M2M_CLIENT_SECRET=<your_m2m_secret>
```

**`apps/frontend/.env.local`:**
```env
NEXT_PUBLIC_AUTH0_DOMAIN=carousel-marketplace-core.jp.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=<spa_client_id>
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.carousel-marketplace.com
```

## Auth Flow

### Web (Next.js) — SPA PKCE

```
User clicks "Login with Auth0"
  → Auth0 Universal Login (PKCE)
  → Redirects to /callback with auth code
  → Frontend exchanges code for tokens
  → Calls signInByAuth0 GraphQL mutation
  → API validates, creates/links local user, returns JWT
  → JWT stored in localStorage + session_token cookie
```

Only `CLIENT_ID` needed (public). PKCE handles security.

### API (NestJS) — JWT + M2M

- **JWT validation:** validates Auth0 JWTs via `AUTH0_DOMAIN` (JWKS) + `AUTH0_AUDIENCE`
- **M2M:** uses client credentials to create/delete users in Auth0. Token cached + auto-refreshed.

### Middleware (proxy.ts)

Edge middleware checks `session_token` cookie. Missing → redirect to `/login`. Runs server-side, dev + prod.

> **Important:** Middleware alone insufficient (CVE-2025-29927). Always verify session in Data Access Layer.

## Security

- **Never commit** `.env` files to git
- M2M `CLIENT_SECRET` = most sensitive, server-side only
- SPA `CLIENT_ID` = public, safe for frontend
- Init script reads `.env` (gitignored), never hardcodes secrets
- Rotate M2M secret periodically: Auth0 Dashboard → App → Settings

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Failed to get management token` | Check M2M Client ID/Secret in `apps/api/.env` |
| `403` on create clients | M2M missing scopes — see [permissions doc](./auth0-m2m-permissions.md#fixing-missing-scopes) |
| `PasswordStrengthError` on seed | Use stronger passwords (16+ chars, mixed case, numbers, symbols) |
| `Auth0 user exists, skipping` | Normal — seed is idempotent |
| SPA login redirect fails | Check `callbacks` URL matches `ORIGIN_DOMAIN/callback` |
