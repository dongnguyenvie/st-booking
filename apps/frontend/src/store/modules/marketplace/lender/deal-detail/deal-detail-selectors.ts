import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { amortisedPayment } from '@/core/marketplace/price-offer';
import { initialState } from './deal-detail-slice';

const selectDomain = (state: RootState) => state.lenderDealDetail ?? initialState;

const selectDeal = createSelector([selectDomain], (s) => s.deal);
const selectAmount = createSelector([selectDomain], (s) => s.amount);
const selectTerm = createSelector([selectDomain], (s) => s.term);
const selectFrequency = createSelector([selectDomain], (s) => s.frequency);
const selectApr = createSelector([selectDomain], (s) => s.apr);
const selectLoading = createSelector([selectDomain], (s) => s.loading);
const selectError = createSelector([selectDomain], (s) => s.error);

/** Payment implied by the terms the desk is composing. Derived, never stored. */
const selectComposedPayment = createSelector(
  [selectAmount, selectTerm, selectApr, selectFrequency],
  (amount, term, apr, frequency) => amortisedPayment(amount, apr, term, frequency),
);

/**
 * How this desk's rate compares with the best on the board. Positive means we
 * are more expensive than the leader — the number that decides whether it is
 * worth pricing at all.
 */
const selectAprGapToBest = createSelector([selectApr, selectDeal], (apr, deal) =>
  deal ? Number((apr - deal.bestApr).toFixed(2)) : null,
);

/** True when our composed rate would take the lead on this deal. */
const selectWouldLead = createSelector([selectAprGapToBest], (gap) => gap !== null && gap < 0);

/** Verification gaps an underwriter would want closed before funding. */
const selectVerificationGaps = createSelector([selectDeal], (deal) => {
  if (!deal) return [] as string[];
  const v = deal.verifications;
  const gaps: string[] = [];
  if (!v.identity) gaps.push('Identity');
  if (!v.businessRegistration) gaps.push('Business registration');
  if (!v.businessBank) gaps.push('Business bank');
  if (!v.personalBank) gaps.push('Personal bank');
  if (!v.fresh) gaps.push('Data has aged out');
  return gaps;
});

const selectHistory = createSelector([selectDeal], (deal) => deal?.myOffer?.history ?? []);

export const dealDetailSelectors = {
  selectDomain,
  selectDeal,
  selectComposedPayment,
  selectAprGapToBest,
  selectWouldLead,
  selectVerificationGaps,
  selectHistory,
  selectAmount,
  selectTerm,
  selectFrequency,
  selectApr,
  selectLoading,
  selectError,
};
