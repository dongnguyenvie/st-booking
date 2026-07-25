import type { DeskStatus, RequestListing } from '@/mock/marketplace';

/** Which slice of the queue the desk is looking at. */
export type DealsFilter = 'all' | 'needs-reply' | DeskStatus;

/** How the queue is ordered — desks triage by urgency, not by rate. */
export type DealsSort = 'newest' | 'amount' | 'competition';

export interface DealsState {
  items: RequestListing[];
  filter: DealsFilter;
  sort: DealsSort;
  query: string;
  loading: boolean;
}
