import { getDispatch, getState } from '@/store/store-core';
import { MOCK_FUNDINGS } from '@/mock/marketplace';
import { fundingsSliceActions as A } from './fundings-slice';

// ==========================================================================================
// Thunk actions
// ==========================================================================================

/** Load the active account's funding history, newest first. */
const fetchFundings = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    const { activeAccountId } = getState().borrowerWorkspace;
    dispatch(A.setFundings(MOCK_FUNDINGS.filter((f) => f.account === activeAccountId)));
  } finally {
    dispatch(A.setLoading(false));
  }
};

// ==========================================================================================

const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchFundings());
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const fundingsExtendActions = {
  init,
  destroy,
  fetchFundings,
};
