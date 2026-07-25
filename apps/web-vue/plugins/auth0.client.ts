import { createAuth0 } from '@auth0/auth0-vue';

/**
 * Client-only Auth0 plugin.
 * Uses .client.ts suffix to avoid SSR hydration issues.
 * Gracefully handles missing/invalid Auth0 config.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const domain = config.public.auth0Domain as string;
  const clientId = config.public.auth0ClientId as string;

  // Skip Auth0 init if config is placeholder or empty
  if (!domain || !clientId || domain.includes('placeholder')) {
    console.warn('[Auth0] Skipping init — missing or placeholder config');
    return;
  }

  try {
    const auth0 = createAuth0({
      domain,
      clientId,
      authorizationParams: {
        audience: config.public.auth0Audience as string,
        redirect_uri: `${window.location.origin}/auth/callback`,
      },
    });

    nuxtApp.vueApp.use(auth0);
  } catch (err) {
    console.error('[Auth0] Failed to initialize:', err);
  }
});
