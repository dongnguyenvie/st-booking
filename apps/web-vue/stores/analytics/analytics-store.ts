import { defineStore } from 'pinia';

export interface Metric {
  title: string;
  value: string;
  change: string;
  /** lucide icon name in `i-lucide-*` form, resolved by the card component. */
  icon: string;
}

export interface PageStat {
  page: string;
  views: number;
  sessions: number;
}

interface AnalyticsState {
  metrics: Metric[];
  topPages: PageStat[];
  loading: boolean;
  error: string | null;
}

// Placeholder traffic figures until the analytics API lands.
const SEED_METRICS: Metric[] = [
  { title: 'Page Views', value: '24,521', change: '+12%', icon: 'i-lucide-eye' },
  { title: 'Unique Visitors', value: '8,340', change: '+5%', icon: 'i-lucide-users' },
  { title: 'Booking Conversion', value: '3.2%', change: '-0.4%', icon: 'i-lucide-mouse-pointer-click' },
  { title: 'Avg. Session', value: '2m 14s', change: '+8%', icon: 'i-lucide-clock' },
];

const SEED_PAGES: PageStat[] = [
  { page: '/search', views: 6210, sessions: 3100 },
  { page: '/all-listings', views: 4830, sessions: 2400 },
  { page: '/listings/three-sisters-chalet', views: 3920, sessions: 1950 },
  { page: '/', views: 3100, sessions: 1600 },
  { page: '/about-us', views: 2540, sessions: 1200 },
];

export const useAnalyticsStore = defineStore('analytics', {
  state: (): AnalyticsState => ({
    metrics: [],
    topPages: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOverview() {
      this.loading = true;
      this.error = null;
      try {
        this.metrics = SEED_METRICS;
        this.topPages = SEED_PAGES;
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.metrics = [];
      this.topPages = [];
      this.loading = false;
      this.error = null;
    },
  },
});
