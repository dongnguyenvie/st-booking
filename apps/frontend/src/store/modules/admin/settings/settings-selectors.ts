import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { initialState } from './settings-slice';

const selectDomain = (state: RootState) => state.adminSettings ?? initialState;

const selectSiteName = createSelector([selectDomain], (s) => s.siteName);
const selectSupportEmail = createSelector([selectDomain], (s) => s.supportEmail);
const selectEmailNotifications = createSelector([selectDomain], (s) => s.emailNotifications);
const selectMaintenanceMode = createSelector([selectDomain], (s) => s.maintenanceMode);
const selectTwoFactorRequired = createSelector([selectDomain], (s) => s.twoFactorRequired);

export const adminSettingsSelectors = {
  selectDomain,
  selectSiteName,
  selectSupportEmail,
  selectEmailNotifications,
  selectMaintenanceMode,
  selectTwoFactorRequired,
};
