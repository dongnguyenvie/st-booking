import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { findLender } from '@/mock/marketplace';
import { initialState } from './funding-room-slice';

const selectDomain = (state: RootState) => state.borrowerFundingRoom ?? initialState;

const selectLoi = createSelector([selectDomain], (s) => s.loi);
const selectExpandedStipId = createSelector([selectDomain], (s) => s.expandedStipId);
const selectLoading = createSelector([selectDomain], (s) => s.loading);

const selectLender = createSelector([selectLoi], (loi) =>
  loi ? (findLender(loi.lenderId) ?? null) : null,
);

const selectStips = createSelector([selectLoi], (loi) => loi?.stips ?? []);

/** Checks carried over from the profile vs. things the lender still wants. */
const selectVerifyStips = createSelector([selectStips], (stips) =>
  stips.filter((s) => s.group === 'verify'),
);
const selectRequestedStips = createSelector([selectStips], (stips) =>
  stips.filter((s) => s.group === 'req'),
);

const selectApprovedCount = createSelector(
  [selectStips],
  (stips) => stips.filter((s) => s.state === 'approved').length,
);

/** Every stip approved ⇒ funded (BUSINESS-LOGIC §6). */
const selectIsFunded = createSelector(
  [selectStips, selectApprovedCount],
  (stips, approved) => stips.length > 0 && approved === stips.length,
);

const selectProgress = createSelector([selectStips, selectApprovedCount], (stips, approved) =>
  stips.length === 0 ? 0 : Math.round((approved / stips.length) * 100),
);

export const fundingRoomSelectors = {
  selectDomain,
  selectLoi,
  selectLender,
  selectStips,
  selectVerifyStips,
  selectRequestedStips,
  selectApprovedCount,
  selectIsFunded,
  selectProgress,
  selectExpandedStipId,
  selectLoading,
};
