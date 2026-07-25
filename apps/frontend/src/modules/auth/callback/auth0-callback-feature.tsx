'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch } from '@/store/store';
import { authA } from '@/store/modules/auth';
import { ROUTES } from '@/core/routes';
import { getHomeRoute } from '@/core/get-home-route-by-privileges';

/**
 * Handles the Auth0 post-login callback:
 * 1. Auth0Provider has already exchanged the code for tokens (PKCE).
 * 2. We get the Auth0 access token via getAccessTokenSilently().
 * 3. Dispatch signInByAuth0 → backend validates Auth0 token, returns internal JWT.
 * 4. Store internal JWT in Redux + localStorage, then redirect to dashboard.
 */
export function Auth0CallbackFeature() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, getAccessTokenSilently, error } = useAuth0();
  const exchangeStarted = useRef(false);

  useEffect(() => {
    // Wait until Auth0 finishes processing the callback URL
    if (isLoading) return;

    // Redirect with error if Auth0 reported a failure
    if (error) {
      router.replace(`${ROUTES.auth.login}?error=${encodeURIComponent(error.message)}`);
      return;
    }

    // Only proceed once (guard against Strict Mode double-invoke or re-renders)
    if (!isAuthenticated || exchangeStarted.current) return;
    exchangeStarted.current = true;

    getAccessTokenSilently()
      .then((auth0Token) => {
        dispatch(
          authA.signInByAuth0(auth0Token, {
            onSuccess: (user) => {
              const target = getHomeRoute(user ?? { privileges: [] });
              router.replace(target);
            },
            onError: (msg) => router.replace(`${ROUTES.auth.login}?error=${encodeURIComponent(msg)}`),
          }),
        );
      })
      .catch((err: Error) => {
        router.replace(`${ROUTES.auth.login}?error=${encodeURIComponent(err.message)}`);
      });
  }, [isAuthenticated, isLoading, error, getAccessTokenSilently, dispatch, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {error ? (
        <p className="text-sm text-destructive">Error: {error.message}</p>
      ) : (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Signing you in...</p>
        </>
      )}
    </div>
  );
}
