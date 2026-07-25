import { getDispatch } from '@/store/store-core';
import { findRequestListing } from '@/mock/marketplace';
import { dealDetailSliceActions as A } from './deal-detail-slice';

// ==========================================================================================
// Thunk actions
// ==========================================================================================

const fetchDeal = (dealId: string) => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    const deal = findRequestListing(dealId);
    if (!deal) {
      dispatch(A.setError('That request is no longer on the board.'));
      return;
    }
    dispatch(A.setDeal(deal));
  } finally {
    dispatch(A.setLoading(false));
  }
};

const init = (dealId: string) => async () => {
  const dispatch = getDispatch();
  dispatch(fetchDeal(dealId));
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const dealDetailExtendActions = {
  init,
  destroy,
  fetchDeal,
};
