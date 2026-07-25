import type { Offer, PaymentFrequency } from '@/mock/marketplace';

export interface PriceOfferShape {
  amount: number;
  /** Months. */
  term: number;
  frequency: PaymentFrequency;
  /** True once the borrower has spent their one "request a better rate". */
  sharpened: boolean;
}

export interface PricedOffer {
  apr: number;
  payment: number;
  /** Number of payments over the term at the chosen frequency. */
  installments: number;
}

const PAYMENTS_PER_YEAR: Record<PaymentFrequency, number> = {
  monthly: 12,
  weekly: 52,
};

/** Number of payments over a term in months, at the given frequency. */
export function installmentCount(termMonths: number, frequency: PaymentFrequency): number {
  return frequency === 'monthly'
    ? termMonths
    : Math.round((termMonths / 12) * PAYMENTS_PER_YEAR[frequency]);
}

/**
 * Standard amortised payment. Shared by both sides of the venue: the borrower
 * shaping an offer and the lender desk composing one must arrive at the same
 * number for the same terms, or the two screens would disagree about one deal.
 */
export function amortisedPayment(
  amount: number,
  apr: number,
  termMonths: number,
  frequency: PaymentFrequency,
): number {
  const perYear = PAYMENTS_PER_YEAR[frequency];
  const installments = installmentCount(termMonths, frequency);
  const periodRate = apr / 100 / perYear;
  if (periodRate <= 0 || installments <= 0) return 0;
  const growth = Math.pow(1 + periodRate, installments);
  return Math.round((amount * periodRate * growth) / (growth - 1));
}

/**
 * Re-price a lender's approval as the borrower reshapes it.
 *
 * A lender "approval" is really a grid of variants (amount × term × frequency);
 * the UI collapses that into one shapeable offer. Shorter terms, smaller draws
 * and faster sweeps all price tighter.
 *
 * The floor is our buy side — the cost from the lender. The spread between it
 * and the APR shown here is the brokerage commission, and it is never surfaced
 * to the borrower. Ported from priceOffer() in the design prototype.
 */
export function priceOffer(offer: Offer, shape: PriceOfferShape): PricedOffer {
  const termAdjustment = (shape.term - offer.term) * 0.02;
  const amountAdjustment = (shape.amount / offer.amount - 1) * 0.55;
  const frequencyAdjustment = shape.frequency === 'weekly' ? -0.12 : 0;
  const sharpenAdjustment = shape.sharpened ? -0.45 : 0;

  const buySide = offer.apr - 1.05;
  const apr = Number(
    Math.max(
      buySide,
      offer.apr + termAdjustment + amountAdjustment + frequencyAdjustment + sharpenAdjustment,
    ).toFixed(2),
  );

  const installments = installmentCount(shape.term, shape.frequency);
  const payment = amortisedPayment(shape.amount, apr, shape.term, shape.frequency);

  return { apr, payment, installments };
}
