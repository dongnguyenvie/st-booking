import { getDispatch, getState } from '@/store/store-core';
import { MOCK_ACCOUNTS } from '@/mock/marketplace';
import { profileSliceActions as A } from './profile-slice';
import type { VerificationCheck } from './profile-types';

/**
 * The durable, verify-once checks behind the unified profile
 * (BUSINESS-LOGIC §3). Business registration has aged out, which is what the
 * stale-data warning on the offers side refers to.
 */
const BASE_CHECKS: VerificationCheck[] = [
  { id: 'identity', label: 'Identity', detail: 'Government ID + selfie', freshness: 'fresh' },
  { id: 'bizreg', label: 'Business registration', detail: 'Corporate registry · 1.0y old', freshness: 'stale' },
  { id: 'bizbank', label: 'Business bank', detail: 'Royal Bank · read-only', freshness: 'fresh' },
  { id: 'personalbank', label: 'Personal bank', detail: 'Royal Bank · read-only', freshness: 'stale' },
];

// ==========================================================================================
// Thunk actions
// ==========================================================================================

const fetchProfile = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setLoading(true));
  try {
    const { activeAccountId } = getState().borrowerWorkspace;
    dispatch(A.setAccount(MOCK_ACCOUNTS[activeAccountId]));
    dispatch(A.setChecks(BASE_CHECKS.map((c) => ({ ...c }))));
  } finally {
    dispatch(A.setLoading(false));
  }
};

/**
 * Re-run the aged-out checks. Read-only and quick — nothing is re-uploaded,
 * the profile just visibly updates as each check lands.
 */
const refreshVerifications = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.setRefreshing(true));
  try {
    dispatch(A.markAllFresh());
  } finally {
    dispatch(A.setRefreshing(false));
  }
};

// ==========================================================================================

const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchProfile());
};

const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

export const profileExtendActions = {
  init,
  destroy,
  fetchProfile,
  refreshVerifications,
};
