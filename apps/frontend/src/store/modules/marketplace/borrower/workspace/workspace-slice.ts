import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AccountId, RequestStage } from '@/mock/marketplace';
import type { WorkspaceState } from './workspace-types';

export const initialState: WorkspaceState = {
  activeAccountId: 'business',
  stage: 'offers',
  accountSwitcherOpen: false,
  newRequestOpen: false,
};

export const workspaceSlice = createSlice({
  name: 'borrowerWorkspace',
  initialState,
  reducers: {
    /**
     * Switching accounts switches the whole world, so it also closes the
     * switcher and resets the stage to that account's own position.
     */
    setActiveAccount(state, action: PayloadAction<AccountId>) {
      state.activeAccountId = action.payload;
      state.accountSwitcherOpen = false;
    },
    setStage(state, action: PayloadAction<RequestStage>) {
      state.stage = action.payload;
    },
    setAccountSwitcherOpen(state, action: PayloadAction<boolean>) {
      state.accountSwitcherOpen = action.payload;
    },
    toggleAccountSwitcher(state) {
      state.accountSwitcherOpen = !state.accountSwitcherOpen;
    },
    setNewRequestOpen(state, action: PayloadAction<boolean>) {
      state.newRequestOpen = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const workspaceSliceActions = workspaceSlice.actions;
export const workspaceReducer = workspaceSlice.reducer;
