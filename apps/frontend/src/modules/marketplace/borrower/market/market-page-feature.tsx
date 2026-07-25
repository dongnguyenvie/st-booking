'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { marketA, marketS } from '@/store/modules/marketplace/borrower/market';
import { workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { LenderCard } from './components/lender-card';

/**
 * The lender panel — who is on the venue and what they specialise in.
 * Under an LOI this goes read-only: exclusivity means the borrower can only
 * interact with the signed lender (BUSINESS-LOGIC §5).
 */
export function MarketPageFeature() {
  const dispatch = useAppDispatch();
  const lenders = useAppSelector(marketS.selectVisible);
  const kinds = useAppSelector(marketS.selectKinds);
  const query = useAppSelector(marketS.selectQuery);
  const kind = useAppSelector(marketS.selectKind);
  const loading = useAppSelector(marketS.selectLoading);
  const marketLocked = useAppSelector(workspaceS.selectMarketLocked);

  useEffect(() => {
    dispatch(marketA.init());
    return () => {
      dispatch(marketA.destroy());
    };
  }, [dispatch]);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-5 py-8">
      <header>
        <h1 className="text-[32px] leading-none font-semibold tracking-tight">Market</h1>
        <p className="mt-2 text-[13px] text-mk-ink-60">
          {lenders.length} lender{lenders.length === 1 ? '' : 's'} on the venue.
        </p>
      </header>

      {marketLocked && (
        <p className="rounded-xl border border-mk-clay/30 bg-mk-clay-soft px-4 py-3 text-[12.5px] text-mk-clay-deep">
          The market is read-only while you&rsquo;re under a letter of intent.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mk-ink-45" />
          <input
            value={query}
            onChange={(e) => dispatch(marketA.setQuery(e.target.value))}
            placeholder="Search lenders"
            className="h-9 w-full rounded-xl border border-mk-line bg-mk-card pl-9 pr-3 text-[13px] outline-none placeholder:text-mk-ink-45 focus:border-mk-clay"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {['all', ...kinds].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => dispatch(marketA.setKind(k))}
              className={cn(
                'h-7 rounded-full px-3 text-[11.5px] font-medium transition-colors',
                kind === k ? 'bg-mk-ink text-mk-paper' : 'bg-mk-paper-3 text-mk-ink-60 hover:text-mk-ink',
              )}
            >
              {k === 'all' ? 'All' : k}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[104px] animate-pulse rounded-2xl border border-mk-line bg-mk-card" />
          ))}
        </div>
      ) : lenders.length === 0 ? (
        <p className="rounded-2xl border border-mk-line bg-mk-card px-5 py-12 text-center text-[13px] text-mk-ink-45">
          No lenders match that filter.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lenders.map((lender) => (
            <LenderCard key={lender.id} lender={lender} dimmed={marketLocked} />
          ))}
        </div>
      )}
    </div>
  );
}
