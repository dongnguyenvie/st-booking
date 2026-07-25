# API — NestJS Backend

NestJS v11 · GraphQL (Apollo v5, code-first) · REST (Swagger) · Prisma v6 · BullMQ v5 · Redis (ioredis v5)

---

## Quick Start

```bash
cp .env.example .env          # fill in DB / Redis / JWT values
pnpm --filter api db:migrate  # run prisma migrations
pnpm --filter api dev         # start dev server (port 7001)
```

REST: `http://localhost:7001/api` · Swagger: `http://localhost:7001/api-docs` · GraphQL: `http://localhost:7001/graphql` · GraphiQL UI: `http://localhost:7001/graphql-ui`

---

## Demo Accounts

Set `SEED_ON_START=true` in `.env` — seeds on app startup (upserts, safe to run repeatedly).

One account per role, matching the three the app actually has:

| Email                               | Password               | Privileges              | Access policy         |
| ----------------------------------- | ---------------------- | ----------------------- | --------------------- |
| `admin@carousel-marketplace.dev`    | `Admin@2026!Secure`    | `SUPER_ADMIN` + `ADMIN` | Super Admin + Admin   |
| `lender@carousel-marketplace.dev`   | `Lender@2026!Secure`   | `LENDER`                | Lender                |
| `borrower@carousel-marketplace.dev` | `Borrower@2026!Secure` | `BORROWER`              | Borrower              |

Policies are assigned by matching privilege to policy name. Super Admin carries
`permissions: ['*']`, `scopes: ['*']`; the rest are scoped to their side
(`lender:*`, `borrower:request`/`borrower:offer`).

Also creates the users in Auth0 if configured (skips if they exist, or if Auth0
is unavailable — seeding does not fail on it).

Seeding is best-effort by design: each step is caught separately, so a missing
migration or unreachable DB logs and skips instead of aborting the Nest
bootstrap.

Local dev only. These are seeded credentials in source control, so
`SEED_ON_START` must never be `true` outside a local environment.

The list is `SEED_USERS` in `src/modules/@core/seed/seed.service.ts` — change it
there, then update this table and the one in the root README.

Sign in via GraphQL:

```graphql
mutation {
  signIn(input: { email: "admin@carousel-marketplace.dev", password: "Admin@2026!Secure" }) {
    data {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
}
```

Use the token as `Authorization: Bearer <token>` header for protected endpoints.

---

## Folder Structure

```
src/
├── app.module.ts              # root module — imports @core + domain modules
├── app.controller.ts          # health check: GET /
├── main.ts                    # bootstrap (helmet, cors, pipes, guards, swagger)
│
├── @generated-dto/            # auto-generated GraphQL models from Prisma schema
│
└── modules/
    ├── @core/                 # ── INFRA LAYER ──────────────────────────────────
    │   ├── config/            # env config factory + validation
    │   ├── prisma/            # PrismaService (global)
    │   ├── redis/             # RedisService (ioredis, global)
    │   ├── logger/            # CustomLogger (singleton, global)
    │   ├── guards/            # UnifiedAuthGuard, PrivilegesGuard, PoliciesGuard
    │   ├── decorators/        # @CurrentUser(), @PoliciesGuard()
    │   ├── interceptors/      # LoadAccessPoliciesInterceptor
    │   ├── seed/              # SeedModule — demo accounts + access policies
    │   ├── graphql/           # GraphQL module config
    │   └── core.module.ts     # @Global() — exports everything above
    │
    ├── @jobs/                 # ── QUEUE LAYER (BullMQ, global) ──────────────────
    │   ├── jobs.module.ts
    │   └── jobs.service.ts
    │
    ├── @shared/               # ── SHARED UTILITIES ──────────────────────────────
    │   ├── dtos/              # data-output.factory, pagination.input
    │   ├── enums/             # GraphQL enum registration
    │   └── utils/             # permission helpers
    │
    ├── auth/                  # ── DOMAIN: authentication ────────────────────────
    │   ├── dtos/              # sign-in, sign-in-by-auth0, register-user, etc.
    │   ├── services/          # Auth0ManagementService, Auth0TokenValidatorService
    │   ├── strategies/        # JWT strategy (RS256)
    │   ├── auth.controller.ts # REST: POST /auth/sign-in, /auth/register, GET /auth/me
    │   ├── auth.resolver.ts   # GraphQL: signIn, signInByAuth0, registerUser, getUsers
    │   ├── auth.service.ts
    │   └── auth.module.ts
    │
    ├── access-policy/         # ── DOMAIN: access control ────────────────────────
    │   ├── dtos/
    │   ├── services/          # AccessPolicyService, RouteDiscoveryService
    │   └── access-policy.resolver.ts
    │
    └── api-key/               # ── DOMAIN: API keys ──────────────────────────────
        ├── dtos/
        └── api-key.resolver.ts
```

