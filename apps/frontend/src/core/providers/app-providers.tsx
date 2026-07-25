'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { env } from '@/core/env';
import { ROUTES } from '@/core/routes';
import { ReduxProvider } from './redux-provider';
import { QueryProvider } from './query-provider';

/**
 * Root provider tree — add new global providers here.
 * Order: Auth0 (identity) → Redux (state) → Query (data fetching)
 *
 * Auth0Provider uses PKCE flow (no client secret needed).
 * After login, call signInByAuth0 mutation to exchange the Auth0 access token
 * for an internal JWT — then Auth0 is no longer used.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.auth.callback}` : '',
        audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
    >
      <ReduxProvider>
        <QueryProvider>{children}</QueryProvider>
      </ReduxProvider>
    </Auth0Provider>
  );
}
