<script setup lang="ts">
import { Map } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useAllListingsStore } from '~/stores/all-listings/all-listings-store';

const store = useAllListingsStore();
const { tab, tabs, mapVisible } = storeToRefs(store);
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex gap-2">
      <button
        v-for="item in tabs"
        :key="item.key"
        type="button"
        class="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
        :class="tab === item.key
          ? 'bg-primary text-primary-foreground'
          : 'border border-border text-foreground/70 hover:border-primary hover:text-primary'"
        @click="store.setTab(item.key)"
      >
        {{ item.label }}
      </button>
    </div>

    <Button class="rounded-full" @click="store.toggleMap()">
      <Map class="mr-2 size-4" />
      {{ mapVisible ? 'Hide map' : 'View on map' }}
    </Button>
  </div>
</template>
