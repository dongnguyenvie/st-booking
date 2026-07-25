<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAnalyticsStore } from '~/stores/analytics/analytics-store';

const store = useAnalyticsStore();
const { metrics } = storeToRefs(store);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <AdminStatsCard
      v-for="metric in metrics"
      :key="metric.title"
      :title="metric.title"
      :value="metric.value"
      :icon="metric.icon"
      :trend="`${metric.change} vs last month`"
      :trend-up="metric.change.startsWith('+')"
    />
  </div>
</template>
