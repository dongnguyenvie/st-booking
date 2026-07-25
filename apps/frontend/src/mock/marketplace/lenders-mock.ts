import type { Lender } from './marketplace-types';

/** The lender panel. Ported from LENDERS in the design prototype's live-app.jsx. */
export const MOCK_LENDERS: Lender[] = [
  { id: 'meridian', name: 'Meridian Funding', short: 'M', kind: 'Working capital', rating: 4.6, since: 2014, funded: 1842 },
  { id: 'foundry', name: 'Foundry Credit Union', short: 'F', kind: 'Term loan', rating: 4.9, since: 1968, funded: 9211 },
  { id: 'sutton', name: 'Sutton Capital', short: 'S', kind: 'Equipment', rating: 4.7, since: 2009, funded: 3204 },
  { id: 'crescent', name: 'Crescent Mercantile', short: 'C', kind: 'Line of credit', rating: 4.4, since: 2017, funded: 822 },
  { id: 'beacon', name: 'Beacon SBA', short: 'B', kind: 'SBA 7(a)', rating: 4.8, since: 1992, funded: 5104 },
  { id: 'horizon', name: 'Horizon Trust', short: 'H', kind: 'Term loan', rating: 4.5, since: 2002, funded: 2901 },
  { id: 'liberty', name: 'Liberty Direct', short: 'L', kind: 'Working capital', rating: 4.3, since: 2020, funded: 412 },
  { id: 'oakridge', name: 'Oakridge Lending', short: 'O', kind: 'Equipment', rating: 4.6, since: 2011, funded: 2218 },
  { id: 'summit', name: 'Summit Bank', short: 'U', kind: 'Term loan', rating: 4.5, since: 1990, funded: 3200 },
  { id: 'cedar', name: 'Cedar Capital', short: 'D', kind: 'Working capital', rating: 4.7, since: 2008, funded: 2100 },
  { id: 'harbor', name: 'Harbor Lending', short: 'R', kind: 'SBA 7(a)', rating: 4.4, since: 2001, funded: 4500 },
  { id: 'vantage', name: 'Vantage Finance', short: 'V', kind: 'Equipment', rating: 4.6, since: 2012, funded: 1800 },
  { id: 'pinnacle', name: 'Pinnacle Trust', short: 'P', kind: 'Term loan', rating: 4.8, since: 1985, funded: 6700 },
  { id: 'kestrel', name: 'Kestrel Credit', short: 'K', kind: 'Line of credit', rating: 4.3, since: 2015, funded: 980 },
  { id: 'monarch', name: 'Monarch Funding', short: 'N', kind: 'Working capital', rating: 4.5, since: 2003, funded: 2900 },
];

const LENDER_BY_ID = new Map(MOCK_LENDERS.map((l) => [l.id, l]));

/** Lookup helper — offers carry a lenderId, the UI needs the record. */
export function findLender(lenderId: string): Lender | undefined {
  return LENDER_BY_ID.get(lenderId);
}
