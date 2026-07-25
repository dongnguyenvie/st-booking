import { getDispatch } from '@/store/store-core';
import { findOffer } from '@/mock/marketplace';
import { offerDetailSliceActions as A } from './offer-detail-slice';

// ==========================================================================================
// Thunk actions
// ==========================================================================================

/** Load one offer by id from the static dataset. */
const fetchOffer = (offerId: string) => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    const offer = findOffer(offerId);
    if (!offer) {
      dispatch(A.setError('That offer is no longer available.'));
      return;
    }
    dispatch(A.setOffer(offer));
  } finally {
    dispatch(A.setLoading(false));
  }
};

// ==========================================================================================

const init = (offerId: string) => async () => {
  const dispatch = getDispatch();
  dispatch(fetchOffer(offerId));
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const offerDetailExtendActions = {
  init,
  destroy,
  fetchOffer,
};
