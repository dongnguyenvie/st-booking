import { validateEnv } from '~/utils/env-validation';

/**
 * Validates runtime config on app startup.
 * Throws immediately if required env vars are missing.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  validateEnv(config.public);
});
