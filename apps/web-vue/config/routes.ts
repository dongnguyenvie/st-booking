/**
 * Centralized route path registry.
 * Prevents magic strings across the app.
 */
export const ROUTES = {
  pos: {
    dashboard: '/pos/dashboard',
    orders: '/pos/orders',
    checkout: '/pos/checkout',
    register: '/pos/register',
  },
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    products: '/admin/products',
    reports: '/admin/reports',
    settings: '/admin/settings',
    security: '/admin/settings/security',
    permissions: '/admin/permissions',
    apiKeys: '/admin/api-keys',
    analytics: '/admin/analytics',
  },
  auth: {
    login: '/pos/login',
    verify: '/pos/login/verify',
    callback: '/pos/callback',
  },
} as const;

/** Routes accessible without authentication */
export const PUBLIC_ROUTES = [
  ROUTES.auth.login,
  ROUTES.auth.verify,
  ROUTES.auth.callback,
  ROUTES.pos.register,
] as const;

/** Routes requiring POS_MANAGER privilege */
export const ADMIN_ROUTES_PREFIX = '/admin';
