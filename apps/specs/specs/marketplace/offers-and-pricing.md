---
title: Offers and pricing
description: How a lender approval becomes one shapeable offer, and where the brokerage margin lives.
order: 13
depends_on: ['marketplace/request-lifecycle']
---

# Offers and pricing

## An offer is shapeable, not fixed

A lender approval is really a **grid of variants** — amount × term × payment
frequency. The UI collapses that grid into **one shapeable offer** with live
controls:

- **Amount** — slider, up to the maximum approved
- **Term** — chips (12 / 18 / 24 / 36 / 48 / 60 months)
- **Frequency** — monthly or weekly

Price recalculates instantly. The direction of each adjustment:

| Change | Effect on rate | Why |
|---|---|---|
| Shorter term | tighter | less time at risk |
| Smaller draw | tighter | smaller exposure |
| Weekly sweep | tighter | faster repayment cadence lowers risk |

## Brokerage margin — never shown to borrowers

Each lender quote has a hidden **buy side** (Carousel's cost from the lender)
and a visible **sell side** (the APR the borrower sees). The spread is the
brokerage commission, treated like a bid/ask.

> **The borrower UI must never display the spread, the buy side, or anything
> from which either can be derived.**

This is why the two sides cannot share one rendered view of a quote, even though
they share the underlying deal. It is a hard constraint, not a preference.

## Request a better rate

The rescue move when a borrower is about to walk: Carousel gives back ~0.45
points of margin, presented to the borrower as *the lender sharpening their
offer*.

- **One-shot per offer.** Once spent, the control is disabled.
- The floor is the buy side (`apr − 1.05` in the prototype). Pricing may never
  go below it.

## Payment maths

Both sides must compute the same payment for the same terms, or one deal would
show two numbers. Standard amortisation:

```
n = term in months (monthly) | round(term / 12 × 52) (weekly)
r = apr / 100 / paymentsPerYear
payment = amount × r × (1+r)^n / ((1+r)^n − 1)
```

## Acceptance criteria

- [ ] No borrower-facing response contains the buy side or the spread.
- [ ] "Request a better rate" can be used at most once per offer.
- [ ] Shaped price never drops below the buy-side floor.
- [ ] The payment shown to a borrower for terms T equals the payment the lender desk computes for T.

## Open questions

- Does the margin vary per lender, or is one global spread applied? The prototype
  uses a single constant; a real commission model (buy rate / sell rate / points,
  per lender) is still to be designed.
