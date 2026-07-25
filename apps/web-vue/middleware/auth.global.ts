import { PUBLIC_ROUTES, ADMIN_ROUTES_PREFIX, ROUTES } from '~/config/routes';
import { getHomeRouteByPrivileges } from '~/config/get-home-route-by-privileges';
import { useAuthStore } from '~/stores/auth-store';

/**
 * Global auth middleware.
 * - Public routes (login, verify, callback, register): always accessible
 * - Everything under /admin/*: requires authentication
 * - Authenticated users on login/verify/register → redirect to their home
 *
 * Per-permission gating is not done here: the API enforces RBAC, and this app
 * is the back office only — there is no second surface to bounce a signed-in
 * user to.
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (
    authStore.isAuthenticated &&
    (to.path === ROUTES.auth.login ||
      to.path === ROUTES.auth.verify ||
      to.path === ROUTES.auth.register)
  ) {
    return navigateTo(getHomeRouteByPrivileges(authStore.privileges));
  }

  if (PUBLIC_ROUTES.some((route) => to.path === route)) {
    return;
  }

  if (!to.path.startsWith(ADMIN_ROUTES_PREFIX)) {
    return;
  }

  if (!authStore.isAuthenticated) {
    return navigateTo(ROUTES.auth.login);
  }
});
