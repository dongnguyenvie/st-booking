import { dealDetailSliceActions } from './deal-detail-slice';
import { dealDetailExtendActions } from './deal-detail-actions';
import { dealDetailSelectors } from './deal-detail-selectors';

/** Lender deal detail actions: slice reducers + thunk actions */
export const dealDetailA = {
  ...dealDetailSliceActions,
  ...dealDetailExtendActions,
};

/** Lender deal detail selectors */
export const dealDetailS = dealDetailSelectors;

export * from './deal-detail-slice';
export * as DealDetailTypes from './deal-detail-types';
