---
title: Letter of intent
description: The commitment point — terms lock, exclusivity starts, the market goes read-only.
order: 14
depends_on: ['marketplace/offers-and-pricing']
---

# Letter of intent (LOI)

The borrower picks **one** offer and signs an LOI. This is the commitment point
of the whole product.

## What signing does

1. **Terms lock at signature.** The signed amount, APR, term and payment are
   frozen and do not move unless the borrower accepts a revision.
2. **Exclusivity starts.** While under LOI the borrower can interact only with
   that lender. Other offers pause; the market renders read-only (other rows
   dimmed and non-interactive).
3. **One LOI at a time.** There is no way to hold two.

## Cancelling

Allowed any time **before** funding. Cancelling:

- releases exclusivity and re-opens the market
- forfeits the locked rate and queue position
- **keeps** any already-approved conditions on the profile

## Why there are no parallel negotiations

An earlier design had multiple "active negotiations" running at once. It was
removed because it directly conflicts with exclusivity: if a borrower can only
transact with one lender after signing, letting them run parallel threads before
signing sets up an expectation the LOI then breaks.

## Acceptance criteria

- [ ] Signing an LOI makes every other offer non-interactive.
- [ ] The borrower cannot sign a second LOI while one is active.
- [ ] Cancelling restores the market to fully interactive.
- [ ] Cancelling does not remove approved conditions from the profile.
- [ ] Locked terms are unchanged by anything except an accepted revision.
