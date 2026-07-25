<script setup lang="ts">
import { Star, Images } from 'lucide-vue-next';
import type { PublicListing } from '~/mock/listings';

defineProps<{ listing: PublicListing }>();
</script>

<template>
  <!-- 1 large + 4 thumbnails, matching the reference gallery grid. -->
  <section class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
    <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:col-span-2 lg:row-span-2 lg:aspect-auto">
      <div
        v-if="listing.rating !== null"
        class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
      >
        {{ listing.rating.toFixed(2) }}
        <Star class="size-3 fill-current" />
      </div>
    </div>

    <div v-for="n in 4" :key="n" class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
      <Button
        v-if="n === 4"
        variant="secondary"
        size="sm"
        class="absolute bottom-3 right-3 rounded-full shadow-sm"
      >
        <Images class="mr-2 size-3.5" />
        + {{ listing.photoCount }} photos
      </Button>
    </div>
  </section>
</template>
