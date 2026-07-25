---
title: Data model
description: Entities, relationships, state and enums needed to power the booking clone — mapped to a Prisma/Postgres schema.
order: 8
depends_on: ['canmorestays/06-booking-pricing', 'canmorestays/07-reviews-content-pages']
---

# Data model

Derived from observed UI + inferred Hostaway domain. Types are guidance for the
repo's **Prisma/Postgres** schema (`apps/api/prisma`), not a locked schema.

## Core entities

### Listing
```
id            uuid (public route may use a short id/slug)
title         string
slug?         string unique
type          enum ListingType (VILLA | CONDO | APARTMENT | HOUSE | ...)   // Observed: "Villa"
description   text (rich, emoji-capable)
maxGuests     int
bedrooms      int
beds          int
bathrooms     decimal          // half-baths exist
city          string           // one of the Location list
country       string           // "Canada"
lat, lng      decimal          // approximate, for map
address?      string           // hidden pre-booking
category      enum { ALL implicit, RESIDENTIAL, ... }   // /all-listings tabs
checkInTime   string           // "4 pm"
checkOutTime  string           // "10 am"
petsAllowed   bool
smokingAllowed bool
houseRulesExtra text
cancellationPolicyId  fk
ratingAvg     decimal(3,2) nullable   // derived
reviewCount   int
isActive/isPublished bool
createdAt, updatedAt, deletedAt
```

### ListingPhoto
`{ id, listingId fk, url, thumbnailUrl, sortOrder, caption? }` — ordered; total drives "+N photos".

### Amenity  /  ListingAmenity
- `Amenity { id, key, label, isFilterable }` — filterable subset: Beach front, Swimming pool, Free WiFi, Kitchen, Air conditioning, Washing Machine, Hot tub, Street parking, Suitable for children, Cable TV. (~70 total per listing.)
- `ListingAmenity { listingId, amenityId }` (join).

### AvailabilityDay
`{ id, listingId, date, status enum(AVAILABLE|BOOKED|BLOCKED), minStay int?, nightlyRate decimal? }`
— one row per listing per date (or a calendar-rule table). Drives the calendar + quote + availability filtering.

### PricingRule (optional, if not per-day)
`{ listingId, baseNightly, weekendNightly?, seasonRanges[], cleaningFee, serviceFeePctOrFlat, weeklyDiscountPct?, monthlyDiscountPct?, taxRatePct, damageDeposit?, currency='CAD' }`

### Reservation / Booking
```
id, listingId fk
checkIn, checkOut  date
guests             int
status             enum(PENDING | CONFIRMED | CANCELLED | COMPLETED)
guestName, guestEmail, guestPhone
priceBreakdown     json   // snapshot: accommodation, cleaning, service, taxes, discounts, total, currency
paymentRef?        string
createdAt, updatedAt
```

### Review
`{ id, listingId fk, authorName, month int, year int, ratingValue decimal(3,2), body text, createdAt }`

### CancellationPolicy
`{ id, name, tiers: [{ refundPercent, conditionType(DAYS_AFTER_RESERVATION|DAYS_BEFORE_ARRIVAL), days }] }`

### Location (derived or table)
`{ id, name, city, isActive }` — powers the search dropdown; may be derived `DISTINCT city` instead of a table. *(Assumption.)*

### ContactEnquiry
`{ id, name, email, phone, message, consent bool, createdAt, status }`

### ContentPage (CMS)
`{ slug, title, body(markdown/html), updatedAt }` — for `/about-us`, legal, `/pages/{slug}`.

## Relationships

- Listing 1—N ListingPhoto, ListingAmenity, AvailabilityDay, Review, Reservation.
- Listing N—1 CancellationPolicy.
- Amenity N—N Listing.
- Reservation N—1 Listing.

## Derived / computed

- `Listing.ratingAvg`, `reviewCount` ← aggregate of Reviews (2 dp). *(Observed.)*
- Search result count ← count of listings matching filters. *(Observed.)*
- Quote ← function over AvailabilityDay/PricingRule for the range. *(Inferred.)*
- Location dropdown ← distinct listing cities. *(Inferred.)*

## State machines

- **Reservation:** PENDING → CONFIRMED → COMPLETED; any → CANCELLED (refund per policy tier). *(Inferred.)*
- **AvailabilityDay:** AVAILABLE ↔ BOOKED (on reservation confirm/cancel), BLOCKED (host/admin). *(Inferred.)*

## Notes vs. the repo's existing schema

The current Prisma schema (`apps/api/prisma/schema.prisma`) contains only **auth/RBAC**
models (User, Role, Permission, UserRole, Business, ApiKey, TwoFactorChallenge) —
**none** of the booking entities above exist yet. See
[Repository gap analysis](/specs/canmorestays/10-repo-gap-analysis).
