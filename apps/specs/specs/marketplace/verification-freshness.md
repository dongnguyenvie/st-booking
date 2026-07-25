---
title: Verification freshness
description: Verify once, reuse forever — until it ages out and starts costing money.
order: 17
depends_on: ['marketplace/roles-and-accounts']
---

# Verification freshness

## Verify once, durable

Four checks make up the unified profile: identity, business registration,
business bank, personal bank. They are **verify-once and durable** — returning
users never re-onboard.

Onboarding runs all checks **sequentially inside a single modal**, never bouncing
back to a gateway between them, and lands on the profile at the end.

## Reuse as conditions

Because the profile carries them, these checks auto-satisfy the matching
conditions in the [funding room](/specs/marketplace/funding-room). The borrower
never re-uploads what the profile already holds.

## Going stale

After a funded cycle, verifications **go stale** — bank data and registry checks
age out. Stale data has real consequences:

- slower lender replies
- weaker offers
- individual lenders may demand fresher checks before pricing at all

Stale state surfaces in two places: on the borrower's offers screen, and on the
lender's queue row for that request.

## Refreshing

A read-only refresh, roughly a minute: checks run sequentially while the profile
visibly updates (strength percentage rising, fields flipping to fresh). **Nothing
is re-uploaded** — it re-reads sources the borrower already connected.

Freshness resets to stale after each funded cycle.

## Acceptance criteria

- [ ] A returning borrower is never asked to redo a completed verification.
- [ ] Profile strength reflects the share of checks that are present and fresh.
- [ ] Refresh requires no uploads.
- [ ] After a funding completes, checks return to stale.
- [ ] Stale state is visible to lenders, not only to the borrower.
