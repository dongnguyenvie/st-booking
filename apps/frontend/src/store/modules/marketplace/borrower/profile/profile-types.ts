import type { Account, EligibleProduct } from '@/mock/marketplace';

/** Verifications age out after each funded cycle (BUSINESS-LOGIC §8). */
export type VerificationFreshness = 'fresh' | 'stale';

export interface VerificationCheck {
  id: string;
  label: string;
  detail: string;
  freshness: VerificationFreshness;
}

export interface ProfileState {
  account: Account | null;
  checks: VerificationCheck[];
  eligible: EligibleProduct[];
  /** True while the sequential re-verification modal is running. */
  refreshing: boolean;
  loading: boolean;
}
