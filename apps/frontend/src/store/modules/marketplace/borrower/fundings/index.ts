import { fundingsSliceActions } from './fundings-slice';
import { fundingsExtendActions } from './fundings-actions';
import { fundingsSelectors } from './fundings-selectors';

/** Fundings actions: slice reducers + thunk actions */
export const fundingsA = {
  ...fundingsSliceActions,
  ...fundingsExtendActions,
};

/** Fundings selectors */
export const fundingsS = fundingsSelectors;

export * from './fundings-slice';
export * as FundingsTypes from './fundings-types';
