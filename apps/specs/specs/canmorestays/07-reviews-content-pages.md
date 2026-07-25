---
title: Reviews & content pages
description: Review data + rules, and the marketing/legal/contact pages (Home, About, Contact form, Privacy, Terms, Damage protection).
order: 7
depends_on: ['canmorestays/05-listing-detail']
---

# Reviews & content pages

## Reviews {#reviews}

Reviews appear on the listing detail page under a **Reviews** heading with the
aggregate "`5.00 (3)`". Each review (Observed):

- **Reviewer name** (e.g. "Sharon Hobbs", "Christopher Smith").
- **Month + year** (e.g. "February 2026", "October 2025"). No day. *(Observed.)*
- **Free-text body**, truncated with **Show more**. Bodies can be long and candid — including negative reviews (one observed review is strongly critical). → **Reviews are not curated/filtered by sentiment.** *(Observed.)*
- Contributes a per-review star value to the **2-dp aggregate**.

Review data model: `{ id, listingId, authorName, month, year, ratingValue, body }`.
*(Ratings are imported from the channel on the original — for the clone, either seed
them or let hosts/admin enter them; guests are **not** observed submitting reviews
on-site.)* *(Inferred.)*

### Review business rules

- **BR-R1** Listing rating = aggregate of its reviews, 2 decimals. No reviews → no rating badge. *(Observed.)*
- **BR-R2** Reviews are shown most-recent-first (Feb 2026 → Jan 2026 → Oct 2025 order observed). *(Observed.)*
- **BR-R3** No on-site guest review submission flow is exposed. *(Observed.)*

## Home (`/`)

- **Hero:** full-bleed mountain photo, dark overlay; `<h1>` "BOOK YOUR NEXT STAY WITH CANMORE STAYS"; subtitle "Lower Price Guarantee | Canadian Owned & Operated"; the search bar overlapping the hero bottom; amenity quick-filter chips below.
- **"Our top properties":** a grid of **15** property cards (subset of inventory, ordered by curation/rating). *(Observed 15.)*
- **"Explore all properties (387)"** CTA → `/all-listings` (or `/search`).
- **"Find Your Property"** operator blurb: pitch on hosting + property management + investment help.

## About (`/about-us`) — Observed copy

Two themes: (1) hospitality/guest experience in the Canadian Rockies; (2) full
property-management services for owners/investors (24/7 guest comms, professional
cleaning, marketing, maintenance, revenue optimization, help finding investment
properties). Ends with a phone CTA "Give us a call at +1 (403) 668-9366".

## Contact (`/contact-us`) — Observed

- Heading "Contact Us", subtitle "Feel free to contact us using the form below".
- **Form fields:** Name, Email, Phone number, (message/textarea), **consent checkbox** "I agree to the Privacy Policy and Terms of Service" (links), **Send** button.
- **Company block:** "Canmore Stays by S&T Properties", `hello@stproperties.org`, +1 (403) 668-9366.
- **Behaviour (Inferred):** submitting posts the enquiry (email/CRM/DB) and shows a success state; client-side validation on required fields + email format; consent required before submit. Exact success UX — *verify*.

## Legal & info pages

- `/privacy-policy`, `/terms-and-conditions` — standard legal copy (content out of scope; clone should host equivalent editable pages).
- `/pages/higuest-host-damage-protection` — damage-protection explainer (see [Damage protection](/specs/canmorestays/06-booking-pricing#damage-protection)).
- The `/pages/{slug}` prefix implies a **generic CMS-style page** route for arbitrary content pages. *(Inferred.)*

## Content-page requirements (clone)

Marketing + legal copy should be **editable content** (CMS/markdown/DB), not
hard-coded, since it changes independently of features. Contact enquiries persist
and notify the operator. *(Assumption.)*
