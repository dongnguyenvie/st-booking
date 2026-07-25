import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ApiKeysState } from './api-keys-types';

export const initialState: ApiKeysState = {
  createDialogOpen: false,
  deleteError: null,
};

export const apiKeysSlice = createSlice({
  name: 'adminApiKeys',
  initialState,
  reducers: {
    openCreateDialog(state) {
      state.createDialogOpen = true;
    },
    closeCreateDialog(state) {
      state.createDialogOpen = false;
    },
    setDeleteError(state, action: PayloadAction<string | null>) {
      state.deleteError = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const apiKeysSliceActions = apiKeysSlice.actions;
export const apiKeysReducer = apiKeysSlice.reducer;
