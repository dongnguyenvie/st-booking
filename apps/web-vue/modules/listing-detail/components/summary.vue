<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

const store = useListingDetailStore();
const { listing, descriptionExpanded } = storeToRefs(store);
</script>

<template>
  <section v-if="listing" class="space-y-3">
    <h1 class="text-2xl font-bold leading-snug text-primary">{{ listing.title }}</h1>

    <p class="text-sm text-muted-foreground">
      {{ listing.propertyType }} · {{ listing.maxGuests }} guests ·
      {{ listing.bedrooms }} bedrooms · {{ listing.bathrooms }} bathrooms
    </p>

    <div v-if="listing.rating !== null" class="flex items-center gap-2 text-sm">
      <Star class="size-4 fill-yellow-400 text-yellow-400" />
      <span class="font-semibold">{{ listing.rating.toFixed(2) }}</span>
      <a href="#reviews" class="underline">{{ listing.reviewCount }} reviews</a>
    </div>

    <p class="text-sm leading-relaxed" :class="descriptionExpanded ? '' : 'line-clamp-3'">
      {{ listing.description }}
    </p>

    <Button variant="outline" size="sm" class="rounded-full" @click="store.toggleDescription()">
      {{ descriptionExpanded ? 'Show less' : 'Show more' }}
    </Button>
  </section>
</template>
