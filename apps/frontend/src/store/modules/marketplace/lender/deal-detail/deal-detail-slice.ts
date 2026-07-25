import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PaymentFrequency, RequestListing } from '@/mock/marketplace';
import type { DealDetailState } from './deal-detail-types';

export const initialState: DealDetailState = {
  deal: null,
  amount: 0,
  term: 36,
  frequency: 'monthly',
  apr: 0,
  loading: false,
  error: null,
};

export const dealDetailSlice = createSlice({
  name: 'lenderDealDetail',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    /** Seed the composer from our existing offer, or from the request if unpriced. */
    setDeal(state, action: PayloadAction<RequestListing>) {
      const deal = action.payload;
      state.deal = deal;
      state.amount = deal.myOffer?.terms.amount ?? deal.amount;
      state.term = deal.myOffer?.terms.term ?? 36;
      state.apr = deal.myOffer?.terms.apr ?? Number((deal.bestApr + 0.4).toFixed(2));
      state.frequency = 'monthly';
      state.error = null;
    },
    setAmount(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    setTerm(state, action: PayloadAction<number>) {
      state.term = action.payload;
    },
    setFrequency(state, action: PayloadAction<PaymentFrequency>) {
      state.frequency = action.payload;
    },
    setApr(state, action: PayloadAction<number>) {
      state.apr = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const dealDetailSliceActions = dealDetailSlice.actions;
export const dealDetailReducer = dealDetailSlice.reducer;
