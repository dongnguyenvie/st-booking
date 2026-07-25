import { Privilege } from '@repo/core';
import { ROUTES } from '~/config/routes';

/** Privilege group definitions — grouped by access tier, ordered by priority */
export const PRIVILEGE_GROUPS = [
  {
    key: 'admin' as const,
    label: 'Admin',
    privileges: [Privilege.SUPER_ADMIN, Privilege.ADMIN],
    route: ROUTES.admin.dashboard,
  },
  {
    key: 'pos' as const,
    label: 'POS',
    privileges: [Privilege.POS_USER, Privilege.POS_MANAGER],
    route: ROUTES.pos.dashboard,
  },
];

/**
 * Return the correct dashboard route based on the user's privilege list.
 * Privileges are integers from the API ([Int!]! in GraphQL schema).
 * Highest-priority group wins (admin > pos).
 */
export function getHomeRouteByPrivileges(privileges: number[]): string {
  for (const group of PRIVILEGE_GROUPS) {
    if (privileges.some((p) => group.privileges.includes(p))) return group.route;
  }
  return ROUTES.auth.login;
}

/** Return the dashboard route for a single active privilege */
export function getRouteByPrivilege(privilege: number): string {
  const group = PRIVILEGE_GROUPS.find((g) => g.privileges.includes(privilege));
  return group?.route ?? ROUTES.auth.login;
}
