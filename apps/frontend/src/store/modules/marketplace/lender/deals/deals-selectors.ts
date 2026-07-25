import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import type { RequestListing } from '@/mock/marketplace';
import { initialState } from './deals-slice';
import type { DealsSort } from './deals-types';

const selectDomain = (state: RootState) => state.lenderDeals ?? initialState;

const selectAll = createSelector([selectDomain], (s) => s.items);
const selectFilter = createSelector([selectDomain], (s) => s.filter);
const selectSort = createSelector([selectDomain], (s) => s.sort);
const selectQuery = createSelector([selectDomain], (s) => s.query);
const selectLoading = createSelector([selectDomain], (s) => s.loading);

/** A deal needs a reply when the borrower moved last and we haven't answered. */
function needsReply(deal: RequestListing): boolean {
  const kind = deal.myOffer?.activity.kind;
  return kind === 'countered' || kind === 'shaped';
}

const COMPARATORS: Record<DealsSort, (a: RequestListing, b: RequestListing) => number> = {
  // The seed is already newest-first; keep that order stable.
  newest: () => 0,
  amount: (a, b) => b.amount - a.amount,
  // Fewer offers = less crowded = easier to win.
  competition: (a, b) => a.offerCount - b.offerCount,
};

const selectVisible = createSelector(
  [selectAll, selectFilter, selectSort, selectQuery],
  (items, filter, sort, query) => {
    const q = query.trim().toLowerCase();
    return items
      .filter((d) => {
        if (filter === 'all') return true;
        if (filter === 'needs-reply') return needsReply(d);
        return d.deskStatus === filter;
      })
      .filter((d) =>
        q ? d.borrower.toLowerCase().includes(q) || d.product.toLowerCase().includes(q) : true,
      )
      .slice()
      .sort(COMPARATORS[sort]);
  },
);

const selectNeedsReplyCount = createSelector([selectAll], (items) => items.filter(needsReply).length);
const selectOpenCount = createSelector([selectAll], (items) => items.filter((d) => d.deskStatus === 'open').length);
const selectOfferedCount = createSelector([selectAll], (items) => items.filter((d) => d.deskStatus === 'offered').length);

/** Total exposure the desk has quoted but not yet closed. */
const selectQuotedAmount = createSelector([selectAll], (items) =>
  items.filter((d) => d.deskStatus === 'offered').reduce((sum, d) => sum + (d.myOffer?.terms.amount ?? 0), 0),
);

export const dealsSelectors = {
  selectDomain,
  selectAll,
  selectVisible,
  selectNeedsReplyCount,
  selectOpenCount,
  selectOfferedCount,
  selectQuotedAmount,
  selectFilter,
  selectSort,
  selectQuery,
  selectLoading,
};
