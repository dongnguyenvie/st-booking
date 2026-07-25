<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

const { listing } = storeToRefs(useListingDetailStore());
</script>

<template>
  <section v-if="listing" id="reviews" class="space-y-5 border-t border-border pt-8">
    <h2 class="flex items-center gap-2 text-lg font-bold">
      Reviews
      <span v-if="listing.rating !== null" class="flex items-center gap-1 text-base font-semibold">
        <Star class="size-4 fill-yellow-400 text-yellow-400" />
        {{ listing.rating.toFixed(2) }} ({{ listing.reviewCount }})
      </span>
    </h2>

    <article v-for="review in listing.reviews" :key="review.id" class="space-y-1">
      <div class="flex items-center gap-2 text-sm">
        <span class="flex">
          <Star
            v-for="n in 5"
            :key="n"
            class="size-3.5"
            :class="n <= review.rating ? 'fill-foreground text-foreground' : 'text-muted-foreground/40'"
          />
        </span>
        <span class="font-semibold">{{ review.author }}</span>
        <span class="text-muted-foreground">· {{ review.postedOn }}</span>
      </div>
      <p class="text-sm leading-relaxed text-foreground/90">{{ review.body }}</p>
    </article>
  </section>
</template>
