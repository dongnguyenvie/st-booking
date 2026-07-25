---
title: Overview & evidence
description: What Canmore Stays is as a product, the domain glossary, and the evidence legend that grades every claim in this spec.
order: 1
---

# Overview & evidence

## What the product is

Canmore Stays is a **short-term-rental booking website**. A guest can:

- browse a catalogue of ~387 vacation properties in the Bow Valley / Canadian Rockies,
- search and filter them by location, dates, guest count and amenities,
- view a property in detail (photos, amenities, availability calendar, reviews, map, rules),
- get a **total price for chosen dates + guests**, and start a booking ("Book now"),
- read marketing / About / legal content and contact the operator.

It is simultaneously a **property-management sales funnel**: the operator
("S&T Properties") both hosts guests and pitches property owners on full-service
management (24/7 guest comms, cleaning, marketing, maintenance, revenue
optimization). See [content pages](/specs/canmorestays/07-reviews-content-pages).

There is **no guest login / account area** observed on the public site — booking
is a guest-checkout flow, not an authenticated dashboard. (The repo has Auth0/RBAC
infra, but the guest funnel does not require it.) *(Observed: no account/login nav; Inferred: guest checkout.)*

## Domain glossary

| Term | Meaning |
|---|---|
| **Listing / Property** | A rentable unit. Has an id (numeric on the original, e.g. `355029`), title, type (Villa, Condo, Apartment…), capacity, amenities, photos, location, house rules, cancellation policy. |
| **Category** | A grouping tab on `/all-listings`: "All" (387) and "Residential" (9). |
| **Location** | A city/town the inventory is filtered by (a fixed dropdown derived from listing cities). |
| **Availability / Calendar** | Per-listing per-date state: available or blocked (booked/closed), plus min-stay constraints. |
| **Quote / Price** | Total for a date range + guest count: nightly rates × nights + fees + taxes (± discounts). Dynamic per date. |
| **Reservation / Booking** | A guest's held/confirmed stay for a listing + date range + guests. |
| **Review** | Guest feedback: reviewer name, month/year, free text, star rating; aggregated to a listing rating. |
| **Amenity** | A tagged feature (WiFi, Kitchen, Hot tub, Pool…). Listings have many; a curated subset is filterable. |
| **Damage protection** | "Canmore Stays Host Damage Protection" (HiGuest) — a fee/waiver protecting the host against guest damage. |

## Evidence legend

Every non-trivial claim in this spec is graded. When unmarked, assume **Observed**.

- **Observed** — directly verified in the live site during exploration (DOM text, computed styles, network, screenshots).
- **Inferred** — reasoned from observed behaviour + knowledge of the underlying platform (Hostaway) or standard booking UX. Reasonable but not directly confirmed.
- **Assumption** — a design decision we are choosing for the clone that the site did not force; safe to change.
- **Unknown / verify** — could not be determined; flagged for a follow-up pass before it drives implementation.

## What could NOT be fully verified (Unknown / verify)

The MCP browser did not capture XHR/fetch traffic (data arrives via Next.js
React-Server-Component streaming / server actions), and the booking widget's
`Book now` stays disabled until a valid date range is chosen via real React
events — which synthetic clicks did not trigger. Therefore the following are
**Inferred** and must be verified before locking implementation:

1. **Exact price-breakdown line items** on a selected-date quote (base rate, cleaning fee, service/management fee, taxes, damage-protection fee, discounts, damage deposit). — *Inferred from Hostaway's standard quote model.*
2. **The post-"Book now" checkout flow** (guest-info form fields, payment provider, confirmation page). — *Unknown; needs a real date selection to reach.*
3. **Exact search query-param names** beyond `numberOfGuests` (location, `checkIn`, `checkOut`, amenities, beds/bedrooms/bathrooms, price). — *Partially observed (`numberOfGuests`); rest Inferred.*
4. **Min-stay / advance-notice / gap rules** per listing. — *Inferred from booking-engine norms.*
5. **Whether `/all-listings` categories are editorial tags or property types.** — *Observed labels only.*

See [Acceptance criteria](/specs/canmorestays/11-acceptance-criteria) for how each is closed out.
