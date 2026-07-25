# Canmore Stays — evidence log

Captured while reverse-engineering [canmorestays.com](https://www.canmorestays.com)
on 2026-07-25. The spec lives in [`../../specs/canmorestays/`](../../specs/canmorestays/_index.md).

> Binary screenshots were taken during exploration but could not be persisted to
> disk through the available browser tooling (the pane returns images inline, not
> as files). This log records each captured state with enough context to
> re-capture it. Drop the corresponding PNGs here with the filenames below when
> doing a manual verification pass.

| Suggested file | Route | Viewport | State / action |
|---|---|---|---|
| `home-desktop.png` | `/` | 1280×720 | Hero + search bar + Osano consent banner (first load) |
| `home-search-location-open.png` | `/` | 1280×720 | Location dropdown open (Any location, Calgary, Canmore, Dead Man's Flats, Golden, Harvie Heights, Invermere, Kimberley, Penticton, Sagle, Whistler) + amenity chips |
| `home-mobile.png` | `/` | 375×812 | Hamburger nav; search collapsed to 2×2 card; quick-filter chips 2-col |
| `all-listings-desktop.png` | `/all-listings` | 1280×720 | Category tabs All (387)/Residential (9), View on map, card grid |
| `search-results-map.png` | `/search?numberOfGuests=1` | 1280×720 | List + map split view, "387 properties found", Hide map |
| `search-filter-modal.png` | `/search` | 1280×720 | Filter modal: Price (needs dates), Beds/Bedrooms/Bathrooms, Amenities checklist |
| `listing-detail-gallery.png` | `/listings/355029` | 1280×720 | Photo gallery grid + rating badge + "+56 photos" + booking widget |
| `listing-booking-widget.png` | `/listings/355029` | 1280×720 | "Select dates…", Select Dates, Guests, Book now (disabled) |
| `listing-calendar.png` | `/listings/355029` | 1280×720 | 2-month availability calendar (current + next month) |
| `contact-desktop.png` | `/contact-us` | 1280×720 | Contact form + company block |

## Key observed facts (see spec for full detail)

- Platform: **Hostaway** booking website — Next.js App Router / RSC (`static-production-nextjs.hostaway.com`).
- Inventory: **387** properties; locations across Canmore/Bow Valley + Calgary, Golden, Invermere, Whistler, etc.
- Brand tokens: **Source Sans Pro**; buttons `#012622`; text `#05332E`; bg `#F8F8F8`; pill radius 40px.
- Maps: Leaflet + OpenStreetMap. Analytics: GA4 ×2 + GTM + Osano CMP + Sentry.
- Operator: "Canmore Stays by S&T Properties" · `hello@stproperties.org` · +1 (403) 668-9366.
