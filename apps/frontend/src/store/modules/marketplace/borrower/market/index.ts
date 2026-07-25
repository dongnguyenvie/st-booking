import { marketSliceActions } from './market-slice';
import { marketExtendActions } from './market-actions';
import { marketSelectors } from './market-selectors';

/** Market actions: slice reducers + thunk actions */
export const marketA = {
  ...marketSliceActions,
  ...marketExtendActions,
};

/** Market selectors */
export const marketS = marketSelectors;

export * from './market-slice';
export * as MarketTypes from './market-types';
