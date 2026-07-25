import { defineStore } from 'pinia';

export type ListingStatus = 'draft' | 'published' | 'unlisted';

export interface Listing {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  nightlyRate: number;
  status: ListingStatus;
}

interface ListingsState {
  items: Listing[];
  loading: boolean;
  error: string | null;
  statusFilter: ListingStatus | 'all';
}

// Placeholder inventory until the listing API lands. Shape matches
// specs/canmorestays/08-data-model.md so swapping in the query is a drop-in.
const SEED: Listing[] = [
  {
    id: 'lst_001',
    title: 'Spring Creek Loft',
    location: 'Canmore, AB',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    nightlyRate: 219,
    status: 'published',
  },
  {
    id: 'lst_002',
    title: 'Three Sisters Chalet',
    location: 'Canmore, AB',
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 9,
    nightlyRate: 465,
    status: 'published',
  },
  {
    id: 'lst_003',
    title: 'Bow River Studio',
    location: 'Canmore, AB',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    nightlyRate: 148,
    status: 'draft',
  },
  {
    id: 'lst_004',
    title: 'Grassi Lakes Cabin',
    location: 'Canmore, AB',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    nightlyRate: 332,
    status: 'unlisted',
  },
];

export const useListingsStore = defineStore('listings', {
  state: (): ListingsState => ({
    items: [],
    loading: false,
    error: null,
    statusFilter: 'all',
  }),

  getters: {
    visible(state): Listing[] {
      if (state.statusFilter === 'all') return state.items;
      return state.items.filter((l) => l.status === state.statusFilter);
    },
    publishedCount(state): number {
      return state.items.filter((l) => l.status === 'published').length;
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.items = SEED;
      } finally {
        this.loading = false;
      }
    },

    setStatusFilter(status: ListingStatus | 'all') {
      this.statusFilter = status;
    },

    reset() {
      this.items = [];
      this.loading = false;
      this.error = null;
      this.statusFilter = 'all';
    },
  },
});
