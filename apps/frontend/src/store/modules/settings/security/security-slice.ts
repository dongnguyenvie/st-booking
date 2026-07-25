import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { DisableStep, SetupStep } from '@/core/settings/two-factor-types';
import type { SecurityState } from './security-types';

export const initialState: SecurityState = {
  setupStep: 'idle',
  disableStep: 'idle',
  qrDataUrl: null,
  secret: null,
  setupError: null,
  disableError: null,
};

export const securitySlice = createSlice({
  name: 'settingsSecurity',
  initialState,
  reducers: {
    setSetupStep(state, action: PayloadAction<SetupStep>) {
      state.setupStep = action.payload;
    },
    setDisableStep(state, action: PayloadAction<DisableStep>) {
      state.disableStep = action.payload;
    },
    /** TOTP enrolment payload — QR plus the secret for manual entry. */
    setEnrolment(state, action: PayloadAction<{ qrDataUrl: string | null; secret: string | null }>) {
      state.qrDataUrl = action.payload.qrDataUrl;
      state.secret = action.payload.secret;
    },
    setSetupError(state, action: PayloadAction<string | null>) {
      state.setupError = action.payload;
    },
    setDisableError(state, action: PayloadAction<string | null>) {
      state.disableError = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const securitySliceActions = securitySlice.actions;
export const securityReducer = securitySlice.reducer;
