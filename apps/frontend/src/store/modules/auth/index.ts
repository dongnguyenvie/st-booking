import { authSliceActions } from './auth-slice';
import { authExtendActions } from './auth-actions';
import { authSelectors } from './auth-selectors';

/** Auth actions: slice reducers + thunk actions */
export const authA = { ...authSliceActions, ...authExtendActions };

/** Auth selectors */
export const authS = authSelectors;

export * from './auth-slice';
export * as AuthTypes from './auth-types';
