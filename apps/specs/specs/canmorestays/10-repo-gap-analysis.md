---
title: Repository gap analysis
description: What the repo already provides vs. what the Canmore Stays clone needs — classified, with an implementation plan.
order: 10
depends_on: ['canmorestays/09-system-architecture']
---

# Repository gap analysis

Snapshot of `st-booking/` after the lending-marketplace cleanup. The repo is a
**monorepo starter** (auth + RBAC + a Nuxt back office). The booking product is
**greenfield** on top of reusable infrastructure, and there is currently **no
public guest-facing frontend at all** — the old Next.js app was removed with the
lending code.

## Repo inventory (Observed)

| App | State | Relevance to clone |
|---|---|---|
| `apps/api` | NestJS + Apollo GraphQL + Prisma + BullMQ + JWT/Passport + S3 + Swagger. Modules: `role, api-key, auth, two-factor, @core, @shared`. Prisma models: User, Role, Permission, UserRole, Business, ApiKey, TwoFactorChallenge. | **Reuse infra**; add booking domain modules + Prisma models. |
| `apps/web-vue` | Nuxt back office: auth + 2FA, admin dashboard, RBAC, and listings/reservations/reviews pages backed by Pinia stores with placeholder data. | The **admin/host** surface. Swap the store placeholders for the API once it exists. |
| `apps/specs` | This spec hub. | Where this spec lives. |
| `packages/*` | Shared config, RBAC catalog (`@repo/core`), transactional email. | Reuse. `@repo/email` templates are still lending-domain and need rewriting. |

## Classification

### Already implemented (reuse as-is)
- Monorepo tooling (pnpm/turbo), TS config, ESLint/Prettier, Docker.
- **Auth0 + 2FA + RBAC** (User/Role/Permission/ApiKey), with booking roles seeded: `guest`, `host_operator`, `host_owner`, `admin`. → for **admin/host**, not guests.
- **GraphQL API scaffolding** (NestJS + Apollo + Prisma + codegen pipeline).
- **Back-office shell** (Nuxt + Pinia + villus + shadcn-vue, admin layout and nav).
- **Infra**: BullMQ (jobs), AWS S3 (media), Sentry-ready.

### Partially implemented
- **Admin area** — users, permissions, settings, analytics are wired to the API; listings, reservations and reviews render from Pinia stores holding placeholder data, awaiting the API.

### Missing (must build) — the whole booking domain
- **Data model:** Listing, ListingPhoto, Amenity/ListingAmenity, AvailabilityDay, PricingRule, Reservation, Review, CancellationPolicy, Location, ContactEnquiry, ContentPage. (See [Data model](/specs/canmorestays/08-data-model).)
- **API modules:** listing, search/filter, availability, quote/pricing, reservation/checkout, review, location, contact, content-page.
- **A public frontend app** — none exists. The guest funnel needs a new app (or a new surface in an existing one) before any public route can be built.
- **Public routes:** `/` (hero+search+top properties), `/all-listings` (category tabs+map), `/search` (results+filter modal+map), `/listings/{id}` (full detail+booking widget), `/about-us`, `/contact-us`, `/privacy-policy`, `/terms-and-conditions`, `/pages/{slug}`.
- **Components:** SearchBar, LocationDropdown, DateRangeCalendar (2-month), GuestsStepper, AmenityChips, PropertyCard (carousel+rating badge), FilterModal, ResultsMap (Leaflet cluster), PhotoGalleryGrid + lightbox, AmenitiesModal, AvailabilityCalendar, ReviewsList, HouseRules, CancellationPolicy, BookingWidget, CheckoutForm, ContactForm.
- **Cross-cutting:** CMP/consent banner, GA4/GTM tags, SEO meta + structured data + sitemap, CAD currency formatting, brand theme tokens (Source Sans Pro, forest-green).

### Incorrect / to repurpose or remove
- `packages/email` templates are still the lending lifecycle (offers received, LOI signed, stipulations, funding complete). They need replacing with booking mail: reservation confirmed, reservation cancelled, review request, host notification.
- `packages/api/src/links/**` is unused starter scaffolding.

### Unknown / verify (blocks precise implementation)
- Exact price-breakdown line items + checkout screens + payment provider.
- Exact `/search` query-param names (only `numberOfGuests` observed).
- Min-stay / advance-notice / discount rules.
- "Residential" category semantics.
- Damage-protection fee mechanics.

(All listed in [Overview & evidence](/specs/canmorestays/01-overview-evidence) and closed in [Acceptance criteria](/specs/canmorestays/11-acceptance-criteria).)

## Implementation plan (suggested order)

1. **Verify the unknowns** — manually select dates on a live listing; capture the quote breakdown, checkout screens, payment provider, and real `/search` params. Update specs 06 + 04.
2. **Data model + seed** — add Prisma models (spec 08) + a seed of a handful of real listings (photos, amenities, reviews, availability) for development.
3. **API read path** — GraphQL `listings` (filtered + paginated + count), `listing(id)`, `availability`, `location list`.
4. **Public read UI** — stand up the guest-facing app first, then theme tokens + shell (header/footer/consent), Home, `/all-listings`, `/search` (+ filter modal + map), `/listings/{id}` (gallery, amenities, calendar, reviews, map, rules). Match [Design system](/specs/canmorestays/03-design-system).
5. **Quote + booking write path** — `quote`, `createReservation` (server re-validates + re-prices), checkout form, confirmation + email (BullMQ). CancellationPolicy + damage-protection disclosure.
6. **Contact + content pages** — `submitContactEnquiry`, CMS content pages (About/legal/`/pages/{slug}`).
7. **Admin/host** — reuse RBAC to manage listings, availability, reservations, reviews, content.
8. **SEO, analytics, consent, a11y, performance** — meta/structured data/sitemap, GA4+GTM+CMP, keyboard/calendar a11y, image lazy-loading + results virtualization.
9. **E2E** — Playwright over the [acceptance criteria](/specs/canmorestays/11-acceptance-criteria).
