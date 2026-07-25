import { defineStore } from 'pinia';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  code: string;
  listingTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: ReservationStatus;
}

interface ReservationsState {
  items: Reservation[];
  loading: boolean;
  error: string | null;
  statusFilter: ReservationStatus | 'all';
}

// Placeholder bookings until the reservation API lands. Shape matches
// specs/canmorestays/08-data-model.md.
const SEED: Reservation[] = [
  {
    id: 'res_001',
    code: 'CS-4821',
    listingTitle: 'Three Sisters Chalet',
    guestName: 'Avery Singh',
    checkIn: '2026-08-14',
    checkOut: '2026-08-18',
    guests: 6,
    total: 1860,
    status: 'confirmed',
  },
  {
    id: 'res_002',
    code: 'CS-4822',
    listingTitle: 'Spring Creek Loft',
    guestName: 'Dana Whitfield',
    checkIn: '2026-08-16',
    checkOut: '2026-08-19',
    guests: 3,
    total: 657,
    status: 'pending',
  },
  {
    id: 'res_003',
    code: 'CS-4815',
    listingTitle: 'Grassi Lakes Cabin',
    guestName: 'Marco Feliz',
    checkIn: '2026-07-02',
    checkOut: '2026-07-07',
    guests: 5,
    total: 1660,
    status: 'completed',
  },
  {
    id: 'res_004',
    code: 'CS-4809',
    listingTitle: 'Bow River Studio',
    guestName: 'Priya Rao',
    checkIn: '2026-09-01',
    checkOut: '2026-09-03',
    guests: 2,
    total: 296,
    status: 'cancelled',
  },
];

export const useReservationsStore = defineStore('reservations', {
  state: (): ReservationsState => ({
    items: [],
    loading: false,
    error: null,
    statusFilter: 'all',
  }),

  getters: {
    visible(state): Reservation[] {
      if (state.statusFilter === 'all') return state.items;
      return state.items.filter((r) => r.status === state.statusFilter);
    },
    pendingCount(state): number {
      return state.items.filter((r) => r.status === 'pending').length;
    },
    confirmedRevenue(state): number {
      return state.items
        .filter((r) => r.status === 'confirmed' || r.status === 'completed')
        .reduce((sum, r) => sum + r.total, 0);
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

    setStatusFilter(status: ReservationStatus | 'all') {
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
