import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './fundings-slice';

const selectDomain = (state: RootState) => state.borrowerFundings ?? initialState;

const selectAll = createSelector([selectDomain], (s) => s.items);
const selectExpandedId = createSelector([selectDomain], (s) => s.expandedId);
const selectLoading = createSelector([selectDomain], (s) => s.loading);

const selectCount = createSelector([selectAll], (items) => items.length);

/**
 * Total ever funded. Deliberately the only money KPI here: Carousel is the
 * venue, not the lender, and repayment happens off-platform — so there is no
 * honest "repaid" number to show (BUSINESS-LOGIC §1, §7).
 */
const selectTotalFunded = createSelector([selectAll], (items) =>
  items.reduce((sum, f) => sum + f.amount, 0),
);

export const fundingsSelectors = {
  selectDomain,
  selectAll,
  selectCount,
  selectTotalFunded,
  selectExpandedId,
  selectLoading,
};
