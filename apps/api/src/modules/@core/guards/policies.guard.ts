import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Privilege, PermissionKey } from '@repo/core';
import { IS_PROTECTED_KEY, UnifiedAuthGuard } from './unified-auth.guard';
import { PRIVILEGES_KEY, PERMISSIONS_KEY, PermissionsGuard } from './permissions.guard';

interface PoliciesGuardOptions {
  /**
   * Required privileges — at least one must match user.privileges[].
   * Practically this is only SUPER_ADMIN now (break-glass). Omit for RBAC.
   */
  privileges?: Privilege[];
  /**
   * Required permissions. The user must hold EVERY listed one — resolved from
   * their roles. SUPER_ADMIN bypasses. Omit to allow any authenticated user.
   *
   * Typed to PermissionKey on purpose: a raw string here would be a route that
   * silently never matches.
   */
  permissions?: PermissionKey[];
}

/**
 * Marks a route as protected (opt-in). Without this decorator the route is public.
 *
 * Access is granted if the user is SUPER_ADMIN, OR matches a required privilege,
 * OR holds every required permission (via their roles).
 *
 * @example
 * // Any authenticated user
 * @PoliciesGuard()
 *
 * // Requires the role:manage permission (granted through a role)
 * @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
 *
 * // Break-glass: super admin only
 * @PoliciesGuard({ privileges: [Privilege.SUPER_ADMIN] })
 */
export function PoliciesGuard(options?: PoliciesGuardOptions) {
  const { privileges = [], permissions = [] } = options ?? {};
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    SetMetadata(IS_PROTECTED_KEY, true),
    UseGuards(UnifiedAuthGuard),
    SetMetadata(PRIVILEGES_KEY, privileges),
    SetMetadata(PERMISSIONS_KEY, permissions),
    UseGuards(PermissionsGuard),
  ];
  return applyDecorators(...decorators);
}
