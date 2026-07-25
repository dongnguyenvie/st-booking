import type { Offer, PaymentFrequency } from '@/mock/marketplace';

export interface OfferDetailState {
  offer: Offer | null;
  /** Live controls — the borrower reshapes the approval, price recalcs instantly. */
  amount: number;
  term: number;
  frequency: PaymentFrequency;
  /** "Request a better rate" is one-shot per offer. */
  sharpened: boolean;
  signOpen: boolean;
  loading: boolean;
  error: string | null;
}
