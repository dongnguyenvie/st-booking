import { PUBLIC_AUTH_ROUTES, ADMIN_ROUTES_PREFIX, ROUTES } from '~/config/routes';
import { getHomeRouteByPrivileges } from '~/config/get-home-route-by-privileges';
import { useAuthStore } from '~/stores/auth-store';

/**
 * Global auth middleware.
 *
 * The guest surface is public by default: only `/admin/*` is gated, and it
 * needs both a session and the admin privilege. A signed-in non-admin is sent
 * back to the public home rather than the back office.
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Signed-in users have no business on login/verify/register.
  if (
    authStore.isAuthenticated &&
    (to.path === ROUTES.auth.login ||
      to.path === ROUTES.auth.verify ||
      to.path === ROUTES.auth.register)
  ) {
    return navigateTo(getHomeRouteByPrivileges(authStore.privileges));
  }

  if (PUBLIC_AUTH_ROUTES.some((route) => to.path === route)) {
    return;
  }

  // Everything outside /admin is the public guest surface.
  if (!to.path.startsWith(ADMIN_ROUTES_PREFIX)) {
    return;
  }

  if (!authStore.isAuthenticated) {
    return navigateTo(ROUTES.auth.login);
  }

  if (!authStore.isAdmin) {
    return navigateTo(ROUTES.public.home);
  }
});
