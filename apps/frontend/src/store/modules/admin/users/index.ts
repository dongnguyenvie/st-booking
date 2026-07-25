import { usersSliceActions } from './users-slice';
import { usersSelectors } from './users-selectors';

/** Admin users actions */
export const usersA = { ...usersSliceActions };

/** Admin users selectors */
export const usersS = usersSelectors;

export * from './users-slice';
export * as UsersTypes from './users-types';
