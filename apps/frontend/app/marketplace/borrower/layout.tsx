import type { ReactNode } from 'react';
import { BorrowerTopNav } from '@/modules/marketplace/borrower/layout/borrower-top-nav';
import { MarketTicker } from '@/modules/marketplace/borrower/layout/market-ticker';

/**
 * Borrower portal chrome — top nav + live activity strip, per `live.html`.
 * The paper surface itself comes from the parent marketplace layout.
 */
export default function BorrowerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <BorrowerTopNav />
      <MarketTicker />
      <main className="flex-1">{children}</main>
    </div>
  );
}
