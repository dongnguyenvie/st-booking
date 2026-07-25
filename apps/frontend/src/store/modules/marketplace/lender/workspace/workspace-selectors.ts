import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './workspace-slice';

const selectDomain = (state: RootState) => state.lenderWorkspace ?? initialState;

const selectNeedsReplyCount = createSelector([selectDomain], (s) => s.needsReplyCount);
const selectQueueCount = createSelector([selectDomain], (s) => s.queueCount);

export const lenderWorkspaceSelectors = {
  selectDomain,
  selectNeedsReplyCount,
  selectQueueCount,
};
