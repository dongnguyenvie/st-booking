---
title: Listing detail
description: The /listings/{id} page anatomy — gallery, header, description, amenities, availability calendar, reviews, map, house rules, cancellation.
order: 5
depends_on: ['canmorestays/04-search-discovery']
---

# Listing detail — `/listings/{id}`

Reference listing observed: **355029** — "The Peak Retreat: NEW Luxe 5BR Mtn Views
+ Hot Tub", type **Villa**, 16 guests / 5 bedrooms / 4 bathrooms, 61 photos,
rating 5.00 (3 reviews).

## Page sections, top to bottom (Observed)

1. **Photo gallery** — a 5-tile grid: 1 large hero (left) + 4 thumbnails (2×2 right), a rating badge overlaid on the hero, and a **"+N photos"** button (e.g. "+56 photos") opening the full gallery (total count e.g. 61). "1 / 61" counter present.
2. **Header** — title; meta line "**Type · N guests · N bedrooms · N bathrooms**" (e.g. "Villa · 16 guests · 5 bedrooms · 4 bathrooms"); rating summary "**5.00 · 3 reviews**" (reviews link → `#reviews`).
3. **Description** — host-written rich text with emoji, truncated with a **Show more** expander.
4. **Amenities** — a short grid of ~6 (e.g. Free WiFi, Kitchen, Air conditioning, Washing Machine, Hot tub, Suitable for children) + **"Show all 70 amenities"** → modal with the full list.
5. **Available days** — an inline **2-month** availability calendar (Su–Sa). Unavailable dates are visually disabled. Prompt "Select check-in and check-out dates" + **Clear dates**. *(This is display + range-selection; the priced booking widget is separate — see below.)*
6. **Reviews** — see [Reviews](/specs/canmorestays/07-reviews-content-pages#reviews). Header "5.00 (3)", each review: reviewer name · month year · text (Show more).
7. **Map** — Leaflet + OpenStreetMap, "Report a map error", centered on the listing's approximate location.
8. **Good to know** —
   - **House Rules:** Check-in time (e.g. "4 pm"), Check-out time ("10 am"), Pets ("not allowed"), Smoking inside ("not allowed"), + **Show more**.
   - **Cancellation policy:** e.g. "100% refund up to 2 days after reservation" / "50% refund up to 14 days before arrival". *(Text varies per listing — see [Booking & pricing](/specs/canmorestays/06-booking-pricing#cancellation).)*

## Booking widget (Observed)

A sticky card on the right (desktop):

- Prompt: **"Select dates and number of guests to see the total price per night."**
- **Select Dates** field → opens the 2-month range calendar.
- **Guests** field (default 1).
- **Book now** button — **disabled until a valid check-in + check-out is chosen**; while incomplete the calendar prompts "Select check-in and check-out dates". *(Observed.)*
- Once valid dates + guests are set, the widget shows a **price breakdown** and enables Book now. **The exact breakdown line items were not reachable via automation — see [Booking & pricing](/specs/canmorestays/06-booking-pricing).** *(Inferred.)*

On mobile the widget collapses to a bottom bar / stacked section. *(Inferred.)*

## Fields a listing must expose (for the clone)

- Identity: id/slug, title, property **type** (Villa/Condo/Apartment/House…).
- Capacity: `maxGuests`, `bedrooms`, `beds`, `bathrooms`.
- Media: ordered photo array (thumbnail + full), total count.
- Description: rich text (markdown/HTML), supports emoji.
- Amenities: full set (e.g. 70) + a "featured" subset for cards.
- Location: city, approx lat/lng for the map (exact address hidden pre-booking — *Inferred*).
- Rating: aggregate (2-dp) + review count; review list.
- House rules: check-in/out times, pets, smoking, + free-form extras.
- Cancellation policy: structured tiers (refund % vs. days-to-arrival).
- Availability: per-date open/closed + min-stay.
- Pricing inputs: base nightly rate(s), fees, taxes, discounts (drives the quote).

## Business rules (listing)

- **BR-L1** Rating is displayed to **2 decimals** (e.g. `5.00`, `4.65`) and derived from the review set. Listings with no reviews show no rating badge. *(Observed.)*
- **BR-L2** The availability calendar shows current month + next; past dates and blocked dates are non-selectable. *(Observed.)*
- **BR-L3** Check-out must be after check-in; the widget enforces a valid range before enabling Book now. *(Observed.)*
- **BR-L4** Exact street address is not shown before booking; only an approximate map location. *(Inferred.)*
