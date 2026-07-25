'use client';

import { useEffect } from 'react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { offersA, offersS } from '@/store/modules/marketplace/borrower/offers';
import type { OffersSort } from '@/store/modules/marketplace/borrower/offers/offers-types';
import { workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { OfferRow } from './components/offer-row';
import { RequestSummaryCard } from './components/request-summary-card';
import { StillPricingList } from './components/still-pricing-list';

const SORTS: Array<{ id: OffersSort; label: string }> = [
  { id: 'rate', label: 'Best rate' },
  { id: 'payment', label: 'Lowest payment' },
  { id: 'match', label: 'Best match' },
];

/**
 * Offers home — the borrower's ranked board for the live request.
 * One request, one ranked list; there are no parallel negotiations because an
 * LOI is exclusive (BUSINESS-LOGIC §4).
 */
export function OffersPageFeature() {
  const dispatch = useAppDispatch();
  const account = useAppSelector(workspaceS.selectActiveAccount);
  const activeAccountId = useAppSelector(workspaceS.selectActiveAccountId);
  const marketLocked = useAppSelector(workspaceS.selectMarketLocked);
  const ranked = useAppSelector(offersS.selectRanked);
  const stillPricing = useAppSelector(offersS.selectStillPricing);
  const bestOffer = useAppSelector(offersS.selectBestOffer);
  const bestRate = useAppSelector(offersS.selectBestRate);
  const offerCount = useAppSelector(offersS.selectOfferCount);
  const sort = useAppSelector(offersS.selectSort);
  const loading = useAppSelector(offersS.selectLoading);

  // Re-fetch when the account changes — switching accounts swaps the whole world.
  useEffect(() => {
    dispatch(offersA.init());
    return () => {
      dispatch(offersA.destroy());
    };
  }, [dispatch, activeAccountId]);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-5 py-8">
      <RequestSummaryCard account={account} offerCount={offerCount} bestRate={bestRate} />

      {marketLocked && (
        <p className="rounded-xl border border-mk-clay/30 bg-mk-clay-soft px-4 py-3 text-[12.5px] text-mk-clay-deep">
          You&rsquo;re under a letter of intent. Other offers are paused until you fund or cancel.
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-mk-line px-5 py-3.5">
          <div>
            <h2 className="text-[13px] font-semibold">New offers</h2>
            <p className="mt-0.5 text-[11.5px] text-mk-ink-45">
              {offerCount} lender{offerCount === 1 ? '' : 's'} priced your request
            </p>
          </div>
          <div className="inline-flex gap-0.5 rounded-full bg-mk-paper-2 p-[3px]">
            {SORTS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => dispatch(offersA.setSort(id))}
                className={cn(
                  'h-7 rounded-full px-3 text-[11.5px] font-medium transition-all',
                  sort === id ? 'bg-mk-card text-mk-ink shadow-sm' : 'text-mk-ink-60 hover:text-mk-ink',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <ul className="divide-y divide-mk-line">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-4">
                <span className="h-[34px] w-[34px] shrink-0 animate-pulse rounded-lg bg-mk-ink-08" />
                <span className="h-3 w-1/3 animate-pulse rounded bg-mk-ink-08" />
                <span className="ml-auto h-3 w-16 animate-pulse rounded bg-mk-ink-08" />
              </li>
            ))}
          </ul>
        ) : ranked.length === 0 ? (
          <p className="px-5 py-12 text-center text-[13px] text-mk-ink-45">
            No offers yet — lenders are still reviewing your request.
          </p>
        ) : (
          <ul className="divide-y divide-mk-line">
            {ranked.map((offer) => (
              <li key={offer.id}>
                <OfferRow
                  offer={offer}
                  isBest={offer.id === bestOffer?.id}
                  locked={marketLocked}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <StillPricingList offers={stillPricing} />
    </div>
  );
}
