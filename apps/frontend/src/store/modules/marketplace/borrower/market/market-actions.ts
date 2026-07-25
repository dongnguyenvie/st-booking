import { getDispatch } from '@/store/store-core';
import { MOCK_LENDERS } from '@/mock/marketplace';
import { marketSliceActions as A } from './market-slice';

// ==========================================================================================
// Thunk actions — reads the static lender panel from src/mock/marketplace.
// ==========================================================================================

/** Load the lender panel. */
const fetchLenders = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    dispatch(A.setLenders(MOCK_LENDERS));
  } finally {
    dispatch(A.setLoading(false));
  }
};

const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchLenders());
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const marketExtendActions = {
  init,
  destroy,
  fetchLenders,
};
