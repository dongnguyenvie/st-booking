import { profileSliceActions } from './profile-slice';
import { profileExtendActions } from './profile-actions';
import { profileSelectors } from './profile-selectors';

/** Profile actions: slice reducers + thunk actions */
export const profileA = {
  ...profileSliceActions,
  ...profileExtendActions,
};

/** Profile selectors */
export const profileS = profileSelectors;

export * from './profile-slice';
export * as ProfileTypes from './profile-types';
