import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Offer, PaymentFrequency } from '@/mock/marketplace';
import type { OfferDetailState } from './offer-detail-types';

export const initialState: OfferDetailState = {
  offer: null,
  amount: 0,
  term: 0,
  frequency: 'monthly',
  sharpened: false,
  signOpen: false,
  loading: false,
  error: null,
};

export const offerDetailSlice = createSlice({
  name: 'borrowerOfferDetail',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    /** Loading an offer also seeds the shape controls from its quoted terms. */
    setOffer(state, action: PayloadAction<Offer>) {
      state.offer = action.payload;
      state.amount = action.payload.amount;
      state.term = action.payload.term;
      state.frequency = 'monthly';
      state.sharpened = false;
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
    /** One-shot: we give back margin once, then the button is spent. */
    sharpen(state) {
      state.sharpened = true;
    },
    setSignOpen(state, action: PayloadAction<boolean>) {
      state.signOpen = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const offerDetailSliceActions = offerDetailSlice.actions;
export const offerDetailReducer = offerDetailSlice.reducer;
