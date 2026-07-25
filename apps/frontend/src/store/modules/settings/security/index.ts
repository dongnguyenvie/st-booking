import { securitySliceActions } from './security-slice';
import { securitySelectors } from './security-selectors';

/** Security page actions */
export const securityA = { ...securitySliceActions };

/** Security page selectors */
export const securityS = securitySelectors;

export * from './security-slice';
export * as SecurityTypes from './security-types';
