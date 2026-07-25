/** Centralised route path registry — avoids hardcoded strings across the app */

/**
 * Centralised route path registry.
 * The (auth) route group has NO URL prefix — its pages resolve to root-level paths.
 * admin/ and marketplace/ are real folder prefixes, each with its own layout.
 */
export const ROUTES = {
  home: '/',
  auth: {
    login: '/login',
    loginVerify: '/login/verify',
    register: '/register',
    forgotPassword: '/forgot-password',
    /** Auth0 PKCE callback — exchanges Auth0 token for internal JWT */
    callback: '/callback',
  },
  admin: {
    dashboard: '/admin/dashboard',
    analytics: '/admin/analytics',
    users: '/admin/users',
    permissions: '/admin/permissions',
    apiKeys: '/admin/api-keys',
    settings: '/admin/settings',
    components: '/admin/components',
  },
  /** Borrower side — browse offers for your request, sign, get funded. */
  borrower: {
    offers: '/marketplace/borrower/offers',
    offerDetail: (offerId: string) => `/marketplace/borrower/offers/${offerId}`,
    market: '/marketplace/borrower/market',
    fundingRoom: '/marketplace/borrower/funding-room',
    fundings: '/marketplace/borrower/fundings',
    profile: '/marketplace/borrower/profile',
  },
  /** Lender side — the desk where deals are priced and funded. */
  lender: {
    deals: '/marketplace/lender/deals',
    dealDetail: (dealId: string) => `/marketplace/lender/deals/${dealId}`,
    pipeline: '/marketplace/lender/pipeline',
  },
} as const;
