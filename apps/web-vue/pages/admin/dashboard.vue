<script setup lang="ts">
import { useQuery } from 'villus';
import { GetDashboardStatsDocument } from '~/api-service/generated/graphql';

definePageMeta({ layout: 'admin' });

const { data, isFetching } = useQuery({ query: GetDashboardStatsDocument });
const stats = computed(() => data.value?.getDashboardStats?.data ?? null);
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-sm text-muted-foreground">Overview of your platform</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <template v-if="isFetching">
        <div v-for="i in 3" :key="i" class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="h-4 w-24 animate-pulse rounded bg-muted" />
            <div class="size-9 animate-pulse rounded-lg bg-muted" />
          </div>
          <div class="mt-3">
            <div class="h-8 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </template>

      <template v-else>
        <AdminStatsCard
          title="Total Users"
          :value="String(stats?.totalUsers ?? 0)"
          icon="i-lucide-users"
          trend="+12% from last month"
          :trend-up="true"
        />
        <AdminStatsCard
          title="Active Users"
          :value="String(stats?.activeUsers ?? 0)"
          icon="i-lucide-user-check"
          trend="+3% from last month"
          :trend-up="true"
        />
        <AdminStatsCard
          title="Total Roles"
          :value="String(stats?.totalRoles ?? 0)"
          icon="i-lucide-shield-check"
        />
      </template>
    </div>

    <!-- Recent activity placeholder -->
    <div class="rounded-xl border border-border bg-card shadow-sm">
      <div class="border-b border-border px-5 py-4">
        <h2 class="text-base font-semibold">Recent Activity</h2>
        <p class="text-sm text-muted-foreground">Latest actions across the platform</p>
      </div>
      <div class="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Activity feed will appear here when connected to the API
      </div>
    </div>
  </div>
</template>
