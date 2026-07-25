import type { Funding, MarketEvent } from './marketplace-types';

/**
 * Every funding ever completed, newest first (BUSINESS-LOGIC §7).
 * Carousel is the venue, not the lender — repayment happens off-platform, so
 * these records only ever describe what was funded, never repayment behaviour.
 */
export const MOCK_FUNDINGS: Funding[] = [
  { id: 'f-2024-03', account: 'business', lenderId: 'foundry', amount: 25000, date: 'Mar 2024', status: 'paid', apr: 9.2, term: 18, product: 'Term loan', purpose: 'Inventory ahead of the spring season' },
  { id: 'f-2023-08', account: 'business', lenderId: 'meridian', amount: 50000, date: 'Aug 2023', status: 'paid', apr: 11.4, term: 24, product: 'Working capital', purpose: 'Bridged a 60-day receivables gap' },
  { id: 'f-2023-01', account: 'business', lenderId: 'sutton', amount: 80000, date: 'Jan 2023', status: 'active', apr: 6.4, term: 60, product: 'Equipment financing', purpose: 'CNC mill + tooling for the frame shop' },
  { id: 'f-2022-11', account: 'personal', lenderId: 'horizon', amount: 12000, date: 'Nov 2022', status: 'paid', apr: 10.8, term: 24, product: 'Personal loan', purpose: 'Consolidated two card balances' },
];

/** Ticker copy for the live market rail. Purely decorative in the mock. */
export const MOCK_MARKET_EVENTS: MarketEvent[] = [
  { id: 'e1', lenderId: 'sutton', kind: 'tightened', text: 'Sutton Capital tightened to 7.84%', at: 'Just now' },
  { id: 'e2', lenderId: 'foundry', kind: 'opened', text: 'Foundry Credit Union opened your file', at: '14m ago' },
  { id: 'e3', lenderId: 'summit', kind: 'posted', text: 'Summit Bank posted an offer', at: '38m ago' },
  { id: 'e4', lenderId: 'harbor', kind: 'posted', text: 'Harbor Lending posted an offer', at: '1h ago' },
  { id: 'e5', lenderId: 'beacon', kind: 'tightened', text: 'Beacon SBA sent a revised rate', at: '2h ago' },
  { id: 'e6', lenderId: 'liberty', kind: 'paused', text: 'Liberty Direct is still pricing', at: '3h ago' },
];
