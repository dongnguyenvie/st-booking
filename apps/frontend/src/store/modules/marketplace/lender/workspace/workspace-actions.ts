import { getDispatch } from '@/store/store-core';
import { MOCK_REQUEST_LISTINGS } from '@/mock/marketplace';
import { lenderWorkspaceSliceActions as A } from './workspace-slice';

// ==========================================================================================
// Thunk actions
// ==========================================================================================

/**
 * Refresh the desk-wide counters. Derived from the same source the deals page
 * reads, but owned here so the shell does not depend on that page being mounted.
 */
const fetchCounts = () => async () => {
  const dispatch = getDispatch();
  const needsReply = MOCK_REQUEST_LISTINGS.filter((d) => {
    const kind = d.myOffer?.activity.kind;
    return kind === 'countered' || kind === 'shaped';
  }).length;
  dispatch(A.setCounts({ needsReply, queue: MOCK_REQUEST_LISTINGS.length }));
};

const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchCounts());
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const lenderWorkspaceExtendActions = { init, destroy, fetchCounts };
