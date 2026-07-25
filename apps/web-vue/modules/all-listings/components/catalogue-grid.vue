<script setup lang="ts">
import { Loader2, Home } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useAllListingsStore } from '~/stores/all-listings/all-listings-store';

const store = useAllListingsStore();
const { loading, visible, mapVisible } = storeToRefs(store);

onMounted(() => store.fetchAll());
</script>

<template>
  <div>
    <!-- Map placeholder — Leaflet + OpenStreetMap lands with the location API. -->
    <div
      v-if="mapVisible"
      class="mb-6 flex h-80 items-center justify-center rounded-2xl border border-border bg-muted text-sm text-muted-foreground"
    >
      Map view
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <Loader2 class="size-6 animate-spin text-muted-foreground" />
    </div>

    <div
      v-else-if="visible.length === 0"
      class="flex flex-col items-center py-16 text-muted-foreground"
    >
      <Home class="mb-2 size-8" />
      No properties in this category.
    </div>

    <div v-else class="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      <SharedPropertyCard v-for="listing in visible" :key="listing.id" :listing="listing" />
    </div>
  </div>
</template>
