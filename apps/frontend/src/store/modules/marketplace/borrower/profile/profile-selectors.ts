import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './profile-slice';

const selectDomain = (state: RootState) => state.borrowerProfile ?? initialState;

const selectAccount = createSelector([selectDomain], (s) => s.account);
const selectChecks = createSelector([selectDomain], (s) => s.checks);
const selectEligible = createSelector([selectDomain], (s) => s.eligible);
const selectRefreshing = createSelector([selectDomain], (s) => s.refreshing);
const selectLoading = createSelector([selectDomain], (s) => s.loading);

const selectStaleChecks = createSelector([selectChecks], (checks) =>
  checks.filter((c) => c.freshness === 'stale'),
);

/** Stale data means slower replies and weaker offers (BUSINESS-LOGIC §8). */
const selectHasStale = createSelector([selectStaleChecks], (stale) => stale.length > 0);

/** Share of checks that are fresh — the "profile strength" figure. */
const selectStrength = createSelector([selectChecks], (checks) =>
  checks.length === 0
    ? 0
    : Math.round((checks.filter((c) => c.freshness === 'fresh').length / checks.length) * 100),
);

export const profileSelectors = {
  selectDomain,
  selectAccount,
  selectChecks,
  selectStaleChecks,
  selectHasStale,
  selectStrength,
  selectEligible,
  selectRefreshing,
  selectLoading,
};
