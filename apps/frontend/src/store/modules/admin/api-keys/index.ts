import { apiKeysSliceActions } from './api-keys-slice';
import { apiKeysSelectors } from './api-keys-selectors';

/** Admin API keys actions */
export const apiKeysA = { ...apiKeysSliceActions };

/** Admin API keys selectors */
export const apiKeysS = apiKeysSelectors;

export * from './api-keys-slice';
export * as ApiKeysTypes from './api-keys-types';
