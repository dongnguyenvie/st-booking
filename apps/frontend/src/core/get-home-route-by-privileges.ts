import { Privilege, RoleName } from '@repo/core';
import { ROUTES } from './routes';

export interface RoutableUser {
  /** Numeric privilege flags — only SUPER_ADMIN is meaningful now. */
  privileges?: number[];
  /** Role names (e.g. 'admin', 'lender_owner', 'borrower') from myAccess. */
  roles?: string[];
}

/**
 * Landing route after auth. Which *surface* a user lands on is a role decision
 * (borrower vs lender desk vs admin); SUPER_ADMIN is a break-glass shortcut to
 * the admin dashboard. Button-level gating is done per-permission elsewhere.
 */
export function getHomeRoute(user: RoutableUser): string {
  const privileges = user.privileges ?? [];
  const roles = user.roles ?? [];

  if (privileges.includes(Privilege.SUPER_ADMIN) || roles.includes(RoleName.ADMIN)) {
    return ROUTES.admin.dashboard;
  }
  if (roles.includes(RoleName.LENDER_OWNER) || roles.includes(RoleName.LENDER_OPERATOR)) {
    return ROUTES.lender.deals;
  }
  if (roles.includes(RoleName.BORROWER)) {
    return ROUTES.borrower.offers;
  }
  return ROUTES.auth.login;
}

/**
 * @deprecated Privilege-only routing — kept for callers that only hold
 * privileges. Prefer {@link getHomeRoute} with roles.
 */
export function getHomeRouteByPrivileges(privileges: number[]): string {
  return getHomeRoute({ privileges });
}

export interface Surface {
  key: 'admin' | 'lender' | 'borrower';
  label: string;
  route: string;
}

/** The marketplace surfaces a user can reach — drives the header surface-switcher. */
export function getAccessibleSurfaces(user: RoutableUser): Surface[] {
  const privileges = user.privileges ?? [];
  const roles = user.roles ?? [];
  const out: Surface[] = [];

  if (privileges.includes(Privilege.SUPER_ADMIN) || roles.includes(RoleName.ADMIN)) {
    out.push({ key: 'admin', label: 'Admin', route: ROUTES.admin.dashboard });
  }
  if (roles.includes(RoleName.LENDER_OWNER) || roles.includes(RoleName.LENDER_OPERATOR)) {
    out.push({ key: 'lender', label: 'Lender', route: ROUTES.lender.deals });
  }
  if (roles.includes(RoleName.BORROWER)) {
    out.push({ key: 'borrower', label: 'Borrower', route: ROUTES.borrower.offers });
  }
  return out;
}
