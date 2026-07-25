import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Account, EligibleProduct } from '@/mock/marketplace';
import type { ProfileState, VerificationCheck } from './profile-types';

export const initialState: ProfileState = {
  account: null,
  checks: [],
  eligible: [],
  refreshing: false,
  loading: false,
};

export const profileSlice = createSlice({
  name: 'borrowerProfile',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAccount(state, action: PayloadAction<Account>) {
      state.account = action.payload;
      state.eligible = action.payload.eligible;
    },
    setChecks(state, action: PayloadAction<VerificationCheck[]>) {
      state.checks = action.payload;
    },
    setEligible(state, action: PayloadAction<EligibleProduct[]>) {
      state.eligible = action.payload;
    },
    setRefreshing(state, action: PayloadAction<boolean>) {
      state.refreshing = action.payload;
    },
    /** Read-only re-verification: nothing is re-uploaded, checks just go fresh. */
    markAllFresh(state) {
      state.checks = state.checks.map((c) => ({ ...c, freshness: 'fresh' }));
    },
    reset() {
      return initialState;
    },
  },
});

export const profileSliceActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
