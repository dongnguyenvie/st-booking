import type { Offer } from '@/mock/marketplace';

/** How the ranked list is ordered. Rate is the default — cheapest money first. */
export type OffersSort = 'rate' | 'payment' | 'match';

export interface OffersState {
  /** Offers for the active account, as loaded. Ranking happens in selectors. */
  items: Offer[];
  sort: OffersSort;
  loading: boolean;
  error: string | null;
}
