import { defineStore } from 'pinia';
import {
  LISTINGS,
  TOTAL_PROPERTY_COUNT,
  RESIDENTIAL_PROPERTY_COUNT,
  type PublicListing,
} from '~/mock/listings';

export type CatalogueTab = 'all' | 'residential';

interface AllListingsState {
  items: PublicListing[];
  tab: CatalogueTab;
  mapVisible: boolean;
  loading: boolean;
}

export const useAllListingsStore = defineStore('all-listings', {
  state: (): AllListingsState => ({
    items: [],
    tab: 'all',
    mapVisible: false,
    loading: false,
  }),

  getters: {
    visible(state): PublicListing[] {
      if (state.tab === 'all') return state.items;
      return state.items.filter((l) => l.category === 'residential');
    },
    /** Counts come from the catalogue, not the mock page slice. */
    tabs(): Array<{ key: CatalogueTab; label: string }> {
      return [
        { key: 'all', label: `All (${TOTAL_PROPERTY_COUNT})` },
        { key: 'residential', label: `Residential (${RESIDENTIAL_PROPERTY_COUNT})` },
      ];
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      try {
        this.items = LISTINGS;
      } finally {
        this.loading = false;
      }
    },

    setTab(tab: CatalogueTab) {
      this.tab = tab;
    },

    toggleMap() {
      this.mapVisible = !this.mapVisible;
    },

    reset() {
      this.items = [];
      this.tab = 'all';
      this.mapVisible = false;
      this.loading = false;
    },
  },
});
