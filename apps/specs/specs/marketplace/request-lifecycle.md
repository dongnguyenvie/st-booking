---
title: Request lifecycle
description: From posting a request to a funded, closed deal — and the duplicate guard in between.
order: 12
depends_on: ['marketplace/roles-and-accounts']
---

# Request lifecycle

A request moves through four states. Only one request is live per account at a
time.

## 1. Create

The borrower picks a product, an amount, and optionally a purpose, for a chosen
account. The request goes live immediately — there is no approval step before
lenders can see it.

**Duplicate guard.** Re-requesting the same product *and* amount re-sends or
refreshes the existing request rather than creating a twin. Without this the
board fills with near-identical tabs and lenders price the same deal twice.

## 2. Gathering

The request is live and lenders are reviewing it. This is a matter of minutes,
not days. The borrower sees a waiting state with live activity — which lenders
opened the file, which have priced.

## 3. Offers in

One ranked list, **best rate first**. There are deliberately no parallel
"active negotiations": that concept conflicts with LOI exclusivity (see
[Letter of intent](/specs/marketplace/letter-of-intent)) and was removed.

Lenders who have the request but have not priced it are listed **below** the
ranked offers as *"Still pricing — they'll get back to you"*. They are never
ranked among priced offers: an unpriced lender has nothing to compare.

## 4. Funded → closed

A funded request is **closed**. It disappears from home, and the borrower starts
a fresh request next time. The funding is archived to
[funding history](/specs/marketplace/funding-history).

## State transitions

```
create ──▶ gathering ──▶ offers in ──▶ (sign LOI) ──▶ funding room ──▶ funded ──▶ closed
                                            │
                                            └── cancel LOI ──▶ back to offers in
```

Cancelling an LOI is allowed any time before funding. It releases exclusivity,
re-opens the market, and forfeits the locked rate and queue position. Approved
conditions stay on the profile.

## Acceptance criteria

- [ ] A second request for the same product + amount refreshes the existing one; no duplicate is created.
- [ ] Unpriced lenders never appear in the ranked list.
- [ ] A funded request no longer appears on the borrower's home surface.
- [ ] Switching accounts shows that account's own request, not a filtered view of both.
