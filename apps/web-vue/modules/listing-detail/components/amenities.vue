<script setup lang="ts">
import { Wifi, ChefHat, Snowflake, WashingMachine, Waves, Baby, Check } from 'lucide-vue-next';
import type { Component } from 'vue';
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

const store = useListingDetailStore();
const { allAmenities, amenitiesModalOpen } = storeToRefs(store);

const ICONS: Record<string, Component> = {
  'Free WiFi': Wifi,
  Kitchen: ChefHat,
  'Air conditioning': Snowflake,
  'Washing Machine': WashingMachine,
  'Hot tub': Waves,
  'Suitable for children': Baby,
};
</script>

<template>
  <section class="space-y-4 border-t border-border pt-8">
    <h2 class="text-lg font-bold">Amenities</h2>

    <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <li
        v-for="amenity in allAmenities.slice(0, 6)"
        :key="amenity"
        class="flex items-center gap-3 text-sm"
      >
        <component :is="ICONS[amenity] ?? Check" class="size-4 text-muted-foreground" />
        {{ amenity }}
      </li>
    </ul>

    <Button variant="outline" size="sm" class="rounded-full" @click="store.openAmenitiesModal()">
      Show all {{ allAmenities.length }} amenities
    </Button>

    <ClientOnly>
      <Dialog
        :open="amenitiesModalOpen"
        @update:open="(v) => { if (!v) store.closeAmenitiesModal(); }"
      >
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>All amenities</DialogTitle>
          </DialogHeader>
          <ul class="space-y-3">
            <li v-for="amenity in allAmenities" :key="amenity" class="flex items-center gap-3 text-sm">
              <component :is="ICONS[amenity] ?? Check" class="size-4 text-muted-foreground" />
              {{ amenity }}
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    </ClientOnly>
  </section>
</template>
