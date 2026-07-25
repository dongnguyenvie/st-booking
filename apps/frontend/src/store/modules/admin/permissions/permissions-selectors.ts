import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './permissions-slice';

const selectDomain = (state: RootState) => state.permissions ?? initialState;

const selectLoading = createSelector([selectDomain], (s) => s.loadingCount > 0);
const selectRoles = createSelector([selectDomain], (s) => s.roles);
const selectPermissionCatalog = createSelector([selectDomain], (s) => s.permissionCatalog);
const selectError = createSelector([selectDomain], (s) => s.error);
const selectCreateDialogOpen = createSelector([selectDomain], (s) => s.createDialogOpen);
const selectEditingRole = createSelector([selectDomain], (s) => s.editingRole);

export const permissionsSelectors = {
  selectDomain,
  selectLoading,
  selectRoles,
  selectPermissionCatalog,
  selectError,
  selectCreateDialogOpen,
  selectEditingRole,
};
