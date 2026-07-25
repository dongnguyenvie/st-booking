import { offersSliceActions } from './offers-slice';
import { offersExtendActions } from './offers-actions';
import { offersSelectors } from './offers-selectors';

/** Offers actions: slice reducers + thunk actions */
export const offersA = {
  ...offersSliceActions,
  ...offersExtendActions,
};

/** Offers selectors */
export const offersS = offersSelectors;

export * from './offers-slice';
export * as OffersTypes from './offers-types';
