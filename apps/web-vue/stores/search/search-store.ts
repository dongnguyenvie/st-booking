import { defineStore } from 'pinia';
import { LISTINGS, type PublicListing } from '~/mock/listings';
import { emptyCriteria, type SearchCriteria } from '~/mock/search-criteria';

export interface SearchFilters {
  priceFrom: number | null;
  priceTo: number | null;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

interface SearchState {
  criteria: SearchCriteria;
  filters: SearchFilters;
  results: PublicListing[];
  mapVisible: boolean;
  filterModalOpen: boolean;
  loading: boolean;
}

function emptyFilters(): SearchFilters {
  return { priceFrom: null, priceTo: null, bedrooms: 0, bathrooms: 0, amenities: [] };
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    criteria: emptyCriteria(),
    filters: emptyFilters(),
    results: [],
    mapVisible: true,
    filterModalOpen: false,
    loading: false,
  }),

  getters: {
    resultCount(state): number {
      return state.results.length;
    },
  },

  actions: {
    /** Seed the bar from `/search?...` so a shared link reproduces the search. */
    hydrateFromQuery(query: Record<string, string | string[] | undefined>) {
      const one = (key: string) => {
        const value = query[key];
        return typeof value === 'string' ? value : '';
      };
      const guests = Number(one('numberOfGuests'));
      this.criteria = {
        location: one('location'),
        checkIn: one('checkIn'),
        checkOut: one('checkOut'),
        guests: Number.isFinite(guests) && guests > 0 ? guests : 1,
      };
      const amenities = one('amenities');
      if (amenities) this.filters.amenities = amenities.split(',');
    },

    async runSearch() {
      this.loading = true;
      try {
        const { guests } = this.criteria;
        const { priceFrom, priceTo, bedrooms, bathrooms, amenities } = this.filters;
        this.results = LISTINGS.filter((listing) => {
          if (listing.maxGuests < guests) return false;
          if (priceFrom !== null && listing.nightlyRate < priceFrom) return false;
          if (priceTo !== null && listing.nightlyRate > priceTo) return false;
          if (listing.bedrooms < bedrooms) return false;
          if (listing.bathrooms < bathrooms) return false;
          return amenities.every((a) => listing.amenities.includes(a));
        });
      } finally {
        this.loading = false;
      }
    },

    toggleAmenity(amenity: string) {
      this.filters.amenities = this.filters.amenities.includes(amenity)
        ? this.filters.amenities.filter((a) => a !== amenity)
        : [...this.filters.amenities, amenity];
    },

    clearFilters() {
      this.filters = emptyFilters();
    },

    openFilterModal() {
      this.filterModalOpen = true;
    },

    closeFilterModal() {
      this.filterModalOpen = false;
    },

    toggleMap() {
      this.mapVisible = !this.mapVisible;
    },

    reset() {
      this.criteria = emptyCriteria();
      this.filters = emptyFilters();
      this.results = [];
      this.mapVisible = true;
      this.filterModalOpen = false;
      this.loading = false;
    },
  },
});
