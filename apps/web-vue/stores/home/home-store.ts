import { defineStore } from 'pinia';

export interface SearchCriteria {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface HomeState {
  search: SearchCriteria;
  /** Total inventory count shown on the "Explore all properties (N)" CTA. */
  totalProperties: number;
}

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    search: { location: '', checkIn: '', checkOut: '', guests: 1 },
    totalProperties: 0,
  }),

  actions: {
    setSearch(patch: Partial<SearchCriteria>) {
      this.search = { ...this.search, ...patch };
    },

    /** Query params for `/search`, dropping the empty ones. */
    searchQuery(): Record<string, string> {
      const { location, checkIn, checkOut, guests } = this.search;
      const query: Record<string, string> = { numberOfGuests: String(guests) };
      if (location) query.location = location;
      if (checkIn) query.checkIn = checkIn;
      if (checkOut) query.checkOut = checkOut;
      return query;
    },

    setTotalProperties(total: number) {
      this.totalProperties = total;
    },

    reset() {
      this.search = { location: '', checkIn: '', checkOut: '', guests: 1 };
      this.totalProperties = 0;
    },
  },
});
