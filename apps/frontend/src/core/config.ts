/**
 * App-wide configuration.
 * Reads from validated env (throws at build time if vars are missing).
 */
import { env } from './env';

export const CONFIGS = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    env: env.NEXT_PUBLIC_APP_ENV,
  },
  redux: {
    debug: env.NEXT_PUBLIC_REDUX_DEBUG === 'true',
  },
} as const;

const API_ENDPOINT = env.NEXT_PUBLIC_API_ENDPOINT;
// NEXT_PUBLIC_USE_SSL=false to disable SSL locally; default true
const useSSL = env.NEXT_PUBLIC_USE_SSL !== 'false';

export const BACKEND_API = {
  domain: API_ENDPOINT,
  restAPI: `${useSSL ? 'https' : 'http'}://${API_ENDPOINT}/api`,
  graphql: `${useSSL ? 'https' : 'http'}://${API_ENDPOINT}/graphql`,
  graphqlWs: `${useSSL ? 'wss' : 'ws'}://${API_ENDPOINT}/graphql`,
} as const;
