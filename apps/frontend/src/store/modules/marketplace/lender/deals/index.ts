import { dealsSliceActions } from './deals-slice';
import { dealsExtendActions } from './deals-actions';
import { dealsSelectors } from './deals-selectors';

/** Lender deals actions: slice reducers + thunk actions */
export const dealsA = {
  ...dealsSliceActions,
  ...dealsExtendActions,
};

/** Lender deals selectors */
export const dealsS = dealsSelectors;

export * from './deals-slice';
export * as DealsTypes from './deals-types';
