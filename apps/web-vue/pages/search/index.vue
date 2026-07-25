<script setup lang="ts">
import { useSearchStore } from '~/stores/search/search-store';

definePageMeta({ layout: 'public' });
useHead({ title: 'Search — Canmore Stays' });

const store = useSearchStore();
const route = useRoute();

// The URL is the source of truth: a shared /search link reproduces the search.
watch(
  () => route.query,
  (query) => {
    store.hydrateFromQuery(query as Record<string, string>);
    store.runSearch();
  },
  { immediate: true },
);
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6 px-4 py-6">
    <SearchResultsToolbar />
    <SearchResultsSplit />
    <ClientOnly>
      <SearchFilterModal />
    </ClientOnly>
  </div>
</template>
