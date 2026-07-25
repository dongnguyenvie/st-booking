import type { AccountId, Offer } from './marketplace-types';

/**
 * Offers posted against the business account's equipment request.
 * Ordered as received; the UI ranks them (best APR first) rather than trusting
 * this order — see BUSINESS-LOGIC §4.
 */
const BUSINESS_OFFERS: Offer[] = [
  { id: 'o-sutton', lenderId: 'sutton', amount: 67000, term: 36, apr: 7.84, payment: 2095, match: 89, previousApr: 8.26, status: 'offer', receivedOn: 'Jun 5', note: null, stage: 'new' },
  { id: 'o-beacon', lenderId: 'beacon', amount: 67000, term: 60, apr: 8.2, payment: 1365, match: 84, previousApr: 8.3, status: 'offer', receivedOn: 'Jun 5', note: 'Sent a revised rate', stage: 'review' },
  { id: 'o-summit', lenderId: 'summit', amount: 67000, term: 48, apr: 8.4, payment: 1645, match: 88, previousApr: 8.7, status: 'offer', receivedOn: 'Jun 5', note: null, stage: 'new' },
  { id: 'o-cedar', lenderId: 'cedar', amount: 67000, term: 36, apr: 8.66, payment: 2118, match: 85, previousApr: 8.8, status: 'offer', receivedOn: 'Jun 5', note: null, stage: 'new' },
  { id: 'o-harbor', lenderId: 'harbor', amount: 67000, term: 60, apr: 8.78, payment: 1385, match: 90, previousApr: 9.1, status: 'offer', receivedOn: 'Jun 4', note: null, stage: 'new' },
  { id: 'o-foundry', lenderId: 'foundry', amount: 67000, term: 48, apr: 8.94, payment: 1665, match: 96, previousApr: 9.26, status: 'offer', receivedOn: 'Jun 5', note: null, stage: 'new' },
  { id: 'o-vantage', lenderId: 'vantage', amount: 67000, term: 48, apr: 9.05, payment: 1668, match: 82, previousApr: 9.2, status: 'offer', receivedOn: 'Jun 4', note: null, stage: 'new' },
  { id: 'o-oakridge', lenderId: 'oakridge', amount: 67000, term: 48, apr: 9.1, payment: 1672, match: 81, previousApr: 9.15, status: 'offer', receivedOn: 'Jun 4', note: 'Reviewing your file', stage: 'waiting' },
  { id: 'o-pinnacle', lenderId: 'pinnacle', amount: 67000, term: 36, apr: 9.2, payment: 2132, match: 87, previousApr: 9.4, status: 'offer', receivedOn: 'Jun 4', note: null, stage: 'new' },
  { id: 'o-meridian', lenderId: 'meridian', amount: 67000, term: 36, apr: 9.42, payment: 2143, match: 92, previousApr: 9.6, status: 'offer', receivedOn: 'Jun 4', note: 'Countered your terms', stage: 'waiting' },
  { id: 'o-monarch', lenderId: 'monarch', amount: 67000, term: 48, apr: 9.6, payment: 1690, match: 80, previousApr: 9.75, status: 'offer', receivedOn: 'Jun 3', note: null, stage: 'new' },
  { id: 'o-horizon', lenderId: 'horizon', amount: 67000, term: 36, apr: 9.95, payment: 2161, match: 78, previousApr: 9.9, status: 'offer', receivedOn: 'Jun 4', note: 'Reviewing your docs', stage: 'waiting' },
  { id: 'o-kestrel', lenderId: 'kestrel', amount: 50000, term: 24, apr: 10.4, payment: 2313, match: 74, previousApr: 10.6, status: 'offer', receivedOn: 'Jun 3', note: 'Offered a lower amount', stage: 'new' },
  { id: 'o-crescent', lenderId: 'crescent', amount: 45000, term: 24, apr: 11.6, payment: 2110, match: 71, previousApr: 11.4, status: 'offer', receivedOn: 'Jun 3', note: 'Offered a lower amount', stage: 'new' },
  // Still pricing — listed below the ranked offers, never ranked among them.
  { id: 'o-liberty', lenderId: 'liberty', amount: 67000, term: 18, apr: 12.3, payment: 4150, match: 68, previousApr: 12.2, status: 'reviewing', receivedOn: null, note: null, stage: 'new' },
];

const PERSONAL_OFFERS: Offer[] = [
  { id: 'p-foundry', lenderId: 'foundry', amount: 25000, term: 36, apr: 8.6, payment: 791, match: 91, previousApr: 8.95, status: 'offer', receivedOn: 'Jun 7', note: null, stage: 'new' },
  { id: 'p-meridian', lenderId: 'meridian', amount: 20000, term: 48, apr: 9.1, payment: 499, match: 83, previousApr: 9.3, status: 'offer', receivedOn: 'Jun 7', note: 'Offered a lower amount', stage: 'waiting' },
  { id: 'p-horizon', lenderId: 'horizon', amount: 25000, term: 24, apr: 9.95, payment: 1153, match: 77, previousApr: 9.9, status: 'offer', receivedOn: 'Jun 6', note: null, stage: 'new' },
];

/** Offers are per account — the personal world never sees business quotes. */
export const MOCK_OFFERS_BY_ACCOUNT: Record<AccountId, Offer[]> = {
  business: BUSINESS_OFFERS,
  personal: PERSONAL_OFFERS,
};

export function findOffer(offerId: string): Offer | undefined {
  return [...BUSINESS_OFFERS, ...PERSONAL_OFFERS].find((o) => o.id === offerId);
}
