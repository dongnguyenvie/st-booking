/**
 * Centralized route path registry.
 * Prevents magic strings across the app.
 */
export const ROUTES = {
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    listings: '/admin/listings',
    reservations: '/admin/reservations',
    reviews: '/admin/reviews',
    settings: '/admin/settings',
    security: '/admin/settings/security',
    permissions: '/admin/permissions',
    apiKeys: '/admin/api-keys',
    analytics: '/admin/analytics',
  },
  auth: {
    login: '/auth/login',
    verify: '/auth/login/verify',
    callback: '/auth/callback',
    register: '/auth/register',
  },
} as const;

/** Routes accessible without authentication */
export const PUBLIC_ROUTES = [
  ROUTES.auth.login,
  ROUTES.auth.verify,
  ROUTES.auth.callback,
  ROUTES.auth.register,
] as const;

export const ADMIN_ROUTES_PREFIX = '/admin';
