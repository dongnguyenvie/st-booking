import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PermissionsState, RoleItem, PermissionItem } from './permissions-types';

export const initialState: PermissionsState = {
  loadingCount: 0,
  roles: [],
  permissionCatalog: [],
  error: null,
  createDialogOpen: false,
  editingRole: null,
};

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    pushLoading(state) {
      state.loadingCount++;
    },
    popLoading(state) {
      if (state.loadingCount > 0) state.loadingCount--;
    },
    setRoles(state, action: PayloadAction<RoleItem[]>) {
      state.roles = action.payload;
    },
    setPermissionCatalog(state, action: PayloadAction<PermissionItem[]>) {
      state.permissionCatalog = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    openCreateDialog(state) {
      state.createDialogOpen = true;
      state.editingRole = null;
    },
    openEditDialog(state, action: PayloadAction<RoleItem>) {
      state.createDialogOpen = true;
      state.editingRole = action.payload;
    },
    closeDialog(state) {
      state.createDialogOpen = false;
      state.editingRole = null;
    },
    /** Reset all state — called on page unmount */
    reset() {
      return initialState;
    },
  },
});

export const permissionsSliceActions = permissionsSlice.actions;
export const permissionsReducer = permissionsSlice.reducer;
