import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AdminSettingsState } from './settings-types';

export const initialState: AdminSettingsState = {
  siteName: 'Carousel Marketplace',
  supportEmail: 'support@carousel-marketplace.io',
  emailNotifications: true,
  maintenanceMode: false,
  twoFactorRequired: false,
};

export const adminSettingsSlice = createSlice({
  name: 'adminSettings',
  initialState,
  reducers: {
    /** One reducer for every field keeps the form additive as settings grow. */
    setField<K extends keyof AdminSettingsState>(
      state: AdminSettingsState,
      action: PayloadAction<{ key: K; value: AdminSettingsState[K] }>,
    ) {
      state[action.payload.key] = action.payload.value;
    },
    reset() {
      return initialState;
    },
  },
});

export const adminSettingsSliceActions = adminSettingsSlice.actions;
export const adminSettingsReducer = adminSettingsSlice.reducer;
