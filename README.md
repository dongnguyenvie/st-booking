# Canmore Stays

A vacation-rental booking platform: guests search listings and book stays, hosts
manage inventory, availability and reservations. Monorepo managed with Turborepo
and pnpm.

## Spec-first

The behaviour is written down before it is built.
[`apps/specs`](apps/specs) serves `specs/**/*.md` as a browsable hub — nav tree
from the folder structure, client-side search, and a dependency graph declared
per spec via `depends_on`. The canonical business spec lives in
[`apps/specs/specs/canmorestays`](apps/specs/specs/canmorestays).

**Export corpus** renders the whole tree as one markdown document, which is the
"hand the entire spec set to an AI" primitive. No backend: the markdown is
inlined at build time.

## Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| API      | NestJS · GraphQL · Prisma · PostgreSQL · Redis · BullMQ |
| Admin    | Nuxt 4 (Vue 3) · Pinia · villus · shadcn-vue            |
| Auth     | Auth0 (PKCE) · JWT (RSA) · Email/Password               |
| Monorepo | Turborepo · pnpm workspaces                             |
| Email    | React Email                                             |

## Structure

```
.
├── apps
│   ├── api          # NestJS GraphQL API (port 7001)
│   ├── web-vue      # Nuxt admin/host back office
│   └── specs        # Spec hub, React + Vite, markdown-only (port 3002)
└── packages
    ├── @repo/core   # Shared enums, constants, RBAC catalog
    ├── @repo/api    # Shared API contracts
    ├── @repo/email  # Transactional email templates (React Email, preview 3003)
    ├── @repo/eslint-config
    ├── @repo/jest-config
    └── @repo/typescript-config
```

Each app and package has its own README covering what it does and the
decisions behind it.

## Prerequisites

- Node.js >= 24 (see `.nvmrc` — v24.18.0)
- pnpm >= 8.15.5
- PostgreSQL
- Redis

## Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
```

## Development

```bash
pnpm dev                         # all apps

pnpm --filter api dev            # :7001
pnpm --filter web-vue dev
pnpm --filter @repo/specs dev    # :3002  spec hub
pnpm --filter @repo/email dev    # :3003  email template preview
```

## Build

```bash
pnpm build
pnpm build:packages              # shared packages first
pnpm --filter api build
```

## Testing

```bash
pnpm test
pnpm test:e2e

pnpm --filter api test
pnpm --filter @repo/email test   # renders every template
```

## Lint & Format

```bash
pnpm lint
pnpm format
```

## Environment Variables

### `apps/api/.env`

| Variable                    | Description                               |
| --------------------------- | ----------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string              |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection                          |
| `JWT_PRIVATE_KEY`           | RSA private key (base64)                  |
| `JWT_PUBLIC_KEY`            | RSA public key (base64)                   |
| `AUTH0_DOMAIN`              | Auth0 tenant domain                       |
| `AUTH0_AUDIENCE`            | Auth0 API audience                        |
| `AUTH0_M2M_CLIENT_ID`       | Auth0 M2M client ID                       |
| `AUTH0_M2M_CLIENT_SECRET`   | Auth0 M2M client secret                   |
| `PORT`                      | API port (default: 7001)                  |
| `SEED_ON_START`             | `true` to seed demo accounts on app start |
| `BYPASS_AUTH`               | `true` to skip auth checks (dev only)     |

## Auth Flow

Two sign-in methods:

1. **Email/Password** — `signIn` GraphQL mutation → validates credentials → returns JWT
2. **Auth0** — Auth0 Universal Login → redirect to `/auth/callback` → `signInByAuth0` mutation → returns JWT

JWT stored in `localStorage` + `session_token` cookie for middleware auth.

## Roles

RBAC is defined once in [`packages/core`](packages/core) and shared by the API
guards, the seed, and the admin UI.

| Role            | What it can do                                                        |
| --------------- | --------------------------------------------------------------------- |
| `guest`         | Browse listings, book a stay, review it afterwards (self-signup role) |
| `host_operator` | Manage listings, availability, pricing, reservations, review replies   |
| `host_owner`    | Everything an operator can do, plus members & billing                  |
| `admin`         | Onboard hosts, verify listings, ops & support                          |

## Demo Accounts

Set `SEED_ON_START=true` in API `.env` — seeds on app startup (upserts, so it is
safe to run repeatedly).

| Email                    | Password            | Privileges              | Role         |
| ------------------------ | ------------------- | ----------------------- | ------------ |
| `admin@canmorestays.dev` | `Admin@2026!Secure` | `SUPER_ADMIN` + `ADMIN` | `admin`      |
| `host@canmorestays.dev`  | `Host@2026!Secure`  | —                       | `host_owner` |
| `guest@canmorestays.dev` | `Guest@2026!Secure` | —                       | `guest`      |

Local dev only. These are seeded credentials in source control, so
`SEED_ON_START` must never be `true` outside a local environment.

> The seed list is `SEED_USERS` in
> `apps/api/src/modules/@core/seed/seed.service.ts` — update it there first, then
> this table.
