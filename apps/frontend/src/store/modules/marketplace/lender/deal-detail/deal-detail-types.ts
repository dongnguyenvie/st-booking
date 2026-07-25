import type { PaymentFrequency, RequestListing } from '@/mock/marketplace';

export interface DealDetailState {
  deal: RequestListing | null;
  /** Live controls for the offer the desk is composing. */
  amount: number;
  term: number;
  frequency: PaymentFrequency;
  /** The APR the borrower will see — the sell side. */
  apr: number;
  loading: boolean;
  error: string | null;
}
