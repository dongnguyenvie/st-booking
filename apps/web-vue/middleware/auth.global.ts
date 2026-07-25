import { PUBLIC_ROUTES, ADMIN_ROUTES_PREFIX, ROUTES } from '~/config/routes';
import { getHomeRouteByPrivileges } from '~/config/get-home-route-by-privileges';
import { useAuthStore } from '~/stores/auth-store';

/**
 * Global auth middleware.
 * - Public routes (login, callback, register): always accessible
 * - Admin routes (/admin/*): require POS_MANAGER privilege
 * - POS routes (/pos/*): require authentication
 * - Authenticated users on login page → redirect to dashboard
 */
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Redirect authenticated users away from login/verify/register
  if (
    authStore.isAuthenticated &&
    (to.path === ROUTES.auth.login || to.path === ROUTES.auth.verify || to.path === ROUTES.pos.register)
  ) {
    const homePath = getHomeRouteByPrivileges(authStore.privileges);
    return navigateTo(homePath);
  }

  // Skip auth check for public routes
  if (PUBLIC_ROUTES.some((route) => to.path === route)) {
    return;
  }

  // Only protect /pos/* and /admin/* routes
  const isProtected = to.path.startsWith('/pos') || to.path.startsWith('/admin');
  if (!isProtected) {
    return;
  }

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo(ROUTES.auth.login);
  }

  // Check admin privilege for admin routes
  if (to.path.startsWith(ADMIN_ROUTES_PREFIX) && !authStore.isAdmin) {
    return navigateTo(ROUTES.pos.dashboard);
  }
});
