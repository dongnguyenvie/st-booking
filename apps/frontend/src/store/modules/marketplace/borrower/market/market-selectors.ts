import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './market-slice';

const selectDomain = (state: RootState) => state.borrowerMarket ?? initialState;

const selectAll = createSelector([selectDomain], (s) => s.lenders);
const selectQuery = createSelector([selectDomain], (s) => s.query);
const selectKind = createSelector([selectDomain], (s) => s.kind);
const selectLoading = createSelector([selectDomain], (s) => s.loading);

/** Distinct product kinds present in the panel, for the filter chips. */
const selectKinds = createSelector([selectAll], (lenders) =>
  Array.from(new Set(lenders.map((l) => l.kind))).sort(),
);

/** Panel after the search box and the kind chip, ranked by borrower rating. */
const selectVisible = createSelector([selectAll, selectQuery, selectKind], (lenders, query, kind) => {
  const q = query.trim().toLowerCase();
  return lenders
    .filter((l) => (kind === 'all' ? true : l.kind === kind))
    .filter((l) => (q ? l.name.toLowerCase().includes(q) : true))
    .sort((a, b) => b.rating - a.rating);
});

export const marketSelectors = {
  selectDomain,
  selectAll,
  selectVisible,
  selectKinds,
  selectQuery,
  selectKind,
  selectLoading,
};
