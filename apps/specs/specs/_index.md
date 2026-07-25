---
title: Carousel Marketplace
description: A venue where borrowers post financing requests and lenders compete to fund them.
order: 0
---

# Carousel Marketplace

Carousel is a **venue**, not a lender. Borrowers post a financing request once;
lenders on the panel compete to fund it. Money never moves on-platform, so
nothing here describes repayment behaviour — only what was requested, offered,
signed and funded.

## The two sides

One marketplace, two lenses onto the same deals:

| | Borrower portal | Lender desk |
|---|---|---|
| Asks | "Who is cheapest for me?" | "Which of these is worth pricing, and who am I bidding against?" |
| Sees | Offers made to them, ranked best-rate-first | A queue of live requests, with their own position on each |
| Prototype | `live.html` | `lender.html` |

A request one side posts is the request the other side prices. They share one
domain model; the difference is entirely in what each is allowed to see and what
question the screen answers.

## Reading order

1. [Roles and accounts](/specs/marketplace/roles-and-accounts) — who holds what
2. [Request lifecycle](/specs/marketplace/request-lifecycle) — gathering → offers → LOI → funded
3. [Offers and pricing](/specs/marketplace/offers-and-pricing) — how a quote is shaped and priced
4. [Letter of intent](/specs/marketplace/letter-of-intent) — the commitment point and exclusivity
5. [Funding room](/specs/marketplace/funding-room) — stips, revisions, disbursement
6. [Lender desk](/specs/marketplace/lender-desk) — the other side of the venue
7. [Verification freshness](/specs/marketplace/verification-freshness) — why stale data costs money
8. [Funding history](/specs/marketplace/funding-history) — the permanent record

## Source

These specs are written from the design prototype in
`local-docs/mockup/marketplace/`: `live.html` + `live-app.jsx` (borrower),
`lender.html` + `lender-*.jsx` (lender desk), and `BUSINESS-LOGIC.md`. Where a
spec and the prototype disagree, the spec is what gets corrected first.
