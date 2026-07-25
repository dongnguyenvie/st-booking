import type { Lender } from '@/mock/marketplace';

/** Filter the lender panel by the product a lender specialises in. */
export type MarketKindFilter = 'all' | string;

export interface MarketState {
  lenders: Lender[];
  query: string;
  kind: MarketKindFilter;
  loading: boolean;
}
