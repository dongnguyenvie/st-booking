---
title: Funding room
description: Everything after the LOI — conditions, revisions, and disbursement.
order: 15
depends_on: ['marketplace/letter-of-intent']
---

# Funding room

Where the deal lives after the LOI is signed.

## Conditions (stips)

Conditions are requested by the lender **after** the LOI — never before. Before
signing, the offer page only previews *how funding works*; it does not list
conditions, because the lender has not set them yet.

Two groups:

| Group | Source | Example |
|---|---|---|
| Carried over | Auto-satisfied from the unified profile | Identity, business bank |
| Requested | The borrower must act | YTD P&L, certificate of insurance, personal guarantee |

Each condition moves: `requested → submitted → lender reviews → approved`, or
back to the borrower as *returned* for re-submission.

**Every condition approved ⇒ funded.** There is no separate approval step.

Submitting is **not** approving. A submitted condition sits with the lender; the
progress figure must not count it as done.

## Disbursement

On the final approval: funds disburse to the borrower's bank (~38 hours),
exclusivity ends, and the market re-opens. From the funded state the borrower can
review the funding record or start a new request — which archives this one.

## Revisions after the LOI

A lender may send **revised terms** after signing. On the borrower side this
lands as a pending revision:

- a banner plus a "Review & re-sign" modal showing the old → new diff
  (amount / APR / term / payment) and which documents are being re-issued
- **locked terms do not change until the borrower accepts**; declining keeps the
  current terms
- accepting replaces the locked terms and opens a re-sign panel for the re-issued
  documents (loan agreement / PAD / personal guarantee, whichever was flagged)
- already-approved conditions **stay approved**

## Negotiation history

A card shows the full trail — request → posted offer → signed LOI → every
revision, with the current offer marked. **The lender desk sees the same trail.**
It is one negotiation with two views, not two logs.

## Still circling

A feed lists other lenders watching but paused under the exclusivity. They
re-open the moment the borrower funds or cancels.

## Acceptance criteria

- [ ] No condition is visible to the borrower before the LOI is signed.
- [ ] Progress counts approved conditions only — submitted does not increment it.
- [ ] Funded state is reached exactly when the last condition is approved.
- [ ] A pending revision leaves locked terms untouched until accepted.
- [ ] Declining a revision keeps the previously locked terms.
- [ ] The trail rendered to the borrower matches the trail rendered to the lender.
