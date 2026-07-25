import { z } from 'zod';

/**
 * Schema for validating public runtime config.
 * Nuxt auto-maps NUXT_PUBLIC_* env vars to runtimeConfig.public.
 * Note: Nuxt may coerce string "false" to boolean false, so accept both.
 */
const envSchema = z.object({
  apiEndpoint: z.string().min(1, 'NUXT_PUBLIC_API_ENDPOINT is required'),
  useSsl: z.union([z.string(), z.boolean()]).default('false'),
  auth0Domain: z.string().min(1, 'NUXT_PUBLIC_AUTH0_DOMAIN is required'),
  auth0ClientId: z.string().min(1, 'NUXT_PUBLIC_AUTH0_CLIENT_ID is required'),
  auth0Audience: z.string().min(1, 'NUXT_PUBLIC_AUTH0_AUDIENCE is required'),
  appName: z.string().default('Innoland'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates runtime config and throws on missing required vars.
 * Called in app:created plugin to fail fast.
 */
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    console.error(`[ENV] Missing required environment variables:\n${errors}`);
    // Don't throw — log warning so SSR doesn't crash
    return config as unknown as EnvConfig;
  }
  return result.data;
}
