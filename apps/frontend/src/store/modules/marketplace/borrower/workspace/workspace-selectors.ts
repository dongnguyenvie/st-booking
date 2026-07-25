import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { MOCK_ACCOUNTS, MOCK_ACCOUNT_LIST } from '@/mock/marketplace';
import { initialState } from './workspace-slice';

const selectDomain = (state: RootState) => state.borrowerWorkspace ?? initialState;

const selectActiveAccountId = createSelector([selectDomain], (s) => s.activeAccountId);
const selectStage = createSelector([selectDomain], (s) => s.stage);
const selectAccountSwitcherOpen = createSelector([selectDomain], (s) => s.accountSwitcherOpen);
const selectNewRequestOpen = createSelector([selectDomain], (s) => s.newRequestOpen);

/** The full account record every page reads its world from. */
const selectActiveAccount = createSelector([selectActiveAccountId], (id) => MOCK_ACCOUNTS[id]);

const selectAccounts = createSelector([selectDomain], () => MOCK_ACCOUNT_LIST);

/** The active account's live request. */
const selectRequest = createSelector([selectActiveAccount], (a) => a.request);

/** Under LOI the market goes read-only (BUSINESS-LOGIC §5). */
const selectMarketLocked = createSelector([selectStage], (stage) => stage === 'loi' || stage === 'funded');

export const workspaceSelectors = {
  selectDomain,
  selectActiveAccountId,
  selectActiveAccount,
  selectAccounts,
  selectRequest,
  selectStage,
  selectMarketLocked,
  selectAccountSwitcherOpen,
  selectNewRequestOpen,
};
