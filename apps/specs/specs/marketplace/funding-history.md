---
title: Funding history
description: The permanent record of every funding — and the one thing it must never claim.
order: 18
depends_on: ['marketplace/funding-room']
---

# Funding history

Every funding ever completed, newest first.

## KPIs — and a hard limit

Only two figures are shown: **total funded** and **count**.

> Carousel is the venue, not the lender. Repayment happens off-platform, so the
> product has no truthful basis for any repayment metric. Do not add "repaid",
> "on-time rate", or anything implying knowledge of repayment behaviour.

This is a correctness constraint, not a scope decision.

## The record

Each row expands to details, and from there to a full record page — the complete
data trail:

- **Intake** — the request and the verifications as the lender saw them
- **Offers** — every offer received, with the signed one highlighted
- **Conditions** — all of them, with documents
- **Final terms**
- **Timeline**
- **Signed documents** — LOI, loan agreement, disbursement confirmation
- **Audit ID**

Everything reviewable and downloadable. The record is what makes a funded deal
defensible after the fact.

## Acceptance criteria

- [ ] History is scoped to the active account.
- [ ] Only total-funded and count are presented as KPIs.
- [ ] No surface claims knowledge of repayment.
- [ ] A funded deal's record includes every offer received, not only the signed one.
