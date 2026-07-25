<script setup lang="ts">
import { Loader2, Users, BedDouble, Bath } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useListingsStore } from '~/stores/listings/listings-store';
import { useHomeStore } from '~/stores/home/home-store';
import { ROUTES } from '~/config/routes';

const listings = useListingsStore();
const home = useHomeStore();
const { loading } = storeToRefs(listings);

// The public surface only ever shows published inventory.
const published = computed(() => listings.items.filter((l) => l.status === 'published'));

onMounted(async () => {
  await listings.fetchAll();
  home.setTotalProperties(published.value.length);
});
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-14">
    <h2 class="text-2xl font-bold tracking-tight">Our top properties</h2>

    <div v-if="loading" class="flex justify-center py-10">
      <Loader2 class="size-6 animate-spin text-muted-foreground" />
    </div>

    <div v-else class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Card v-for="listing in published" :key="listing.id" class="overflow-hidden">
        <div class="aspect-[4/3] bg-muted" />
        <CardContent class="space-y-2 py-4">
          <p class="font-semibold">{{ listing.title }}</p>
          <p class="text-sm text-muted-foreground">{{ listing.location }}</p>
          <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span class="flex items-center gap-1">
              <Users class="size-3.5" />{{ listing.maxGuests }} guests
            </span>
            <span class="flex items-center gap-1">
              <BedDouble class="size-3.5" />{{ listing.bedrooms }} bedrooms
            </span>
            <span class="flex items-center gap-1">
              <Bath class="size-3.5" />{{ listing.bathrooms }} bathrooms
            </span>
          </div>
          <p class="pt-1 text-sm">
            <span class="text-lg font-bold">${{ listing.nightlyRate }}</span>
            <span class="text-muted-foreground"> CAD / night</span>
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="mt-8 text-center">
      <Button as-child variant="outline">
        <NuxtLink :to="ROUTES.public.allListings">
          Explore all properties ({{ home.totalProperties }})
        </NuxtLink>
      </Button>
    </div>
  </section>
</template>
