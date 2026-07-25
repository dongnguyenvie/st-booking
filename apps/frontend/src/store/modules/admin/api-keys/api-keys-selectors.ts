import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './api-keys-slice';

const selectDomain = (state: RootState) => state.adminApiKeys ?? initialState;

const selectCreateDialogOpen = createSelector([selectDomain], (s) => s.createDialogOpen);
const selectDeleteError = createSelector([selectDomain], (s) => s.deleteError);

export const apiKeysSelectors = {
  selectDomain,
  selectCreateDialogOpen,
  selectDeleteError,
};
