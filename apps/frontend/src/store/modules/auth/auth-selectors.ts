import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './auth-slice';

const selectDomain = (state: RootState) => state.auth ?? initialState;

const selectToken = createSelector([selectDomain], (s) => s.token);
const selectUser = createSelector([selectDomain], (s) => s.user);
const selectIsAuthenticated = createSelector([selectDomain], (s) => s.isAuthenticated);
const selectLoading = createSelector([selectDomain], (s) => s.loadingCount > 0);
const selectErrorAfterSubmit = createSelector([selectDomain], (s) => s.errorAfterSubmit);
const selectActivePrivilege = createSelector([selectDomain], (s) => s.activePrivilege);
const selectTwoFactorChallenge = createSelector([selectDomain], (s) => s.twoFactorChallenge);

export const authSelectors = {
  selectDomain,
  selectToken,
  selectUser,
  selectIsAuthenticated,
  selectLoading,
  selectErrorAfterSubmit,
  selectActivePrivilege,
  selectTwoFactorChallenge,
};
