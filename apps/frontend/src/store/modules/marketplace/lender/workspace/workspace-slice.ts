import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LenderWorkspaceState } from './workspace-types';

export const initialState: LenderWorkspaceState = {
  needsReplyCount: 0,
  queueCount: 0,
};

export const lenderWorkspaceSlice = createSlice({
  name: 'lenderWorkspace',
  initialState,
  reducers: {
    setCounts(state, action: PayloadAction<{ needsReply: number; queue: number }>) {
      state.needsReplyCount = action.payload.needsReply;
      state.queueCount = action.payload.queue;
    },
    reset() {
      return initialState;
    },
  },
});

export const lenderWorkspaceSliceActions = lenderWorkspaceSlice.actions;
export const lenderWorkspaceReducer = lenderWorkspaceSlice.reducer;
