import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  devtools: { enabled: true },

  // SPA mode — admin/POS app doesn't need SSR (no SEO, all auth-gated)
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
    { path: '~/modules/cashier/components', prefix: 'Cashier' },
    { path: '~/modules/admin/components', prefix: 'Admin' },
    { path: '~/modules/security/components', prefix: 'Security' },
  ],

  imports: {
    dirs: ['composables', 'modules/*/composables', 'modules/*/stores'],
  },

  runtimeConfig: {
    public: {
      apiEndpoint: '', // NUXT_PUBLIC_API_ENDPOINT
      useSsl: 'false', // NUXT_PUBLIC_USE_SSL
      auth0Domain: '', // NUXT_PUBLIC_AUTH0_DOMAIN
      auth0ClientId: '', // NUXT_PUBLIC_AUTH0_CLIENT_ID
      auth0Audience: '', // NUXT_PUBLIC_AUTH0_AUDIENCE
      appName: 'Innoland',
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
