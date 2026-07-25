/**
 * Marketplace domain types.
 *
 * These describe the borrower-side model from the design prototype
 * (local-docs/mockup/marketplace) — see BUSINESS-LOGIC.md for the rules.
 * They are deliberately API-agnostic: when the real API lands, only the mock
 * datasets in this folder get replaced, not the types or anything downstream.
 */

/** Which of the user's two worlds is active. Switching swaps the entire world. */
export type AccountId = 'business' | 'personal';

/** Where a request sits in its lifecycle (BUSINESS-LOGIC §4). */
export type RequestStage =
  /** Live, lenders are still posting offers. */
  | 'gathering'
  /** Offers are in and rankable. */
  | 'offers'
  /** One offer signed; market is read-only (BUSINESS-LOGIC §5). */
  | 'loi'
  /** Every stip approved, funds disbursed. */
  | 'funded';

/** Per-offer badge state shown in the ranked list. */
export type OfferStage = 'new' | 'review' | 'waiting' | 'viewed' | 'signed';

export type OfferStatus = 'offer' | 'reviewing';

export type StipState = 'todo' | 'submitted' | 'approved' | 'returned';

/** Stips split into checks reused from the profile vs. documents the lender wants. */
export type StipGroup = 'verify' | 'req';

export type PaymentFrequency = 'monthly' | 'weekly';

export interface Lender {
  id: string;
  name: string;
  /** Single-letter mark used by the logo tile. */
  short: string;
  kind: string;
  /** Average borrower rating, out of 5. */
  rating: number;
  since: number;
  funded: number;
}

/** A financing product the built profile already qualifies for — no re-verification. */
export interface EligibleProduct {
  id: string;
  name: string;
  max: number;
  range: string;
  rate: string;
  blurb: string;
  lenders: number;
}

/** The borrower's live ask. One per account at a time. */
export interface FinancingRequest {
  product: string;
  amount: number;
  currency: string;
  purpose: string;
  appliedOn: string;
  daysAgo: number;
  validDays: number;
}

export interface Account {
  id: AccountId;
  name: string;
  kind: string;
  who: string;
  /** Lender id whose mark stands in as this account's avatar. */
  mark: string;
  region: string;
  flag: string;
  currency: string;
  worth: number;
  bestRate: number;
  lenders: number;
  revenueLabel: string;
  revenueValue: string;
  revenueTrend: number[];
  revenueSources: string[];
  revenueStats: Array<[label: string, value: string]>;
  request: FinancingRequest;
  eligible: EligibleProduct[];
}

export interface Offer {
  id: string;
  /** Lender.id — offers are always attributable to a lender. */
  lenderId: string;
  amount: number;
  /** Months. */
  term: number;
  apr: number;
  /** Monthly payment at the quoted amount/term/apr. */
  payment: number;
  /** APR before the most recent move — drives the up/down delta. */
  previousApr: number;
  status: OfferStatus;
  stage: OfferStage;
  receivedOn: string | null;
  /** Short lender remark shown under the row, when there is one. */
  note: string | null;
  /** How well the lender's box fits the request, 0–100. */
  match: number;
}

/** The terms locked at signature, or the ones a lender is proposing. */
export interface OfferTerms {
  amount: number;
  apr: number;
  term: number;
  payment: number;
  fee: number;
}

export interface StipHistoryEntry {
  at: string;
  who: string;
  what: string;
}

export interface Stip {
  id: string;
  group: StipGroup;
  title: string;
  subtitle: string;
  state: StipState;
  /** Button label when the stip still needs the borrower to act. */
  cta?: string;
  approvedOn?: string;
  approvedBy?: string;
  history: StipHistoryEntry[];
}

/**
 * A signed letter of intent. Exactly one per account at a time; it holds the
 * locked terms and the stip checklist that gates funding (BUSINESS-LOGIC §5–6).
 */
export interface Loi {
  lenderId: string;
  account: AccountId;
  signedOn: string;
  /** Currently binding terms — only changes when a revision is accepted. */
  terms: OfferTerms;
  /** What was signed originally, kept so revisions can show an old→new diff. */
  signedTerms: OfferTerms;
  stipsRequested: boolean;
  stips: Stip[];
}

export interface Funding {
  id: string;
  account: AccountId;
  lenderId: string;
  amount: number;
  date: string;
  status: 'paid' | 'active';
  apr: number;
  term: number;
  product: string;
  purpose: string;
}

/** One line in the market ticker / live activity feed. */
export interface MarketEvent {
  id: string;
  lenderId: string;
  kind: 'tightened' | 'opened' | 'posted' | 'paused';
  text: string;
  at: string;
}
