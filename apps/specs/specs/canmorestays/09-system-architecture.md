---
title: System architecture
description: Original tech stack (evidence), rendering/data-flow, integrations, SEO, analytics, and how the clone maps onto this repo's stack.
order: 9
depends_on: ['canmorestays/08-data-model']
---

# System architecture

## Original stack (Observed evidence)

| Concern | Evidence | Reading |
|---|---|---|
| Frontend framework | Scripts from `static-production-nextjs.hostaway.com/_next/static/...`; globals `__next_f`, `__next_s`, `NEXT_DEPLOYMENT_ID` | **Next.js App Router** with **React Server Components** (streaming) |
| Hosting/platform | `hostaway.com` static origin; `www.canmorestays.com` document host | **Hostaway managed booking website** (templated product) |
| Data fetching | No client XHR/fetch captured; content present in initial HTML/RSC payload | **Server-side data fetch** (Hostaway API) rendered via RSC; client stays thin |
| Search submit | Navigates to `/search?numberOfGuests=1` | Query-param-driven server-rendered results |
| Error tracking | `__SENTRY__`, `_sentryNextJsVersion` globals | **Sentry** |
| Analytics | `gtag/js?id=G-DZF2BQ8W47`, `G-YEC8J7LFXN`, `gtm.js?id=GTM-K26DBRKH` | **GA4 (2 streams) + Google Tag Manager** |
| Consent | `cmp.osano.com/.../osano.js` | **Osano CMP** gating analytics |
| Maps | "Leaflet, © OpenStreetMap" attribution | **Leaflet + OSM** tiles, marker clustering |
| Privacy signal | `__uspapi` global | US Privacy / consent string API |

**Conclusion:** canmorestays.com is not bespoke — it's a **Hostaway booking-site
template** wired to the operator's Hostaway account. We clone the *behaviour*; we
own the data + APIs.

## Rendering & data flow (original, Inferred)

- Pages are **server-rendered** (RSC). Listing, search, and calendar data are
  fetched server-side from Hostaway and streamed into the page — hence the empty
  client network log and consumed `__next_f`.
- The priced **quote** and the **checkout** are likely server actions / additional
  server round-trips triggered by valid date selection. *(Inferred — verify.)*
- Client JS handles: gallery, calendar interaction, filter modal, map, consent.

## Clone architecture (this repo)

Rebuild on the repo's own stack — **do not integrate Hostaway**:

- **Frontend** (`apps/frontend`): Next.js App Router + shadcn/Radix + Apollo Client (GraphQL codegen already configured). Public routes per [IA](/specs/canmorestays/02-information-architecture). Server Components for listing/search pages; client components for gallery/calendar/filter/map. Leaflet or MapLibre for maps.
- **API** (`apps/api`): NestJS + **Apollo GraphQL** + **Prisma/Postgres**. Add booking domain modules: `listing`, `amenity`, `availability`, `pricing/quote`, `reservation`, `review`, `location`, `contact`, `content-page`. **BullMQ** for async jobs (emails, calendar sync). **S3** for listing photos.
- **Auth:** the guest funnel is **public** (no login). Reuse the existing Auth0/RBAC only for an **admin/host** area (managing listings, availability, reservations, reviews, content). *(Assumption — the public site shows no guest auth.)*

### Key GraphQL operations (Assumption — shape for the clone)

- `listings(filter: {location, checkIn, checkOut, guests, amenities, beds, bedrooms, bathrooms, priceFrom, priceTo}, page)` → cards + count + map pins.
- `listing(id)` → full detail incl. amenities, photos, reviews, rules, cancellation, availability window.
- `availability(listingId, from, to)` → per-date status + minStay.
- `quote(listingId, checkIn, checkOut, guests)` → price breakdown.
- `createReservation(input)` → booking (server re-validates availability + re-prices).
- `submitContactEnquiry(input)`.

## SEO & meta (requirements)

- Per-page `<title>` observed ("Home", "All listings", "Search results", listing title, "About Us", "Contact Us"). Clone must set semantic titles + meta descriptions, Open Graph images (hero/listing photo), and `Listings/Product`/`LodgingBusiness` structured data. *(Assumption; original uses SSR titles — Observed titles.)*
- SSR/SSG for crawlable listing pages; canonical URLs; sitemap of listings. *(Assumption.)*

## Non-functional requirements

- **Performance:** lazy-load card + gallery images (blank placeholder → image observed); server-render above-the-fold; paginate/virtualize 387 results. *(Observed lazy-load.)*
- **Reliability:** error tracking (Sentry-equivalent); graceful empty/error states (see [Acceptance criteria](/specs/canmorestays/11-acceptance-criteria)).
- **Privacy/consent:** CMP gating non-essential tags; consent re-entry in footer. *(Observed.)*
- **i18n/currency:** CAD, English (en-CA). *(Inferred.)*
