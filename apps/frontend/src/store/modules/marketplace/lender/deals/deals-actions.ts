import { getDispatch } from '@/store/store-core';
import { MOCK_REQUEST_LISTINGS } from '@/mock/marketplace';
import { dealsSliceActions as A } from './deals-slice';

// ==========================================================================================
// Thunk actions — reads the static queue from src/mock/marketplace.
// ==========================================================================================

/** Load the desk's live request queue. */
const fetchDeals = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    // Clone so reducer mutations (pass/decline) never reach the shared mock.
    dispatch(A.setDeals(MOCK_REQUEST_LISTINGS.map((d) => ({ ...d }))));
  } finally {
    dispatch(A.setLoading(false));
  }
};

const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchDeals());
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const dealsExtendActions = {
  init,
  destroy,
  fetchDeals,
};
