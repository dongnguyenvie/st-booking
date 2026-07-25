---
title: Lender desk
description: The other side of the venue — the queue, the competitive picture, and pricing a deal.
order: 16
depends_on: ['marketplace/offers-and-pricing']
---

# Lender desk

The same deals as the borrower portal, read the other way round.

## The queue

Live borrower requests the desk is eligible to price, filtered by the products
and regions the desk declared. Each row carries:

- borrower, product, amount, purpose, how long ago it was posted, expiry
- the applicant's file: tier, revenue, net worth, score, runway, years trading
- verification state (see [freshness](/specs/marketplace/verification-freshness))
- **the competitive picture**: how many offers are already in, and the best APR
  on the board
- **the desk's own position**

## Desk status

| Status | Meaning |
|---|---|
| `open` | Visible, not priced by us |
| `offered` | We posted an offer; the borrower may still be comparing |
| `passed` | We declined, with a reason |
| `signed` | The borrower signed our offer — exclusivity is ours |
| `funded` | All conditions approved, money out |

A passed deal **stays visible with its reason**. A desk needs to see what it
already reviewed and why it walked away; removing the row loses that.

## Needs reply

A deal needs a reply when the borrower moved last and the desk has not answered
— they countered, or they reshaped the offer. This is the desk's triage signal
and drives the queue badge.

## Competitive signal, both directions

`bestApr` is the same number on both sides and means opposite things:

- to the **borrower**: good news, the floor of what they can get
- to the **lender**: the price to beat

## Pricing

The desk composes amount / term / frequency / rate and sees the implied payment
plus how far its rate sits from the board best. The rate set here is the desk's
own price; what the borrower is shown carries Carousel's margin on top, which is
why **no spread is displayed on the desk either** (see
[Offers and pricing](/specs/marketplace/offers-and-pricing)).

Offering **less than requested** is allowed and surfaces on the borrower side as
*"offered a lower amount"*.

## Acceptance criteria

- [ ] A desk only sees requests matching its declared products and regions.
- [ ] Passing a deal keeps the row visible and records the reason.
- [ ] The "needs reply" count matches deals whose last movement was the borrower's.
- [ ] `bestApr` shown to a desk equals the best APR the borrower sees on that request.
- [ ] The composed payment equals the payment the borrower would see for identical terms.

## Not yet specified

The prototype's desk also carries **Today**, **Marketplace**, **Funded** and
**Settings** surfaces, plus freshness policy and CRM export. Only the deal queue
and deal detail are specified here.
