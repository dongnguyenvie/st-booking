# apps/frontend

The product surface — Next.js 16 App Router, Tailwind v4, shadcn/ui.

Two surfaces live here:

- **Marketplace** (`/marketplace/**`) — the product. Borrowers post financing
  requests and read ranked offers; lenders price deals from their desk.
- **Admin** (`/admin/**`) — back office. Users, permissions, API keys, settings.

The root route redirects to the borrower portal, because the marketplace *is*
the product. Someone who cannot use it gets re-routed by the edge guard rather
than by a second policy at the root — see [Auth](#auth) below.

## Dev

```bash
pnpm dev          # http://localhost:3000
pnpm build
pnpm check-types
pnpm lint

pnpm codegen      # regenerate GraphQL types from the schema
pnpm sync-schema  # pull schema.gql from apps/api first
pnpm shadcn button card ...   # add shadcn components (into packages/ui)

pnpm test:e2e         # Playwright
pnpm test:e2e:smoke   # @smoke tagged only
```

Copy `.env.example` to `.env.local` (or `.env` — both are gitignored) and fill
it in. `BYPASS_AUTH=true` skips every auth check in `proxy.ts`; it is for local
development only and must never be set anywhere else.

---

## Folder structure

```
apps/frontend/
├── app/                              # Next.js App Router — thin route wrappers only
│   ├── (auth)/                       # Route group, no URL prefix
│   │   ├── login/ · login/verify/ · register/ · callback/
│   ├── admin/                        # Back office, own layout
│   │   ├── dashboard/ · analytics/ · users/ · permissions/
│   │   └── api-keys/ · settings/ · components/
│   ├── marketplace/                  # The product, own layout per side
│   │   ├── borrower/
│   │   │   ├── offers/ · offers/[offerId]/ · market/
│   │   │   └── funding-room/ · fundings/ · profile/
│   │   └── lender/
│   │       └── deals/ · deals/[dealId]/
│   ├── settings/security/
│   ├── globals.css                   # Tailwind entry — tokens come from @repo/ui
│   ├── layout.tsx                    # Root layout + providers
│   └── page.tsx                      # Redirects → borrower offers
│
├── src/
│   ├── modules/                      # Page modules — one folder per page
│   │   ├── marketplace/
│   │   │   ├── borrower/{offers,market,offer-detail,funding-room,fundings,profile,layout}/
│   │   │   ├── lender/{deals,deal-detail,layout}/
│   │   │   └── shared/               # Used by both sides (format, stage-pill, lender-mark)
│   │   ├── admin/{dashboard,users,permissions,api-keys,settings,analytics,components,layout}/
│   │   ├── auth/{login,login-verify,register,callback}/
│   │   └── settings/security/
│   │
│   ├── store/                        # Redux Toolkit
│   │   ├── store.ts                  # configureStore + typed hooks
│   │   ├── store-core.ts             # getDispatch/getState for thunks outside components
│   │   ├── root-reducer.ts           # combineReducers
│   │   └── modules/                  # One store module per page (see below)
│   │
│   ├── core/                         # App-wide, feature-agnostic
│   │   ├── auth/get-session.ts       # DAL — reads session cookie (server-only)
│   │   ├── marketplace/price-offer.ts# Shared pricing maths, both sides
│   │   ├── admin/ · settings/        # Types shared across a feature's modules
│   │   ├── providers/                # ReduxProvider, QueryProvider, AppProviders
│   │   ├── env.ts                    # Zod-validated env (@t3-oss/env-nextjs)
│   │   ├── config.ts · constants.ts · routes.ts
│   │   └── get-home-route-by-privileges.ts
│   │
│   ├── mock/marketplace/             # The domain model, until the API lands
│   ├── api-service/                  # GraphQL client + codegen output + .gql files
│   ├── components/                   # Shared components (non-module, non-ui)
│   ├── hooks/                        # Shared hooks
│   └── lib/utils.ts                  # Re-exports cn from @repo/ui
│
├── e2e/                              # Playwright specs + helpers
├── proxy.ts                          # Edge auth guard (Next.js 16)
├── components.json                   # shadcn/ui config
└── codegen.ts                        # GraphQL codegen config
```

---

## One page, one store module, one page module

The rule that keeps this navigable at scale: **each page owns exactly one page
module and one store module, and the three mirror each other's path.**

```
app/marketplace/lender/deals/page.tsx            ← route (thin wrapper)
src/modules/marketplace/lender/deals/            ← page module
src/store/modules/marketplace/lender/deals/      ← store module
```

The route file does nothing but render the page feature. All logic lives in the
page module.

**Exceptions, on purpose:**

| Page | Why no store module |
| --- | --- |
| `admin/analytics` | Static content — nothing to hold |
| `admin/dashboard` | React Query owns the server cache; a slice would duplicate it |
| `admin/components` | Component showcase, not a feature |

An empty slice teaches the next person to write empty slices. If a page has no
client state, it gets no store module.

**`workspace` modules are the other shape.** `borrower/workspace` and
`lender/workspace` back a *layout*, not a page — they hold state the nav needs
across route changes (the lender's unread-reply badge, for one). Without them
the badge reads from the deals slice, which unmounts on navigation, and the
count blanks out the moment you open a deal.

---

## Store module layout

```
src/store/modules/marketplace/lender/deals/
├── deals-slice.ts        # createSlice — reducers + state
├── deals-types.ts        # State and payload types
├── deals-selectors.ts    # Memoised selectors
├── deals-actions.ts      # Thunks (optional)
└── index.ts              # Exports dealsA (actions) + dealsS (selectors)
```

`index.ts` merges slice reducers and thunks into one `xA` object and exposes
selectors as `xS`, so a component imports two symbols rather than six:

```typescript
import { dealsA, dealsS } from '@/store/modules/marketplace/lender/deals';
```

Thunks that need `dispatch`/`getState` outside a component get them from
`store-core.ts`, not from a hook.

Always use the typed `useAppDispatch` / `useAppSelector` from `@/store/store` —
never raw `react-redux` hooks, which lose `RootState` typing.

---

## Naming conventions

| Type | Convention | Example |
| --- | --- | --- |
| Route file | `page.tsx` | `app/admin/users/page.tsx` |
| Page feature | `{feature}-page-feature.tsx` | `deals-page-feature.tsx` |
| Sub-component | `{feature}-{description}.tsx` | `users-ag-grid.tsx` |
| Redux slice | `{feature}-slice.ts` | `deals-slice.ts` |
| GraphQL queries | `{feature}-queries.gql` | `auth-queries.gql` |
| Hooks | `use-{name}.ts(x)` | `use-mobile.tsx` |
| All files | kebab-case | — |

`ls-lint` enforces the kebab-case rule in CI. Next.js syntax — route groups
`(auth)` and dynamic segments `[offerId]` — is exempt, since those are framework
requirements rather than naming choices.

---

## Auth

**Two layers, deliberately.**

`proxy.ts` runs at the edge: it decodes the session JWT without verifying it and
routes on the `privileges` claim. Fast, and it keeps unauthorised users off a
surface before any of it renders.

`getSession()` runs in Server Components and *does* verify. That second check is
not redundant — CVE-2025-29927 showed middleware alone can be bypassed, so
anything that gates data does it in the DAL.

Privilege routing lives in one place, `homeFor()` in `proxy.ts`. Marketplace
roles come before admin: the root route sends everyone to the marketplace, so a
user holding a marketplace role should land in it; admin is the fallback for
back-office-only accounts.

> An admin-only account following the Marketplace links in the admin sidebar is
> currently bounced by this guard — it requires a borrower or lender privilege.
> Whether admins get read-only access is an open product decision.

---

## Styling

Tailwind v4, CSS-first. There is no `tailwind.config.ts`.

**Design tokens live in `packages/ui/src/styles/tokens.css`**, not in this app.
`globals.css` imports them. The components in `@repo/ui` are styled entirely
against those variables, so the values belong next to the components — otherwise
a second consumer (`apps/storybook`) has to copy them. See
[apps/storybook/README.md](../storybook/README.md) for the Tailwind v4 details
that bite when wiring up a new consumer.

Two token sets, and they do not overlap:

- **Indigo/zinc** (`bg-primary`, `text-muted-foreground`) — admin back office.
- **`mk-*`** (`bg-mk-paper`, `text-mk-ink`, `text-mk-clay`) — the marketplace
  surface: warm paper with a single clay accent, from the design prototype.
  Namespaced because the prototype's own names (`card`, `info`, `warn`) collide
  with the set above, so these are additive utilities rather than overrides.

`@source` paths in `globals.css` are relative to the CSS file, not the project
root.

---

## Key decisions

**shadcn components live in `packages/ui`, not here.** All 46 are in
`packages/ui/src/components/`; import via `@repo/ui/components/{name}`. `pnpm
shadcn` adds them there. Do not put one in `src/`.

**Module boundary.** `src/components/`, `src/store/` and `src/core/` must not
import from `@/modules/**`. ESLint enforces it. When shared logic appears in a
module, move it up to `core/` — that is how `price-offer.ts` got there.

**One domain model, two lenses.** Borrower and lender read the same
`src/mock/marketplace` and the same `src/core/marketplace/price-offer.ts`, but
render different views. They are not two apps sharing a folder: a lender's buy
rate and a borrower's shaped rate are the same calculation seen from two sides,
and duplicating it is how the two screens end up disagreeing about a deal by a
dollar.

**Mock data is isolated on purpose.** `src/mock/marketplace` holds the domain
model until the API lands. Types and everything downstream are API-agnostic, so
switching over replaces the datasets in that folder and nothing else.
