import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './security-slice';

const selectDomain = (state: RootState) => state.settingsSecurity ?? initialState;

const selectSetupStep = createSelector([selectDomain], (s) => s.setupStep);
const selectDisableStep = createSelector([selectDomain], (s) => s.disableStep);
const selectQrDataUrl = createSelector([selectDomain], (s) => s.qrDataUrl);
const selectSecret = createSelector([selectDomain], (s) => s.secret);
const selectSetupError = createSelector([selectDomain], (s) => s.setupError);
const selectDisableError = createSelector([selectDomain], (s) => s.disableError);

/** True while either state machine is mid-request. */
const selectBusy = createSelector(
  [selectSetupStep, selectDisableStep],
  (setup, disable) => setup === 'initializing' || setup === 'verifying' || disable === 'submitting',
);

export const securitySelectors = {
  selectDomain,
  selectSetupStep,
  selectDisableStep,
  selectQrDataUrl,
  selectSecret,
  selectSetupError,
  selectDisableError,
  selectBusy,
};
