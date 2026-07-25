'use client';

import { useGetUsersQuery } from '@/api-service/generated/graphql-hooks.generated';
import type { PaginationInput } from '@/api-service/generated/graphql.generated';

// Single definition lives in core/ so the users store module can share it.
export type { UserListItem } from '@/core/admin/user-types';

export function useUsersData(pagination?: PaginationInput) {
  const { data, isLoading, error, refetch } = useGetUsersQuery({ pagination });
  return {
    items: data?.getUsers.data ?? [],
    meta: data?.getUsers.meta ?? { total: 0, page: 1, limit: 20 },
    loading: isLoading,
    error: error ? ((error as any)?.response?.errors?.[0]?.message ?? (error as Error).message) : null,
    fetch: refetch,
  };
}
