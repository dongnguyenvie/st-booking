import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Lender } from '@/mock/marketplace';
import type { MarketKindFilter, MarketState } from './market-types';

export const initialState: MarketState = {
  lenders: [],
  query: '',
  kind: 'all',
  loading: false,
};

export const marketSlice = createSlice({
  name: 'borrowerMarket',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLenders(state, action: PayloadAction<Lender[]>) {
      state.lenders = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setKind(state, action: PayloadAction<MarketKindFilter>) {
      state.kind = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const marketSliceActions = marketSlice.actions;
export const marketReducer = marketSlice.reducer;
