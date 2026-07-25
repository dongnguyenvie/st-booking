---
title: Information architecture
description: Public routes, global navigation, header/footer chrome, and cross-page shared elements.
order: 2
depends_on: ['canmorestays/01-overview-evidence']
---

# Information architecture

## Route map (Observed)

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero + search + "Our top properties" (15 cards) + "Explore all properties (387)" + operator blurb |
| `/all-listings` | Catalogue | Category tabs `All (387)` / `Residential (9)`, "View on map", card grid |
| `/search` | Search results | Query-param driven, list + map split view, Filter modal, "N properties found" |
| `/listings/{id}` | Listing detail | e.g. `/listings/355029`. `{id}` is a numeric listing id on the original |
| `/about-us` | About | Marketing copy + phone CTA |
| `/contact-us` | Contact | Contact form + company details |
| `/privacy-policy` | Legal | |
| `/terms-and-conditions` | Legal | |
| `/pages/higuest-host-damage-protection` | Damage protection | "Canmore Stays Host Damage Protection" explainer (HiGuest) |

> `/search` vs `/all-listings`: **both** list inventory. `/all-listings` is the
> simple browse catalogue (category tabs, map toggle). `/search` is the
> query-driven results page (dates/guests/location/filters + persistent map).
> The home search bar submits to `/search`. *(Observed.)*

Clone routing (Assumption): mirror these paths. Use a slug or id for listings —
`/listings/{id}`. Keep `/search` and `/all-listings` distinct, or collapse
`/all-listings` into `/search` with default params **only if** the category-tab
UX is preserved.

## Global header (Observed)

- **Left:** Canmore Stays logo (bear + cabin mark, wordmark "CANMORE STAYS"), links to `/` / `https://www.canmorestays.com`.
- **Right (desktop ≥ ~1024px):** horizontal nav `Home · About Us · All listings · Contact Us`, dot-separated, dark-green text on white, sticky.
- **Mobile (< ~768px):** logo + hamburger (☰) toggling a menu with the same links.
- Header is white, full-width, with a subtle bottom divider; stays fixed/sticky on scroll. *(Observed.)*

## Global footer (Observed)

Links: **Privacy Policy · Terms & Conditions · Canmore Stays Host Damage
Protection · Contact Us · Cookie Preferences**, plus company block:

```
Canmore Stays by S&T Properties
+1 (403) 668-9366   (tel: link)
hello@stproperties.org   (mailto: link)
```

"Cookie Preferences" re-opens the Osano consent manager. *(Observed.)*

## Cookie consent (Observed)

On first visit an **Osano** banner appears (bottom): explanatory text, a
**Privacy Policy** link, **Storage Preferences**, per-category toggles
(*Targeted Advertising*, *Personalization*, *Analytics*), and buttons
**Save / Accept All / Reject Non-Essential** plus a close (×). Clone requirement:
a consent banner gating non-essential analytics, with a persistent
"Cookie Preferences" re-entry point in the footer. *(Assumption on exact vendor —
Osano is fine to replace with an equivalent CMP.)*

## Shared card component

Property cards recur on Home, `/all-listings`, and `/search`. See
[Search & discovery → Property card](/specs/canmorestays/04-search-discovery#property-card).
