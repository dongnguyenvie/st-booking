import { defineStore } from 'pinia';
import { LISTINGS, ALL_AMENITIES, type PublicListing } from '~/mock/listings';

interface ListingDetailState {
  listing: PublicListing | null;
  loading: boolean;
  notFound: boolean;
  /** Booking widget state — dates and party size for the quote. */
  checkIn: string;
  checkOut: string;
  guests: number;
  descriptionExpanded: boolean;
  amenitiesModalOpen: boolean;
}

export const useListingDetailStore = defineStore('listing-detail', {
  state: (): ListingDetailState => ({
    listing: null,
    loading: false,
    notFound: false,
    checkIn: '',
    checkOut: '',
    guests: 1,
    descriptionExpanded: false,
    amenitiesModalOpen: false,
  }),

  getters: {
    nights(state): number {
      if (!state.checkIn || !state.checkOut) return 0;
      const ms = new Date(state.checkOut).getTime() - new Date(state.checkIn).getTime();
      return Math.max(0, Math.round(ms / 86_400_000));
    },

    /**
     * Placeholder quote. The real breakdown is server-priced — the API
     * re-validates and re-prices before a reservation is written.
     */
    quote(state): { nights: number; subtotal: number; cleaningFee: number; total: number } | null {
      if (!state.listing) return null;
      const ms = new Date(state.checkOut).getTime() - new Date(state.checkIn).getTime();
      const nights = state.checkIn && state.checkOut ? Math.max(0, Math.round(ms / 86_400_000)) : 0;
      if (nights === 0) return null;
      const subtotal = nights * state.listing.nightlyRate;
      const cleaningFee = 180;
      return { nights, subtotal, cleaningFee, total: subtotal + cleaningFee };
    },

    allAmenities(): string[] {
      return ALL_AMENITIES;
    },
  },

  actions: {
    async fetchById(id: string) {
      this.loading = true;
      this.notFound = false;
      try {
        this.listing = LISTINGS.find((l) => l.id === id) ?? null;
        this.notFound = this.listing === null;
      } finally {
        this.loading = false;
      }
    },

    toggleDescription() {
      this.descriptionExpanded = !this.descriptionExpanded;
    },

    openAmenitiesModal() {
      this.amenitiesModalOpen = true;
    },

    closeAmenitiesModal() {
      this.amenitiesModalOpen = false;
    },

    clearDates() {
      this.checkIn = '';
      this.checkOut = '';
    },

    reset() {
      this.listing = null;
      this.loading = false;
      this.notFound = false;
      this.checkIn = '';
      this.checkOut = '';
      this.guests = 1;
      this.descriptionExpanded = false;
      this.amenitiesModalOpen = false;
    },
  },
});
