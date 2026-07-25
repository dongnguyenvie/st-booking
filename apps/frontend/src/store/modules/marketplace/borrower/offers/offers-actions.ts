import { getDispatch, getState } from '@/store/store-core';
import { MOCK_OFFERS_BY_ACCOUNT } from '@/mock/marketplace';
import { offersSliceActions as A } from './offers-slice';

// ==========================================================================================
// Thunk actions — call via dispatch(offersA.fetchOffers())
//
// The marketplace sample has no API: these read the static datasets in
// src/mock/marketplace. They are still written as thunks so that swapping in a
// real request later touches only these bodies, not the pages or selectors.
// ==========================================================================================

/** Load the active account's offers into the store. */
const fetchOffers = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    const { activeAccountId } = getState().borrowerWorkspace;
    dispatch(A.setOffers(MOCK_OFFERS_BY_ACCOUNT[activeAccountId]));
  } catch (err) {
    dispatch(A.setError((err as Error)?.message ?? 'Failed to load offers'));
  } finally {
    dispatch(A.setLoading(false));
  }
};

// ==========================================================================================

/** Initialize the offers page. */
const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchOffers());
};

/** Reset the page's store state on unmount. */
const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

// ==========================================================================================

export const offersExtendActions = {
  init,
  destroy,
  fetchOffers,
};
