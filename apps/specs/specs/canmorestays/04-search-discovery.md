---
title: Search & discovery
description: Home search bar, the /search results page, the filter modal, map behaviour, /all-listings catalogue, and the property card.
order: 4
depends_on: ['canmorestays/03-design-system']
---

# Search & discovery

## Home search bar

Fields: **Location · Check-In · Check-Out · Guests · Search**. *(Observed.)*

- **Location** — dropdown, default *Any location*. Options (Observed): `Any location, Calgary, Canmore, Dead Man's Flats, Golden, Harvie Heights, Invermere, Kimberley, Penticton, Sagle, Whistler`. This list is the set of cities the inventory actually sits in. *(Inferred: derived from listing `city`.)*
- **Check-In / Check-Out** — 2-month range calendar.
- **Guests** — stepper, default `1`.
- **Search** — submits to `/search` with query params.

Below the bar: **amenity quick-filter chips** — `Kitchen, Hot tub, Free parking, Pool` — that pre-apply an amenity filter. *(Observed. On mobile they sit under the search card in a 2-column grid.)*

### Submit behaviour (Observed / Inferred)

- Submitting navigates to `/search?…`. **Observed** param: `numberOfGuests=1`.
- **Inferred** additional params when set: location, `checkIn`, `checkOut`, amenity flags. (Exact names — *verify*.) Empty fields are omitted (searching with only guests produced `/search?numberOfGuests=1`). *(Observed.)*

## `/search` — results page

Layout (Observed): top search bar (Location/Check-In/Check-Out/Guests) + **Filter**
button; a heading **"N properties found"** (e.g. "387 properties found"); a
**Hide map / Show map** toggle; a **list of property cards**; and a **map** panel
(side-by-side on desktop).

- With no filters, all 387 are returned. *(Observed.)*
- The map shows **numbered cluster markers** that break into individual pins as you zoom; a home-icon marker denotes a location. *(Observed.)*
- **Business rule:** the results count is live and reflects active filters. *(Inferred.)*

### Filter modal (Observed)

Opened by **Filter**. Sections:

1. **Price** — `From` / `To` numeric inputs. **Disabled until dates are chosen** — shows *"To filter by price, please select dates."* → **Business rule:** price is date-dependent (dynamic nightly pricing), so price filtering requires a date range. *(Observed — this is a key rule.)*
2. **Rooms and beds** — steppers for **Beds**, **Bedrooms**, **Bathrooms** (default 0 = no minimum; value acts as a minimum).
3. **Amenities** — checklist (Observed set): `Beach front, Swimming pool, Free WiFi, Kitchen, Air conditioning, Washing Machine, Hot tub, Street parking, Suitable for children, Cable TV`.
4. Footer: **Clear all** (reset) / **Apply** (commit filters → updates list + count + map + URL params). *(Apply→URL is Inferred.)*

## `/all-listings` — catalogue

Simpler browse view. *(Observed.)*

- Title **"Properties"**.
- Category tabs: **All (387)** (active) / **Residential (9)**. Selecting a tab filters the grid. Counts are shown in the label.
- **View on map** button (top-right) → map view.
- 3-column card grid (desktop).

> **Verify:** whether "Residential" is a property-type filter or an editorial tag,
> and whether more categories exist for other operators. Only `All` + `Residential`
> were present. *(Observed labels; classification Unknown.)*

## Property card {#property-card}

Recurs on Home, `/all-listings`, `/search`. Anatomy (Observed):

- **Image carousel** — swipeable, dot page-indicators; lazy-loaded (blank grey placeholder before load).
- **Rating badge** — dark-green pill `N.NN ★` overlaid top-corner (e.g. `5.00 ★`, `4.90 ★`, `4.65 ★`). Absent when a listing has no rating. *(Observed: some cards show no badge.)*
- **Title** — listing name (e.g. "The Peak Retreat: NEW Luxe 5BR Mtn Views + Hot Tub").
- **Capacity line** — "N guests · N bedrooms · N bathrooms".
- **Amenity tags** — up to 3 (e.g. "Free WiFi · Kitchen · Air conditioning").
- Whole card links to `/listings/{id}`.

## Business rules (search)

- **BR-S1** Default guests = 1; search works with all other fields empty (returns full inventory). *(Observed.)*
- **BR-S2** Price filter is gated on a selected date range. *(Observed.)*
- **BR-S3** Rooms/beds/bathrooms filters are **minimums** (≥ selected). *(Inferred.)*
- **BR-S4** Amenity filters are conjunctive (a listing must have **all** selected amenities). *(Inferred.)*
- **BR-S5** Location filter narrows to listings in that city; *Any location* = no location constraint. *(Inferred.)*
- **BR-S6** When dates are provided, only listings **available for the whole range** (and meeting min-stay) should be returned. *(Inferred — verify.)*
- **BR-S7** Result count string stays in sync with the active filter set. *(Observed count; sync Inferred.)*
