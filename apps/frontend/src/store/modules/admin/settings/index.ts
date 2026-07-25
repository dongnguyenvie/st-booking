import { adminSettingsSliceActions } from './settings-slice';
import { adminSettingsSelectors } from './settings-selectors';

/** Admin settings actions */
export const adminSettingsA = { ...adminSettingsSliceActions };

/** Admin settings selectors */
export const adminSettingsS = adminSettingsSelectors;

export * from './settings-slice';
export * as AdminSettingsTypes from './settings-types';
