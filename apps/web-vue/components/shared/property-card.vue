<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import type { PublicListing } from '~/mock/listings';

defineProps<{ listing: PublicListing; horizontal?: boolean }>();
</script>

<template>
  <NuxtLink
    :to="`/listings/${listing.id}`"
    class="group block"
    :class="horizontal ? 'flex gap-5' : ''"
  >
    <!-- Photo placeholder + rating badge. Real photos land with the listing API. -->
    <div
      class="relative shrink-0 overflow-hidden rounded-2xl bg-muted"
      :class="horizontal ? 'aspect-[4/3] w-64' : 'aspect-[4/3] w-full'"
    >
      <div
        v-if="listing.rating !== null"
        class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
      >
        {{ listing.rating.toFixed(2) }}
        <Star class="size-3 fill-current" />
      </div>
    </div>

    <div :class="horizontal ? 'pt-1' : 'pt-3'">
      <h3 class="font-bold leading-snug text-primary group-hover:underline">
        {{ listing.title }}
      </h3>
      <p class="mt-1 text-sm text-muted-foreground">
        {{ listing.maxGuests }} guests · {{ listing.bedrooms }} bedrooms ·
        {{ listing.bathrooms }} bathrooms
      </p>
      <ul class="mt-2 flex flex-wrap gap-2">
        <li
          v-for="amenity in listing.amenities.slice(0, 3)"
          :key="amenity"
          class="rounded-full bg-muted px-3 py-1 text-xs text-foreground/80"
        >
          {{ amenity }}
        </li>
      </ul>
    </div>
  </NuxtLink>
</template>
