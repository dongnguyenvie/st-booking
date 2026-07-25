import type { GetRolesQuery, GetPermissionsQuery } from '@/api-service/generated/graphql.generated';

/** A role with its permission set, from the GetRoles query response. */
export type RoleItem = GetRolesQuery['getRoles']['data'][number];

/** A single permission from the catalog (GetPermissions). */
export type PermissionItem = GetPermissionsQuery['getPermissions']['data'][number];

export interface PermissionsState {
  loadingCount: number;
  roles: RoleItem[];
  /** The full permission catalog (resource:verb), for the assignment UI. */
  permissionCatalog: PermissionItem[];
  error: string | null;
  /** Dialog open state for create/edit */
  createDialogOpen: boolean;
  /** Role being edited; null means create mode */
  editingRole: RoleItem | null;
}
