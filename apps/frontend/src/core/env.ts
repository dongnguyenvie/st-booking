/**
 * Type-safe environment variables with Zod validation.
 * App will throw at BUILD TIME if required vars are missing or invalid.
 * Import from here instead of accessing process.env directly.
 */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    // Add server-only secrets here (never exposed to client)
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default('Carousel Marketplace'),
    NEXT_PUBLIC_APP_ENV: z.enum(['local', 'staging', 'production']).default('local'),
    NEXT_PUBLIC_API_ENDPOINT: z.string().default('localhost:4000'),
    NEXT_PUBLIC_REDUX_DEBUG: z.string().default('false'),
    // Auth0 SPA (PKCE flow) — public values, safe to expose to browser
    NEXT_PUBLIC_AUTH0_DOMAIN: z.string(),
    NEXT_PUBLIC_AUTH0_CLIENT_ID: z.string(),
    NEXT_PUBLIC_AUTH0_AUDIENCE: z.string().optional(),
    /** Force SSL on/off. Default true — set to "false" locally to use http/ws */
    NEXT_PUBLIC_USE_SSL: z.string().default('true'),
  },
  // Map process.env for both runtimes
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_REDUX_DEBUG: process.env.NEXT_PUBLIC_REDUX_DEBUG,
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    NEXT_PUBLIC_USE_SSL: process.env.NEXT_PUBLIC_USE_SSL,
  },
});
