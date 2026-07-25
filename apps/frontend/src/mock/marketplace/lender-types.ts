/**
 * Lender-desk domain types.
 *
 * These describe the *same deals* the borrower types describe, seen from the
 * other side of the venue: a request a borrower posts is the request a lender
 * prices. Where the borrower sees `Offer` (what a lender sent me), the lender
 * sees `DeskOffer` (what I sent this borrower) — same underlying agreement.
 */
import type { OfferTerms } from './marketplace-types';

/** Where this desk stands on a given request. */
export type DeskStatus =
  /** Visible in the queue, we have not priced it. */
  | 'open'
  /** We posted an offer; the borrower may still be comparing. */
  | 'offered'
  /** We declined to price it — stays visible with the reason. */
  | 'passed'
  /** The borrower signed our offer; exclusivity is ours until funded/cancelled. */
  | 'signed'
  /** Every stip approved, money out. */
  | 'funded';

/** What moved most recently on a deal — drives the "needs reply" queue. */
export type DeskActivityKind = 'countered' | 'shaped' | 'viewed' | 'signed' | 'none';

/** The desk operating on the marketplace — the lender's own firm. */
export interface LenderDesk {
  id: string;
  name: string;
  short: string;
  tagline: string;
  since: number;
  /** The human at the desk. */
  operator: string;
  role: string;
  products: string[];
  regions: string[];
}

/** Month-to-date desk performance. Carousel is the venue, so these are
 *  origination metrics only — never repayment behaviour. */
export interface DeskKpis {
  liveQueue: number;
  needsReply: number;
  offersSent: number;
  signedWithUs: number;
  fundedThisMonth: number;
  fundedAmountThisMonth: number;
  winRate: number;
  avgTimeToOffer: string;
  avgApr: number;
  loiInProgress: number;
}

/** The applicant's strength, as underwriters read it. */
export interface BorrowerProfileSnapshot {
  netWorth: number;
  revenue: number;
  revenueLabel: string;
  score: number;
  runwayMonths: number;
  /** 0–100 — share of verifications that are present and fresh. */
  strength: number;
  tier: string;
  yearsTrading: number;
}

/** Which checks the unified profile already carries (BUSINESS-LOGIC §3, §8). */
export interface VerificationSnapshot {
  identity: boolean;
  businessRegistration: boolean;
  businessBank: boolean;
  personalBank: boolean;
  /** False once the data has aged out — weaker offers, slower replies. */
  fresh: boolean;
}

/** One step in the negotiation trail. Both sides see the same trail. */
export interface DeskOfferEvent {
  event: 'offered' | 'viewed' | 'counter' | 'revised' | 'signed';
  who: string;
  when: string;
  terms?: OfferTerms;
  note: string | null;
}

/** The offer this desk has on a request. */
export interface DeskOffer {
  terms: OfferTerms;
  note: string | null;
  sentAt: string;
  activity: { kind: DeskActivityKind; when: string };
  history: DeskOfferEvent[];
}

/** A borrower's live request, as it appears in a lender's queue. */
export interface RequestListing {
  id: string;
  borrower: string;
  who: string;
  kind: string;
  industry: string;
  region: string;
  flag: string;
  currency: string;
  product: string;
  amount: number;
  purpose: string;
  postedAgo: string;
  expiresInDays: number;
  profile: BorrowerProfileSnapshot;
  verifications: VerificationSnapshot;
  /** Competitive signal every lender can see — how crowded this deal is. */
  offerCount: number;
  bestApr: number;
  /** This desk's own position. */
  deskStatus: DeskStatus;
  passReason?: string;
  myOffer?: DeskOffer;
}
