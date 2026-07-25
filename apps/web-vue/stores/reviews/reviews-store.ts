import { defineStore } from 'pinia';

export interface Review {
  id: string;
  listingTitle: string;
  guestName: string;
  rating: number;
  body: string;
  stayedOn: string;
  response: string | null;
}

interface ReviewsState {
  items: Review[];
  loading: boolean;
  error: string | null;
  /** When true, only reviews the host has not replied to yet. */
  awaitingResponseOnly: boolean;
}

// Placeholder reviews until the review API lands. Shape matches
// specs/canmorestays/08-data-model.md.
const SEED: Review[] = [
  {
    id: 'rev_001',
    listingTitle: 'Three Sisters Chalet',
    guestName: 'Marco Feliz',
    rating: 5,
    body: 'Mountain views from every window and the hot tub was spotless.',
    stayedOn: '2026-07-07',
    response: 'Thanks Marco — come back in ski season!',
  },
  {
    id: 'rev_002',
    listingTitle: 'Spring Creek Loft',
    guestName: 'Priya Rao',
    rating: 4,
    body: 'Great location, walkable to town. Parking was a little tight.',
    stayedOn: '2026-06-21',
    response: null,
  },
  {
    id: 'rev_003',
    listingTitle: 'Bow River Studio',
    guestName: 'Ellis Hart',
    rating: 3,
    body: 'Cozy but the heating took a while to kick in on the first night.',
    stayedOn: '2026-05-30',
    response: null,
  },
];

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    items: [],
    loading: false,
    error: null,
    awaitingResponseOnly: false,
  }),

  getters: {
    visible(state): Review[] {
      if (!state.awaitingResponseOnly) return state.items;
      return state.items.filter((r) => r.response === null);
    },
    awaitingResponseCount(state): number {
      return state.items.filter((r) => r.response === null).length;
    },
    averageRating(state): number {
      if (state.items.length === 0) return 0;
      const sum = state.items.reduce((total, r) => total + r.rating, 0);
      return Math.round((sum / state.items.length) * 10) / 10;
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

    toggleAwaitingResponseOnly() {
      this.awaitingResponseOnly = !this.awaitingResponseOnly;
    },

    reset() {
      this.items = [];
      this.loading = false;
      this.error = null;
      this.awaitingResponseOnly = false;
    },
  },
});
