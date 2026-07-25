import { useAuthStore } from '~/stores/auth-store';
import { ROUTES } from '~/config/routes';

/**
 * Auth composable wrapping Auth0 SDK + Pinia store.
 * Handles both Auth0 PKCE and email/password flows.
 * Gracefully handles missing Auth0 SDK (placeholder config).
 */
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  /** Redirect to Auth0 Universal Login */
  async function loginWithAuth0() {
    if (!import.meta.client) return;
    try {
      const { useAuth0 } = await import('@auth0/auth0-vue');
      const auth0 = useAuth0();
      await auth0.loginWithRedirect();
    } catch {
      console.warn('[Auth] Auth0 not available');
    }
  }

  /** Logout and clear all session data */
  async function logout() {
    authStore.clearAuth();
    await router.push(ROUTES.auth.login);
  }

  /** Set auth state after successful login (either flow) */
  function setSession(
    token: string,
    user: { id: string; email: string; name: string; privileges: number[] },
  ) {
    authStore.setAuth(token, user);
  }

  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAdmin: computed(() => authStore.isAdmin),
    loginWithAuth0,
    logout,
    setSession,
  };
}
