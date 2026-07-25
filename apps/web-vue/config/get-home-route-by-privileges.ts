import { Privilege } from '@repo/core';
import { ROUTES } from '~/config/routes';

/**
 * Privilege group definitions — grouped by access tier, ordered by priority.
 *
 * Marketplace/POS authority is now granted through Roles, not privileges.
 * The only remaining privilege flag is the SUPER_ADMIN break-glass bit, which
 * unlocks the admin surface. Everyone else lands on the POS surface by default.
 */
export const PRIVILEGE_GROUPS = [
  {
    key: 'admin' as const,
    label: 'Admin',
    privileges: [Privilege.SUPER_ADMIN],
    route: ROUTES.admin.dashboard,
  },
] as const;

/**
 * Return the correct dashboard route based on the user's privilege list.
 * Privileges are integers from the API ([Int!]! in GraphQL schema).
 * SUPER_ADMIN unlocks the admin dashboard; otherwise fall back to POS.
 */
export function getHomeRouteByPrivileges(privileges: number[]): string {
  for (const group of PRIVILEGE_GROUPS) {
    if (privileges.some((p) => group.privileges.includes(p))) return group.route;
  }
  return ROUTES.pos.dashboard;
}

/** Return the dashboard route for a single active privilege */
export function getRouteByPrivilege(privilege: number): string {
  const group = PRIVILEGE_GROUPS.find((g) => g.privileges.includes(privilege));
  return group?.route ?? ROUTES.pos.dashboard;
}
