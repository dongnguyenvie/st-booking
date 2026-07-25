import type { Funding } from '@/mock/marketplace';

export interface FundingsState {
  items: Funding[];
  /** Row whose details are expanded, if any. */
  expandedId: string | null;
  loading: boolean;
}
