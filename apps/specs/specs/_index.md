---
title: Spec hub
description: Single source of truth for the st-booking product specs. Primary: the Canmore Stays booking-site clone.
order: 0
---

# st-booking — spec hub

This hub holds the reverse-engineered, implementation-ready specs for the
**st-booking** product.

## Primary product — Canmore Stays clone

The active product is a high-fidelity clone of
[canmorestays.com](https://www.canmorestays.com), a Hostaway-powered short-term
rental booking website, rebuilt on this repo's own Next.js + NestJS/GraphQL +
Prisma stack.

➡️ **[Canmore Stays clone spec](/specs/canmorestays)** — start here. It covers the
product overview + evidence legend, information architecture, design system,
search & discovery, listing detail, booking & pricing, reviews & content pages,
data model, system architecture, a repository gap analysis, and testable
acceptance criteria.

## Legacy — Carousel Marketplace

The [`marketplace`](/specs/marketplace) specs describe an **unrelated** lending
venue (borrowers post financing requests; lenders compete to fund them) that
predates the booking work. It is retained for reference only and is **not** part
of the Canmore Stays product — do not wire it into the booking clone. See the
[gap analysis](/specs/canmorestays/10-repo-gap-analysis) for how the legacy
`marketplace/**` code and specs are classified.
