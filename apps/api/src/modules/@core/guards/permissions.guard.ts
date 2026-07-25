import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Privilege } from '@repo/core';
import { RoleCacheService } from '../services/role-cache.service';

export const PRIVILEGES_KEY = 'privileges';
export const PERMISSIONS_KEY = 'permissions';

/**
 * RBAC guard — resolves User → Role → Permission and rejects on a missing
 * permission.
 *
 * Order of checks:
 *  1. SUPER_ADMIN privilege bypasses everything (break-glass).
 *  2. If the route lists required privileges and the user has one, allow.
 *  3. Otherwise resolve the user's role-derived permission set (Redis-cached)
 *     and require EVERY permission the route asks for.
 *  4. A route with neither privileges nor permissions = any authenticated user.
 *
 * The resolved permission list is injected onto req.user.permissions so
 * handlers can reuse it without re-querying.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleCache: RoleCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = this.getUser(context);
    if (!user) throw new ForbiddenException('Not authenticated');

    const privileges: number[] = user.privileges ?? [];
    if (privileges.includes(Privilege.SUPER_ADMIN)) return true;

    const requiredPrivileges =
      this.reflector.getAllAndOverride<number[]>(PRIVILEGES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPrivileges.length > 0 && requiredPrivileges.some((p) => privileges.includes(p))) {
      return true;
    }

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    // Resolve role → permission set (Redis-cached) and expose to handlers.
    const roleIds: string[] = user.roleIds ?? [];
    const granted = roleIds.length ? await this.roleCache.permissionsFor(roleIds) : new Set<string>();
    user.permissions = [...granted];

    if (requiredPermissions.length === 0) {
      // No specific permission required. If the route also required a privilege
      // we already failed that above; otherwise any authenticated user passes.
      if (requiredPrivileges.length === 0) return true;
      throw new ForbiddenException('Insufficient privileges');
    }

    const hasAll = requiredPermissions.every((p) => granted.has(p));
    if (hasAll) return true;

    throw new ForbiddenException('Missing required permission');
  }

  private getUser(context: ExecutionContext): any {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req?.user;
    }
    return context.switchToHttp().getRequest()?.user;
  }
}
