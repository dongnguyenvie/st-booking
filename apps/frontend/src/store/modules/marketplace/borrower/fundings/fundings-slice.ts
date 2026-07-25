import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Funding } from '@/mock/marketplace';
import type { FundingsState } from './fundings-types';

export const initialState: FundingsState = {
  items: [],
  expandedId: null,
  loading: false,
};

export const fundingsSlice = createSlice({
  name: 'borrowerFundings',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFundings(state, action: PayloadAction<Funding[]>) {
      state.items = action.payload;
    },
    toggleExpanded(state, action: PayloadAction<string>) {
      state.expandedId = state.expandedId === action.payload ? null : action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const fundingsSliceActions = fundingsSlice.actions;
export const fundingsReducer = fundingsSlice.reducer;
