<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useListingsStore, type ListingStatus } from '~/stores/listings/listings-store';

const store = useListingsStore();
const { statusFilter } = storeToRefs(store);

const OPTIONS: Array<{ value: ListingStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'unlisted', label: 'Unlisted' },
];
</script>

<template>
  <div class="flex gap-1">
    <Button
      v-for="option in OPTIONS"
      :key="option.value"
      :variant="statusFilter === option.value ? 'default' : 'ghost'"
      size="sm"
      @click="store.setStatusFilter(option.value)"
    >
      {{ option.label }}
    </Button>
  </div>
</template>
