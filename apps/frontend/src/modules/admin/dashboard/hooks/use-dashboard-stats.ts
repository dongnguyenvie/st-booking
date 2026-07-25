'use client';

import { useGetDashboardStatsQuery } from '@/api-service/generated/graphql-hooks.generated';
import type { GetDashboardStatsOutput } from '@/api-service/generated/graphql.generated';

export type { GetDashboardStatsOutput as DashboardStats };

export function useDashboardStats() {
  const { data, isLoading, error, refetch } = useGetDashboardStatsQuery();
  return {
    stats: data?.getDashboardStats.data ?? null,
    loading: isLoading,
    error: error ? ((error as any)?.response?.errors?.[0]?.message ?? (error as Error).message) : null,
    fetch: refetch,
  };
}
