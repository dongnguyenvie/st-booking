---
title: Roles and accounts
description: Who participates, what an account is, and why switching accounts switches the whole world.
order: 11
---

# Roles and accounts

## Participants

| Role | Privilege | What they do |
|---|---|---|
| Borrower | `BORROWER` (10) | Posts a financing request, compares offers, signs, gets funded |
| Lender | `LENDER` (11) | Prices requests, posts offers, reviews conditions, funds |
| Admin | `SUPER_ADMIN` (1) / `ADMIN` (2) | Back office — users, policies, API keys |

`BORROWER` and `LENDER` are **opposite sides of a deal, not a seniority ladder**.
One person can legitimately hold both; the app must not treat either as ranking
above the other. Privilege values are persisted on `User.privileges` and encoded
into issued JWTs, so members may be renamed but **must not be renumbered**.

Carousel is the venue, not a party to the loan. That constraint decides what the
product may claim: it can report what was funded, never how it was repaid.

## Accounts (borrower side)

A borrower holds up to two accounts:

- **Business** — e.g. Northwind Bicycle Co.
- **Personal** — e.g. Avery Singh

All request, offer, LOI and funding state is **per account**. Switching accounts
switches the entire workspace — request, offers, exclusivity, funding history.
It is not a display filter, and code must not treat it as one.

Product catalogues differ by account type:

| Business | Personal |
|---|---|
| Term loan, Equipment, SBA 7(a), Working capital | Auto, Personal loan, Student refi, Debt consolidation |
| *(shared: Mortgage, Line of credit)* | *(shared: Mortgage, Line of credit)* |

A new request can be started for either account from anywhere; choosing the other
account switches workspace and carries the draft request over.

## Desks (lender side)

A lender operates a **desk** — the firm plus the human at it (e.g. Meridian
Funding / Anna Reyes, senior underwriter). A desk declares the products and
regions it serves; those declarations drive which requests reach its queue.

## Open questions

- Can one desk have multiple operators with separate queues, or is the desk the
  unit of work? The prototype models a single operator.
- Is an admin allowed to act as a borrower or lender for support purposes, and
  if so is that audited separately?
