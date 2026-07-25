'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { dealsA, dealsS } from '@/store/modules/marketplace/lender/deals';
import type { DealsFilter, DealsSort } from '@/store/modules/marketplace/lender/deals/deals-types';
import { MOCK_DESK_KPIS } from '@/mock/marketplace';
import { formatMoneyCompact } from '../../shared/format';
import { DealRow } from './components/deal-row';

const FILTERS: Array<{ id: DealsFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'needs-reply', label: 'Needs reply' },
  { id: 'open', label: 'Not priced' },
  { id: 'offered', label: 'Offered' },
  { id: 'passed', label: 'Passed' },
];

const SORTS: Array<{ id: DealsSort; label: string }> = [
  { id: 'newest', label: 'Newest' },
  { id: 'amount', label: 'Largest' },
  { id: 'competition', label: 'Least crowded' },
];

/**
 * The desk queue — borrower requests this lender can price.
 *
 * Same deals the borrower side renders, read the other way round: the borrower
 * asks "who is cheapest for me", the desk asks "which of these is worth my
 * time, and who am I bidding against".
 */
export function LenderDealsPageFeature() {
  const dispatch = useAppDispatch();
  const deals = useAppSelector(dealsS.selectVisible);
  const filter = useAppSelector(dealsS.selectFilter);
  const sort = useAppSelector(dealsS.selectSort);
  const query = useAppSelector(dealsS.selectQuery);
  const loading = useAppSelector(dealsS.selectLoading);
  const needsReply = useAppSelector(dealsS.selectNeedsReplyCount);
  const quoted = useAppSelector(dealsS.selectQuotedAmount);

  useEffect(() => {
    dispatch(dealsA.init());
    return () => {
      dispatch(dealsA.destroy());
    };
  }, [dispatch]);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-6 py-8">
      <header>
        <h1 className="text-[32px] leading-none font-semibold tracking-tight">Deals</h1>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          {[
            ['Needs reply', String(needsReply)],
            ['Quoted, open', formatMoneyCompact(quoted)],
            ['Offers sent (MTD)', String(MOCK_DESK_KPIS.offersSent)],
            ['Win rate', `${Math.round(MOCK_DESK_KPIS.winRate * 100)}%`],
            ['Avg. time to offer', MOCK_DESK_KPIS.avgTimeToOffer],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
                {label}
              </dt>
              <dd className="mt-1 text-[20px] font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mk-ink-45" />
          <input
            value={query}
            onChange={(e) => dispatch(dealsA.setQuery(e.target.value))}
            placeholder="Search borrower or product"
            className="h-9 w-full rounded-xl border border-mk-line bg-mk-card pl-9 pr-3 text-[13px] outline-none placeholder:text-mk-ink-45 focus:border-mk-clay"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => dispatch(dealsA.setFilter(id))}
              className={cn(
                'h-7 rounded-full px-3 text-[11.5px] font-medium transition-colors',
                filter === id ? 'bg-mk-ink text-mk-paper' : 'bg-mk-paper-3 text-mk-ink-60 hover:text-mk-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="inline-flex gap-0.5 rounded-full bg-mk-paper-2 p-[3px]">
          {SORTS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => dispatch(dealsA.setSort(id))}
              className={cn(
                'h-7 rounded-full px-3 text-[11.5px] font-medium transition-all',
                sort === id ? 'bg-mk-card text-mk-ink shadow-sm' : 'text-mk-ink-60 hover:text-mk-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        {loading ? (
          <ul className="divide-y divide-mk-line">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-4">
                <span className="h-3 w-1/3 animate-pulse rounded bg-mk-ink-08" />
                <span className="ml-auto h-3 w-20 animate-pulse rounded bg-mk-ink-08" />
              </li>
            ))}
          </ul>
        ) : deals.length === 0 ? (
          <p className="px-5 py-12 text-center text-[13px] text-mk-ink-45">
            Nothing matches that filter.
          </p>
        ) : (
          <ul>
            {deals.map((deal) => (
              <DealRow key={deal.id} deal={deal} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
