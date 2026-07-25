import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RequestListing } from '@/mock/marketplace';
import type { DealsFilter, DealsSort, DealsState } from './deals-types';

export const initialState: DealsState = {
  items: [],
  filter: 'all',
  sort: 'newest',
  query: '',
  loading: false,
};

export const dealsSlice = createSlice({
  name: 'lenderDeals',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDeals(state, action: PayloadAction<RequestListing[]>) {
      state.items = action.payload;
    },
    setFilter(state, action: PayloadAction<DealsFilter>) {
      state.filter = action.payload;
    },
    setSort(state, action: PayloadAction<DealsSort>) {
      state.sort = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    /**
     * Declining stays visible with its reason rather than removing the row —
     * a desk needs to see what it already looked at and why it walked away.
     */
    passOnDeal(state, action: PayloadAction<{ id: string; reason: string }>) {
      const deal = state.items.find((d) => d.id === action.payload.id);
      if (!deal) return;
      deal.deskStatus = 'passed';
      deal.passReason = action.payload.reason;
    },
    reset() {
      return initialState;
    },
  },
});

export const dealsSliceActions = dealsSlice.actions;
export const dealsReducer = dealsSlice.reducer;
