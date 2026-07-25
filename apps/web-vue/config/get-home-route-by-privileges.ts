import { Privilege } from '@repo/core';
import { ROUTES } from '~/config/routes';

/**
 * Privilege group definitions — grouped by access tier, ordered by priority.
 *
 * Booking authority is granted through Roles, not privileges. The only
 * remaining privilege flag is the SUPER_ADMIN break-glass bit.
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
 * Return the landing route for a user's privilege list.
 * Privileges are integers from the API ([Int!]! in GraphQL schema).
 */
export function getHomeRouteByPrivileges(privileges: number[]): string {
  for (const group of PRIVILEGE_GROUPS) {
    if (privileges.some((p) => group.privileges.includes(p))) return group.route;
  }
  return ROUTES.admin.dashboard;
}

/** Return the landing route for a single active privilege */
export function getRouteByPrivilege(privilege: number): string {
  const group = PRIVILEGE_GROUPS.find((g) => g.privileges.includes(privilege));
  return group?.route ?? ROUTES.admin.dashboard;
}
