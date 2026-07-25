'use client';

import {
  useGetRolesQuery,
  useGetUserRolesQuery,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,
} from '@/api-service/generated/graphql-hooks.generated';
import type { PaginationInput } from '@/api-service/generated/graphql.generated';

const toMessage = (error: unknown) =>
  error ? ((error as any)?.response?.errors?.[0]?.message ?? (error as Error).message) : null;

/** All roles (with their permission sets). */
export function useRoles(pagination?: PaginationInput) {
  const { data, isLoading, error, refetch } = useGetRolesQuery({ pagination });
  return {
    roles: data?.getRoles.data ?? [],
    meta: data?.getRoles.meta ?? { total: 0, page: 1, limit: 20 },
    loading: isLoading,
    error: toMessage(error),
    fetch: refetch,
  };
}

/** Roles assigned to a user, plus assign/remove. */
export function useUserRoles(userId: string, pagination?: PaginationInput) {
  const { data, isLoading, error, refetch } = useGetUserRolesQuery(
    { userId, pagination },
    { enabled: !!userId },
  );
  const { mutateAsync: assignAsync } = useAssignRoleToUserMutation();
  const { mutateAsync: removeAsync } = useRemoveRoleFromUserMutation();

  const assign = async (roleId: string): Promise<void> => {
    await assignAsync({ userId, roleId });
    await refetch();
  };

  const remove = async (roleId: string): Promise<void> => {
    await removeAsync({ userId, roleId });
    await refetch();
  };

  return {
    roles: data?.getUserRoles.data ?? [],
    meta: data?.getUserRoles.meta ?? { total: 0, page: 1, limit: 20 },
    loading: isLoading,
    error: toMessage(error),
    fetch: refetch,
    assign,
    remove,
  };
}
