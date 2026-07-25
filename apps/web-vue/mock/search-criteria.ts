/** The four inputs the guest search bar collects, shared by home and search. */
export interface SearchCriteria {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export function emptyCriteria(): SearchCriteria {
  return { location: '', checkIn: '', checkOut: '', guests: 1 };
}

/** Query params for `/search`, dropping the empty ones. */
export function toSearchQuery(criteria: SearchCriteria): Record<string, string> {
  const query: Record<string, string> = { numberOfGuests: String(criteria.guests) };
  if (criteria.location) query.location = criteria.location;
  if (criteria.checkIn) query.checkIn = criteria.checkIn;
  if (criteria.checkOut) query.checkOut = criteria.checkOut;
  return query;
}