### Layer Rules

| Prefix      | Role                                                  |
| ----------- | ----------------------------------------------------- |
| `@core/`    | Cross-cutting infra (auth guards, DB, cache, logging) |
| `@jobs/`    | Queue infrastructure (BullMQ)                         |
| `@shared/`  | Shared DTOs, enums, utilities                         |
| `{domain}/` | Feature modules (no `@` prefix)                       |

- `@core` is `@Global()` — never import `PrismaService`/`RedisService` directly in feature modules.
- Feature modules inject what they need via constructor.

---

## DTO Conventions

### Generated vs Manual DTOs

- **Generated** (`@generated-dto/`): Prisma models auto-generated as GraphQL `@ObjectType()`. Use directly for responses — `User`, `AccessPolicy`, `ApiKey`.
- **Manual** (`modules/{domain}/dtos/`): Inputs, custom outputs (auth responses, aggregations, pagination wrappers).

### Response Format

```typescript
// Single item — { data: T }
createDataOutput(User, 'GetUserOutput');

// Paginated list — { data: T[], meta: { total, page, limit } }
createPaginatedOutput(User, 'GetUsersOutput');
```

All list endpoints accept optional `PaginationInput { page, limit }` and return `MetaOutput { total, page, limit }`.

### Naming

```
{action}.dto.ts                 sign-in.dto.ts
{action}-by-{method}.dto.ts     sign-in-by-auth0.dto.ts
{action}-{entity}.dto.ts        create-access-policy.dto.ts
list-{entities}.dto.ts          list-users.dto.ts
```

---

## Auth & Guards

| Guard              | Purpose                           | Usage                                                     |
| ------------------ | --------------------------------- | --------------------------------------------------------- |
| `UnifiedAuthGuard` | JWT validation (REST + GraphQL)   | Applied globally via `PoliciesGuard`                      |
| `PrivilegesGuard`  | Check numeric privilege flags     | `@PoliciesGuard({ privileges: [Privilege.SUPER_ADMIN] })` |
| `PoliciesGuard()`  | Decorator — marks route protected | `@PoliciesGuard()` on resolver/controller                 |

Set `BYPASS_AUTH=true` in `.env` to skip all auth checks during development.

JWT payload: `{ sub, email, privileges, accessPolicyIds }`

---

## Environment Variables

See `.env.example` for all required variables. Key groups:

| Group    | Variables                                                                          |
| -------- | ---------------------------------------------------------------------------------- |
| Server   | `PORT`, `NODE_ENV`, `APP_ENV`, `CLIENT_BASE_URL`                                   |
| Database | `DATABASE_URL`                                                                     |
| Redis    | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`                                       |
| JWT      | `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `JWT_EXPIRES_IN` (RS256)                      |
| Auth0    | `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `AUTH0_M2M_CLIENT_ID`, `AUTH0_M2M_CLIENT_SECRET` |
| Dev      | `SEED_ON_START` (seed demo data), `BYPASS_AUTH` (skip auth)                        |
