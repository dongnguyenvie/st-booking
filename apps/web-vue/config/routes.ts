/**
 * Centralized route path registry.
 * Prevents magic strings across the app.
 */
export const ROUTES = {
  /** Guest-facing surface — no authentication anywhere under here. */
  public: {
    home: '/',
    allListings: '/all-listings',
    search: '/search',
    about: '/about-us',
    contact: '/contact-us',
    privacy: '/privacy-policy',
    terms: '/terms-and-conditions',
  },
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

/** Header nav on the guest surface. */
export const PUBLIC_NAV = [
  { label: 'Home', to: ROUTES.public.home },
  { label: 'About Us', to: ROUTES.public.about },
  { label: 'All listings', to: ROUTES.public.allListings },
  { label: 'Contact Us', to: ROUTES.public.contact },
] as const;

/** Footer links on the guest surface. */
export const PUBLIC_FOOTER_LINKS = [
  { label: 'Privacy Policy', to: ROUTES.public.privacy },
  { label: 'Terms & Conditions', to: ROUTES.public.terms },
  { label: 'Contact Us', to: ROUTES.public.contact },
] as const;

/** Auth routes reachable while signed out. The guest surface is public by default. */
export const PUBLIC_AUTH_ROUTES = [
  ROUTES.auth.login,
  ROUTES.auth.verify,
  ROUTES.auth.callback,
  ROUTES.auth.register,
] as const;

export const ADMIN_ROUTES_PREFIX = '/admin';
