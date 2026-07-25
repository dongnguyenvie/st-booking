---
title: Acceptance criteria
description: Testable done-conditions for the clone, plus the open questions that must be verified against the live site before locking implementation.
order: 11
depends_on: ['canmorestays/10-repo-gap-analysis']
---

# Acceptance criteria

Given/When/Then style. "AC" = a clone behaviour that must hold; each maps to
business rules in specs 04–07.

## Discovery

- **AC-1** Given the home page, When it loads, Then the hero, search bar (Location/Check-In/Check-Out/Guests/Search), amenity quick-filter chips, ~15 "top properties" cards, an "Explore all properties (N)" CTA, and the operator blurb are all present.
- **AC-2** Given the search bar, When I pick a location, dates and guests and press Search, Then I land on `/search` with the corresponding query params and a list of matching listings + a live "N properties found" count + a map.
- **AC-3** Given `/search`, When I open Filter and set beds/bedrooms/bathrooms/amenities and Apply, Then results, count, map and URL update to reflect the filters (amenities conjunctive; rooms as minimums).
- **AC-4** Given the Filter modal with no dates chosen, Then the Price From/To inputs are disabled with the message "To filter by price, please select dates."
- **AC-5** Given `/all-listings`, Then category tabs "All (N)" / "Residential (N)" filter the grid and a "View on map" toggle switches to a map.
- **AC-6** Given any property card, Then it shows an image carousel, a 2-dp rating badge (omitted when no rating), title, "N guests · N bedrooms · N bathrooms", and up to 3 amenity tags, and links to `/listings/{id}`.

## Listing detail

- **AC-7** Given `/listings/{id}`, Then the page shows the photo gallery (+N photos), title + type + capacity, rating "(N)", description with Show more, featured amenities + "Show all N amenities", a 2-month availability calendar, reviews, a map, and Good-to-know (house rules + cancellation policy).
- **AC-8** Given the availability calendar, Then past and blocked dates are non-selectable, and check-out must be after check-in.
- **AC-9** Given the booking widget with no valid dates, Then "Book now" is disabled and the prompt asks to select check-in/check-out.
- **AC-10** Given valid dates + guests, Then a price breakdown renders (accommodation, fees, taxes, total, CAD) and "Book now" enables. *(Depends on Q1/Q2 verification.)*

## Booking, reviews, content

- **AC-11** Given a valid quote, When I complete checkout (guest details + payment + agree to terms/cancellation), Then a reservation is created, the dates are blocked, and I see a confirmation + receive an email. Server re-validates availability + re-prices at submit. *(Depends on Q2.)*
- **AC-12** Given a listing's cancellation policy, Then refund tiers are shown as text and enforced on cancellation (e.g. 100% up to 2 days after reservation; 50% up to 14 days before arrival).
- **AC-13** Given reviews, Then they render most-recent-first with reviewer name, month + year, star value and Show-more body; the listing rating is their 2-dp aggregate; no on-site guest submission exists.
- **AC-14** Given the Contact page, When I submit a valid form (name/email/phone/message + consent), Then the enquiry persists, the operator is notified, and I see a success state; invalid/missing fields are blocked client-side.
- **AC-15** Given first visit, Then a consent banner appears gating non-essential analytics, with a footer "Cookie Preferences" re-entry.

## Non-functional

- **AC-16** Listing/search pages are server-rendered and crawlable with correct `<title>`/meta + structured data; a listings sitemap exists.
- **AC-17** Card and gallery images lazy-load; 387 results paginate/virtualize without jank.
- **AC-18** The UI matches [Design system](/specs/canmorestays/03-design-system): Source Sans Pro, forest-green `#012622` pill buttons, `#05332E` text, `#F8F8F8` background; responsive per the mobile/desktop rules (hamburger nav, stacked search card, single-column cards on mobile).
- **AC-19** Calendar, modal and interactive pills are keyboard-accessible and screen-reader legible (numeric rating as text, dated calendar cells, focus-trapped modals).

## Open questions to verify against the live site (must close before Q-dependent ACs lock)

| # | Question | Closes |
|---|---|---|
| **Q1** | Exact price-breakdown line items + tax/fee names on a selected-date quote (select real dates on a listing). | AC-10; spec 06 |
| **Q2** | Post-"Book now" checkout: form fields, payment provider, confirmation + email. | AC-11; spec 06 |
| **Q3** | Full `/search` query-param names (location, checkIn, checkOut, amenities, beds/bedrooms/bathrooms, price). | AC-2/3; spec 04 |
| **Q4** | Min-stay / advance-notice / length-of-stay discount rules. | AC-8/10; spec 06 |
| **Q5** | "Residential" category semantics + any other categories/property types. | AC-5; spec 04 |
| **Q6** | Damage-protection fee mechanics + whether it's a checkout line item. | AC-12; spec 06 |
| **Q7** | Contact-form success UX + destination (email/CRM). | AC-14; spec 07 |

Until a Q is closed, its dependent behaviour is built from the **Inferred** model
in specs 04/06/07 and must be revisited.
