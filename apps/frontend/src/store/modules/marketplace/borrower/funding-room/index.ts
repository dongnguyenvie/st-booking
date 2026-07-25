import { fundingRoomSliceActions } from './funding-room-slice';
import { fundingRoomExtendActions } from './funding-room-actions';
import { fundingRoomSelectors } from './funding-room-selectors';

/** Funding room actions: slice reducers + thunk actions */
export const fundingRoomA = {
  ...fundingRoomSliceActions,
  ...fundingRoomExtendActions,
};

/** Funding room selectors */
export const fundingRoomS = fundingRoomSelectors;

export * from './funding-room-slice';
export * as FundingRoomTypes from './funding-room-types';
