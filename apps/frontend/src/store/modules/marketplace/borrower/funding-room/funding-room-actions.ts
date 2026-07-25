import { getDispatch, getState } from '@/store/store-core';
import { MOCK_OFFERS_BY_ACCOUNT, MOCK_STIPS, type Loi } from '@/mock/marketplace';
import { fundingRoomSliceActions as A } from './funding-room-slice';

// ==========================================================================================
// Thunk actions
//
// The sample has no persisted LOI: this synthesises one from the active
// account's best offer so the funding room has something real to render.
// ==========================================================================================

/** Build the signed-LOI view for the active account. */
const fetchFundingRoom = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    const { activeAccountId } = getState().borrowerWorkspace;
    const offers = MOCK_OFFERS_BY_ACCOUNT[activeAccountId].filter((o) => o.status === 'offer');
    const best = [...offers].sort((a, b) => a.apr - b.apr)[0];
    if (!best) {
      dispatch(A.setLoi(null));
      return;
    }

    const terms = {
      amount: best.amount,
      apr: best.apr,
      term: best.term,
      payment: best.payment,
      fee: 1500,
    };
    const loi: Loi = {
      lenderId: best.lenderId,
      account: activeAccountId,
      signedOn: 'Jun 9, 2026',
      terms,
      signedTerms: terms,
      stipsRequested: true,
      // Clone so reducer mutations never reach back into the shared mock.
      stips: MOCK_STIPS.map((s) => ({ ...s, history: [...s.history] })),
    };
    dispatch(A.setLoi(loi));
  } finally {
    dispatch(A.setLoading(false));
  }
};

// ==========================================================================================

const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchFundingRoom());
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const fundingRoomExtendActions = {
  init,
  destroy,
  fetchFundingRoom,
};
