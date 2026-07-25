import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Loi } from '@/mock/marketplace';
import type { FundingRoomState } from './funding-room-types';

export const initialState: FundingRoomState = {
  loi: null,
  expandedStipId: null,
  loading: false,
};

export const fundingRoomSlice = createSlice({
  name: 'borrowerFundingRoom',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLoi(state, action: PayloadAction<Loi | null>) {
      state.loi = action.payload;
    },
    toggleStip(state, action: PayloadAction<string>) {
      state.expandedStipId = state.expandedStipId === action.payload ? null : action.payload;
    },
    /**
     * Borrower submits a stip; it moves to the lender for review. Approval is
     * the lender's call, so this never jumps straight to `approved`.
     */
    submitStip(state, action: PayloadAction<string>) {
      const stip = state.loi?.stips.find((s) => s.id === action.payload);
      if (!stip) return;
      stip.state = 'submitted';
      stip.history.push({ at: 'Just now', who: 'You', what: 'Submitted for review' });
    },
    reset() {
      return initialState;
    },
  },
});

export const fundingRoomSliceActions = fundingRoomSlice.actions;
export const fundingRoomReducer = fundingRoomSlice.reducer;
