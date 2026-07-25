---
title: Design system
description: Brand colors, typography, spacing, core components, and responsive breakpoints — the tokens needed to recreate the look.
order: 3
depends_on: ['canmorestays/02-information-architecture']
---

# Design system

All values below are **Observed** via computed styles unless noted.

## Color tokens

| Token | Value | Usage |
|---|---|---|
| `--brand-900` (primary) | `#012622` rgb(1,38,34) | Primary buttons (Search, Apply, Book now), dark UI |
| `--text` | `#05332E` rgb(5,51,46) | Default body/heading text (very dark green) |
| `--surface` | `#FFFFFF` | Header, cards, modals, search bar |
| `--page-bg` | `#F8F8F8` rgb(248,248,248) | Page background |
| Button text | `#FFFFFF` | On primary buttons |
| Rating badge | dark-green pill, white text | e.g. `5.00 ★` overlaid on card image |

The palette is a **monochrome dark-forest-green + off-white** system; there is no
bright accent color. Star icons are gold/amber. *(Observed.)*

## Typography

- **Family:** `"Source Sans Pro", sans-serif` for both body and headings. *(Observed — load via Google Fonts or self-host.)*
- **Headings:** weight **600**. Hero `<h1>` is very large, uppercase, tight leading, white over the hero image.
- **Section titles** (e.g. "Our top properties", "Amenities", "Reviews") are medium-weight, dark-green, left-aligned.
- Body text weight 400, color `#05332E`.

## Shape & spacing

- **Buttons & pills:** fully rounded — `border-radius: 40px` (pill). Applies to primary buttons, the search bar container, amenity quick-filter chips, category tabs, and the "View on map" / "Hide map" toggles. *(Observed.)*
- **Cards & modals:** large rounded corners (≈16–24px), soft shadow, white surface.
- **Images:** rounded corners; card images crop to a fixed aspect ratio.
- Generous horizontal page gutters on desktop; content is width-constrained/centered.

## Core components

| Component | Behaviour |
|---|---|
| **Search bar** | Pill container, segments *Location · Check-In · Check-Out · Guests · [Search]*. Desktop: single horizontal row. Mobile: white card, 2×2 grid of fields + full-width Search button below. |
| **Location dropdown** | Opens a menu: *Any location* (default, italic) + fixed city list. |
| **Date pickers** | Check-In / Check-Out open a **2-month** range calendar (current + next month), Su–Sa weeks. |
| **Guests stepper** | Numeric, default `1`, +/- control. |
| **Amenity quick-filter chips** | Pills with a radio/circle icon: *Kitchen, Hot tub, Free parking, Pool* (home). Toggle-style. |
| **Category tabs** | `All (387)` (active = filled dark green) / `Residential (9)` (outline). |
| **Rating badge** | Dark-green rounded pill with `N.NN ★`, top-corner overlay on card image. |
| **Property card** | Image carousel (dot indicators) + rating badge + title + "N guests · N bedrooms · N bathrooms" + up to 3 amenity tags. |
| **Filter modal** | Centered dialog: Price (From/To), Rooms & beds steppers, Amenities checklist, `Clear all` / `Apply`, × close. |
| **Map** | Leaflet + OpenStreetMap; numbered cluster markers; home/price pin markers. Split-view alongside the results list. |
| **Photo gallery** | Detail page: 1 large + 4 thumbnail grid with a "+N photos" button opening a full gallery. |

## Responsive breakpoints (Observed behaviour)

- **Mobile (≈375px):** hamburger nav; hero type wraps to 3 lines; search → stacked 2×2 card; quick-filter chips 2-per-row; cards single-column; map hidden behind a toggle.
- **Desktop (≈1280px):** horizontal nav; search bar single-row pill; cards in a 3-column grid; `/search` shows list + map side by side.
- Tablet: intermediate (2-column cards). *(Inferred.)*

## Accessibility (Observed + requirements)

- Star ratings render as repeated `★` and emoji ⭐️ in text; the **numeric** rating (`5.00`) must be present as text (Observed) so it is screen-reader legible.
- Requirements (Assumption for the clone): calendar cells keyboard-navigable and labeled with full dates; disabled (unavailable) dates announced as such; modal focus-trapped; interactive pills are real `<button>`s with accessible names; images have alt text; color is never the sole state signal (already true — labels accompany).
