<script setup lang="ts">
import { useAnalyticsStore } from '~/stores/analytics/analytics-store';

definePageMeta({ layout: 'admin' });

const store = useAnalyticsStore();
onMounted(() => store.fetchOverview());
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Analytics</h1>
    <p class="mt-1 text-gray-500">Traffic and engagement overview</p>

    <div class="mt-6">
      <AnalyticsMetricGrid />
    </div>

    <div class="mt-8">
      <h2 class="mb-4 text-lg font-semibold">Top Pages</h2>
      <AnalyticsTopPages />
    </div>
  </div>
</template>
