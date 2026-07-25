import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  devtools: { enabled: true },

  // SPA mode — the back office does not need SSR (no SEO, all auth-gated)
  ssr: false,

  vite: {
    plugins: [tailwindcss()],
  },

  devServer: {
    port: 3001,
  },

  modules: ['@pinia/nuxt', 'shadcn-nuxt'],

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  css: ['~/assets/css/main.css'],

  // Auto-import feature module composables and components
  components: [
    { path: '~/components' },
    { path: '~/modules/auth/components', prefix: 'Auth' },
    { path: '~/modules/admin/components', prefix: 'Admin' },
    { path: '~/modules/security/components', prefix: 'Security' },
    { path: '~/modules/listings/components', prefix: 'Listings' },
    { path: '~/modules/reservations/components', prefix: 'Reservations' },
    { path: '~/modules/reviews/components', prefix: 'Reviews' },
    { path: '~/modules/analytics/components', prefix: 'Analytics' },
    { path: '~/modules/home/components', prefix: 'Home' },
    { path: '~/modules/all-listings/components', prefix: 'AllListings' },
    { path: '~/modules/search/components', prefix: 'Search' },
    { path: '~/modules/listing-detail/components', prefix: 'ListingDetail' },
    { path: '~/modules/about-us/components', prefix: 'AboutUs' },
    { path: '~/modules/contact-us/components', prefix: 'ContactUs' },
  ],

  imports: {
    dirs: ['composables', 'modules/*/composables', 'stores/*'],
  },

  runtimeConfig: {
    public: {
      apiEndpoint: '', // NUXT_PUBLIC_API_ENDPOINT
      useSsl: 'false', // NUXT_PUBLIC_USE_SSL
      auth0Domain: '', // NUXT_PUBLIC_AUTH0_DOMAIN
      auth0ClientId: '', // NUXT_PUBLIC_AUTH0_CLIENT_ID
      auth0Audience: '', // NUXT_PUBLIC_AUTH0_AUDIENCE
      appName: 'Canmore Stays',
    },
  },

  // Alias @repo/core to source TS (dist is CJS, Vite needs ESM)
  alias: {
    '@repo/core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
  },

  typescript: {
    strict: true,
  },
});
