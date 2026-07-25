import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import type { Offer } from '@/mock/marketplace';
import { initialState } from './offers-slice';
import type { OffersSort } from './offers-types';

const selectDomain = (state: RootState) => state.borrowerOffers ?? initialState;

const selectAll = createSelector([selectDomain], (s) => s.items);
const selectSort = createSelector([selectDomain], (s) => s.sort);
const selectLoading = createSelector([selectDomain], (s) => s.loading);
const selectError = createSelector([selectDomain], (s) => s.error);

const COMPARATORS: Record<OffersSort, (a: Offer, b: Offer) => number> = {
  rate: (a, b) => a.apr - b.apr,
  payment: (a, b) => a.payment - b.payment,
  match: (a, b) => b.match - a.match,
};

/**
 * Priced offers, ranked. Lenders that have not priced yet are excluded here and
 * listed separately — they are not comparable, so ranking them would be a lie
 * (BUSINESS-LOGIC §4).
 */
const selectRanked = createSelector([selectAll, selectSort], (items, sort) =>
  items.filter((o) => o.status === 'offer').sort(COMPARATORS[sort]),
);

/** "Still pricing — they'll get back to you." */
const selectStillPricing = createSelector([selectAll], (items) =>
  items.filter((o) => o.status === 'reviewing'),
);

/** The single best offer, used by the hero card. */
const selectBestOffer = createSelector([selectRanked], (ranked): Offer | null => ranked[0] ?? null);

const selectOfferCount = createSelector([selectRanked], (ranked) => ranked.length);

/** Lowest APR on the board — the headline number on the offers page. */
const selectBestRate = createSelector([selectRanked], (ranked) =>
  ranked.length ? Math.min(...ranked.map((o) => o.apr)) : null,
);

export const offersSelectors = {
  selectDomain,
  selectAll,
  selectRanked,
  selectStillPricing,
  selectBestOffer,
  selectOfferCount,
  selectBestRate,
  selectSort,
  selectLoading,
  selectError,
};
