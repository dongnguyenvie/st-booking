import { Auth0CallbackFeature } from '@/modules/auth/callback/auth0-callback-feature';

/**
 * Landing page after Auth0 completes the OAuth callback.
 * The SDK has already exchanged the code for tokens at /api/auth/callback.
 * This page exchanges the Auth0 access token for an internal JWT via server action.
 */
export default function Auth0CallbackPage() {
  return <Auth0CallbackFeature />;
}
