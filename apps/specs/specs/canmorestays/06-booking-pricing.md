---
title: Booking & pricing
description: The quote/pricing model, booking flow after "Book now", cancellation policy tiers, and damage protection.
order: 6
depends_on: ['canmorestays/05-listing-detail']
---

# Booking & pricing

> **Confidence note.** The priced quote and post-"Book now" checkout could not be
> reached by automation (Book now stays disabled until a real date selection, and
> the quote streams server-side). Everything marked *Inferred* here is modelled on
> Hostaway's standard booking-engine behaviour and must be **verified** by
> manually selecting dates on the live site before implementation locks. See
> [Acceptance criteria](/specs/canmorestays/11-acceptance-criteria).

## Quote model (Inferred)

A quote is a pure function of `(listingId, checkIn, checkOut, guests)` →

```
nights           = checkOut - checkIn
accommodation    = Σ nightlyRate(date) for date in [checkIn, checkOut)
cleaningFee      = per-stay fixed
serviceFee       = per-stay (management/service), possibly % of accommodation
taxes            = % (e.g. Alberta tourism levy + GST) on the taxable subtotal
discounts        = weekly/monthly length-of-stay discounts, promos (subtracted)
total            = accommodation - discounts + cleaningFee + serviceFee + taxes
damageDeposit?   = held (not always charged)
```

Observed anchors:
- The widget copy says "**total price per night**" → the UI headlines a **per-night average** derived from the total. *(Observed copy; derivation Inferred.)*
- Currency is **CAD**. *(Inferred — Canmore/Alberta operator.)*
- **Nightly rate is dynamic per date** (why the price filter needs dates). *(Observed dependency.)*

### Pricing business rules

- **BR-P1** No price is shown until both dates + guests are set. *(Observed.)*
- **BR-P2** Nightly rate varies by date (seasonality, weekend, demand). *(Observed via price-needs-dates rule.)*
- **BR-P3** Length-of-stay discounts may apply for longer ranges (weekly/monthly). *(Inferred — verify.)*
- **BR-P4** Min-stay per listing/season blocks too-short ranges; the calendar disallows an invalid check-out. *(Inferred — verify.)*
- **BR-P5** Guest count above `maxGuests` is not selectable. *(Inferred.)*
- **BR-P6** Fees and taxes are additive line items surfaced before payment. *(Inferred.)*

## Booking flow (Inferred — verify)

1. On `/listings/{id}`, guest selects dates + guests → quote renders, **Book now** enables.
2. **Book now** → a **checkout** step: guest details (name, email, phone), possibly a message, agreement to house rules / terms / cancellation, and **payment** (card).
3. Payment captured (provider — *Unknown*; Hostaway sites commonly use Stripe). → **Reservation** created (status pending/confirmed), calendar dates blocked.
4. **Confirmation** page + email. *(All Inferred — the checkout screens were not reached.)*

Clone requirement: implement a guest-checkout (no login required) with server-side
re-validation of availability + price at submit time (never trust the client quote).
*(Assumption — standard practice.)*

## Cancellation policy {#cancellation}

Structured refund tiers per listing (Observed on 355029):

- "**100% refund up to 2 days after reservation**" (grace period after booking).
- "**50% refund up to 14 days before arrival**".

Model as an ordered list of tiers: `{ refundPercent, condition: {type: 'days_after_reservation'|'days_before_arrival', days} }`.
Policy text is listing-specific and shown under **Good to know → Cancellation
policy**. *(Observed structure; enumerate all tier types on verify.)*

## Damage protection {#damage-protection}

The footer + a dedicated page `/pages/higuest-host-damage-protection` describe
"**Canmore Stays Host Damage Protection**" — a **HiGuest**-branded damage
protection/waiver. *(Observed link + name.)*

- **Inferred:** a per-booking protection fee (or refundable damage deposit
  alternative) that covers accidental damage, surfaced as a line item / disclosure
  at checkout. Exact amount and mechanics — **verify** on the content page and at
  checkout.

## Lower Price Guarantee (Observed)

The hero subtitle promises "**Lower Price Guarantee | Canadian Owned & Operated**".
Treat as a marketing claim (badge/copy), not a computed discount, unless the
guarantee page defines a mechanic. *(Observed copy; no mechanic observed.)*
