---
title: Canmore Stays Clone
description: Reverse-engineered spec for canmorestays.com — a Hostaway-powered short-term-rental booking website — to be rebuilt on the repo's own Next.js + NestJS/GraphQL stack.
order: 0
---

# Canmore Stays — clone spec

This folder is the **single source of truth** for cloning
[canmorestays.com](https://www.canmorestays.com): a short-term / vacation-rental
booking website for the Canmore / Bow Valley area of Alberta, Canada, operated by
**"Canmore Stays by S&T Properties"**.

The goal is behavioural fidelity, not a byte copy: a developer or agent should be
able to rebuild the guest-facing product — search, listing detail, availability,
pricing, booking, reviews, content pages — on **this repository's own stack**
(Next.js App Router frontend + NestJS/Apollo GraphQL + Prisma/Postgres API),
without visiting the live site again.

> The original site is a **Hostaway** managed booking-engine template
> (`static-production-nextjs.hostaway.com`). We are cloning its **product
> behaviour**, and re-implementing the data + APIs ourselves — we are **not**
> integrating Hostaway. See [System architecture](/specs/canmorestays/09-system-architecture).

## Reading order

1. [Overview & evidence](/specs/canmorestays/01-overview-evidence) — what the product is, and the evidence legend every claim is tagged against
2. [Information architecture](/specs/canmorestays/02-information-architecture) — routes, navigation, global chrome
3. [Design system](/specs/canmorestays/03-design-system) — colors, type, components, responsive rules
4. [Search & discovery](/specs/canmorestays/04-search-discovery) — home search, `/search` results, filters, map, `/all-listings`
5. [Listing detail](/specs/canmorestays/05-listing-detail) — the property page anatomy
6. [Booking & pricing](/specs/canmorestays/06-booking-pricing) — booking widget, quote, fees, cancellation, damage protection
7. [Reviews & content pages](/specs/canmorestays/07-reviews-content-pages) — reviews, home marketing, About, Contact, legal
8. [Data model](/specs/canmorestays/08-data-model) — entities, state, relationships
9. [System architecture](/specs/canmorestays/09-system-architecture) — data flow, rendering, integrations, SEO, analytics
10. [Repository gap analysis](/specs/canmorestays/10-repo-gap-analysis) — what exists vs. what's missing, and the build plan
11. [Acceptance criteria](/specs/canmorestays/11-acceptance-criteria) — testable done-conditions

## Fast facts (Observed)

| | |
|---|---|
| Brand | Canmore Stays by S&T Properties |
| Contact | `hello@stproperties.org` · +1 (403) 668-9366 |
| Inventory | **387** properties ("All"), 9 tagged "Residential" |
| Locations | Any location, Calgary, Canmore, Dead Man's Flats, Golden, Harvie Heights, Invermere, Kimberley, Penticton, Sagle, Whistler |
| Platform (original) | Hostaway booking website (Next.js App Router, RSC) |
| Maps | Leaflet + OpenStreetMap tiles |
| Analytics | GA4 (2 streams), Google Tag Manager, Osano CMP, Sentry |
| Currency | CAD (Canadian) |

## Legacy note

The sibling folder `specs/marketplace/` describes an **unrelated** borrower/lender
lending prototype that predates this work. It is not part of the Canmore Stays
product and should be treated as legacy — do not wire it into the booking clone.
