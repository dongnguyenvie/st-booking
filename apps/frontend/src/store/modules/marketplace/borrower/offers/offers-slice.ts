import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Offer } from '@/mock/marketplace';
import type { OffersSort, OffersState } from './offers-types';

export const initialState: OffersState = {
  items: [],
  sort: 'rate',
  loading: false,
  error: null,
};

export const offersSlice = createSlice({
  name: 'borrowerOffers',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setOffers(state, action: PayloadAction<Offer[]>) {
      state.items = action.payload;
      state.error = null;
    },
    setSort(state, action: PayloadAction<OffersSort>) {
      state.sort = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const offersSliceActions = offersSlice.actions;
export const offersReducer = offersSlice.reducer;
