import type { ReactNode } from 'react';

/**
 * Marketplace shell — the venue where the two sides meet.
 *
 * Both the borrower portal and the lender desk live under here because they are
 * two views onto the same deals: a request one side posts is the request the
 * other side prices. Shared here is only what is genuinely shared — the
 * paper-and-clay surface. Each side brings its own chrome (the borrower gets a
 * top nav, the lender a sidebar desk), matching the design prototype.
 *
 * This surface deliberately opts out of the app-wide zinc/indigo tokens used by
 * admin and paints its own `mk-*` palette instead.
 */
export default function MarketplaceLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-mk-paper text-mk-ink">{children}</div>;
}
