import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware — first line of defense for route protection.
 * IMPORTANT: Always verify session in the Data Access Layer too (src/core/auth/get-session.ts).
 * Middleware alone is insufficient (CVE-2025-29927).
 */

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/callback'];

/** App-context prefix — lets the API tell admin / borrower / lender traffic apart */
const APP_CONTEXT_HEADER = 'x-app-context';

/**
 * Privilege values (mirrors @repo/core Privilege enum).
 * Duplicated here because edge runtime can't import from monorepo packages reliably.
 */
const ADMIN_PRIVILEGES = [1, 2]; // SUPER_ADMIN, ADMIN
const BORROWER_PRIVILEGE = 10;
const LENDER_PRIVILEGE = 11;

/** Decode JWT payload without verification (verification happens in API/DAL) */
function decodeJwtPayload(token: string): { privileges?: number[] } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dev bypass — set BYPASS_AUTH=true in .env.local to skip auth checks
  if (process.env.BYPASS_AUTH === 'true') return NextResponse.next();

  // Allow public routes and static assets through
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  if (isPublic) return NextResponse.next();

  // Check session cookie
  const token = request.cookies.get('session_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode JWT to read privileges (not verified — DAL handles verification)
  const payload = decodeJwtPayload(token);
  const privileges: number[] = payload?.privileges ?? [];

  const hasAdmin = privileges.some((p) => ADMIN_PRIVILEGES.includes(p));
  const hasBorrower = privileges.includes(BORROWER_PRIVILEGE);
  const hasLender = privileges.includes(LENDER_PRIVILEGE);

  /** Send a rejected user to a surface they can actually reach. */
  const denyTo = (fallback: string) => {
    const url = new URL(fallback, request.url);
    url.searchParams.set('reason', 'no-access');
    return NextResponse.redirect(url);
  };

  /**
   * First surface this user is entitled to, or the login page.
   *
   * Marketplace roles come before admin: the marketplace is the product and the
   * root route sends everyone there, so someone holding a marketplace role
   * should land in it. Admin is the fallback for back-office-only accounts.
   */
  const homeFor = () => {
    if (hasBorrower) return '/marketplace/borrower/offers';
    if (hasLender) return '/marketplace/lender/deals';
    if (hasAdmin) return '/admin/dashboard';
    return '/login';
  };

  // Guard /admin routes — require at least one admin-tier privilege
  if (pathname.startsWith('/admin') && !hasAdmin) {
    return denyTo(homeFor());
  }

  // Guard the borrower portal — the applicant side of the marketplace
  if (pathname.startsWith('/marketplace/borrower') && !hasBorrower) {
    return denyTo(homeFor());
  }

  // Guard the lender desk — the funding side
  if (pathname.startsWith('/marketplace/lender') && !hasLender) {
    return denyTo(homeFor());
  }

  // Inject app-context header so downstream API calls know the origin
  const response = NextResponse.next();
  if (pathname.startsWith('/admin')) {
    response.headers.set(APP_CONTEXT_HEADER, 'admin');
  } else if (pathname.startsWith('/marketplace/borrower')) {
    response.headers.set(APP_CONTEXT_HEADER, 'borrower');
  } else if (pathname.startsWith('/marketplace/lender')) {
    response.headers.set(APP_CONTEXT_HEADER, 'lender');
  }

  return response;
}

export const config = {
  // Run on all routes except static files and API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
