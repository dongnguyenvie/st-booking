import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './users-slice';

const selectDomain = (state: RootState) => state.adminUsers ?? initialState;

const selectPoliciesUser = createSelector([selectDomain], (s) => s.policiesUser);
const selectPrivilegesUser = createSelector([selectDomain], (s) => s.privilegesUser);
const selectRefreshKey = createSelector([selectDomain], (s) => s.refreshKey);

const selectPoliciesDialogOpen = createSelector([selectPoliciesUser], (u) => u !== null);
const selectPrivilegesDialogOpen = createSelector([selectPrivilegesUser], (u) => u !== null);

export const usersSelectors = {
  selectDomain,
  selectPoliciesUser,
  selectPrivilegesUser,
  selectPoliciesDialogOpen,
  selectPrivilegesDialogOpen,
  selectRefreshKey,
};
