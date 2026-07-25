import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserListItem } from '@/core/admin/user-types';
import type { UsersState } from './users-types';

export const initialState: UsersState = {
  policiesUser: null,
  privilegesUser: null,
  refreshKey: 0,
};

export const usersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    openPoliciesDialog(state, action: PayloadAction<UserListItem>) {
      state.policiesUser = action.payload;
    },
    openPrivilegesDialog(state, action: PayloadAction<UserListItem>) {
      state.privilegesUser = action.payload;
    },
    closeDialogs(state) {
      state.policiesUser = null;
      state.privilegesUser = null;
    },
    /** Call after a mutation so the grid refetches. */
    refresh(state) {
      state.refreshKey += 1;
    },
    reset() {
      return initialState;
    },
  },
});

export const usersSliceActions = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
