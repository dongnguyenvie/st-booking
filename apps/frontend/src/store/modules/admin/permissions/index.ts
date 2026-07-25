import { permissionsSliceActions } from './permissions-slice';
import { permissionsExtendActions } from './permissions-actions';
import { permissionsSelectors } from './permissions-selectors';

/** Permissions actions: slice reducers + thunk actions */
export const permissionsA = {
  ...permissionsSliceActions,
  ...permissionsExtendActions,
};

/** Permissions selectors */
export const permissionsS = permissionsSelectors;

export * from './permissions-slice';
export * as PermissionsTypes from './permissions-types';
