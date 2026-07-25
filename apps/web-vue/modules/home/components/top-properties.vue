<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useHomeStore } from '~/stores/home/home-store';
import { ROUTES } from '~/config/routes';

const store = useHomeStore();
const { loading, topProperties, totalProperties } = storeToRefs(store);

onMounted(() => store.fetchTopProperties());
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-14">
    <h2 class="text-center text-2xl font-bold tracking-tight">Our top properties</h2>

    <div v-if="loading" class="flex justify-center py-12">
      <Loader2 class="size-6 animate-spin text-muted-foreground" />
    </div>

    <div v-else class="mt-8 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      <SharedPropertyCard v-for="listing in topProperties" :key="listing.id" :listing="listing" />
    </div>

    <div class="mt-10 text-center">
      <Button as-child variant="outline" class="rounded-full">
        <NuxtLink :to="ROUTES.public.allListings">
          Explore all properties ({{ totalProperties }})
        </NuxtLink>
      </Button>
    </div>
  </section>
</template>
