import { defineStore } from 'pinia';
import { LISTINGS, TOTAL_PROPERTY_COUNT, type PublicListing } from '~/mock/listings';
import { emptyCriteria, toSearchQuery, type SearchCriteria } from '~/mock/search-criteria';

interface HomeState {
  criteria: SearchCriteria;
  /** Amenity chips toggled under the hero search. */
  quickFilters: string[];
  topProperties: PublicListing[];
  totalProperties: number;
  loading: boolean;
}

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    criteria: emptyCriteria(),
    quickFilters: [],
    topProperties: [],
    totalProperties: TOTAL_PROPERTY_COUNT,
    loading: false,
  }),

  getters: {
    searchQuery(state): Record<string, string> {
      const query = toSearchQuery(state.criteria);
      if (state.quickFilters.length) query.amenities = state.quickFilters.join(',');
      return query;
    },
  },

  actions: {
    async fetchTopProperties() {
      this.loading = true;
      try {
        // The reference home shows 15 cards above the "explore all" CTA.
        this.topProperties = LISTINGS.slice(0, 15);
      } finally {
        this.loading = false;
      }
    },

    toggleQuickFilter(amenity: string) {
      this.quickFilters = this.quickFilters.includes(amenity)
        ? this.quickFilters.filter((a) => a !== amenity)
        : [...this.quickFilters, amenity];
    },

    reset() {
      this.criteria = emptyCriteria();
      this.quickFilters = [];
      this.topProperties = [];
      this.loading = false;
    },
  },
});
