<script setup lang="ts">
import { Loader2, SearchX } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useSearchStore } from '~/stores/search/search-store';

const store = useSearchStore();
const { loading, results, mapVisible } = storeToRefs(store);
</script>

<template>
  <div class="grid gap-6" :class="mapVisible ? 'lg:grid-cols-2' : 'grid-cols-1'">
    <div>
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="size-6 animate-spin text-muted-foreground" />
      </div>

      <div
        v-else-if="results.length === 0"
        class="flex flex-col items-center py-16 text-muted-foreground"
      >
        <SearchX class="mb-2 size-8" />
        No properties match this search.
      </div>

      <div
        v-else
        class="space-y-8"
        :class="mapVisible ? '' : 'grid grid-cols-1 gap-x-6 gap-y-9 space-y-0 sm:grid-cols-2 lg:grid-cols-3'"
      >
        <SharedPropertyCard
          v-for="listing in results"
          :key="listing.id"
          :listing="listing"
          :horizontal="mapVisible"
        />
      </div>
    </div>

    <!-- Map placeholder — Leaflet cluster markers land with the location API. -->
    <div
      v-if="mapVisible"
      class="sticky top-20 hidden h-[calc(100vh-6rem)] items-center justify-center rounded-2xl border border-border bg-muted text-sm text-muted-foreground lg:flex"
    >
      Map view
    </div>
  </div>
</template>
