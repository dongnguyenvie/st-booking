<script setup lang="ts">
import { Map } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useSearchStore } from '~/stores/search/search-store';

const store = useSearchStore();
const { criteria, resultCount, mapVisible } = storeToRefs(store);
</script>

<template>
  <div class="space-y-6">
    <SharedSearchBar v-model="criteria" submit-label="filter" @submit="store.openFilterModal()" />

    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold">{{ resultCount }} properties found</h1>
      <Button class="rounded-full" @click="store.toggleMap()">
        <Map class="mr-2 size-4" />
        {{ mapVisible ? 'Hide map' : 'Show map' }}
      </Button>
    </div>
  </div>
</template>
