<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

definePageMeta({ layout: 'public' });

const route = useRoute();
const store = useListingDetailStore();
const { listing, loading, notFound } = storeToRefs(store);

await store.fetchById(route.params.id as string);

useHead({ title: () => `${listing.value?.title ?? 'Listing'} — Canmore Stays` });
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="size-6 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="notFound" class="py-20 text-center">
      <h1 class="text-xl font-bold">Listing not found</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        This property is no longer listed. Browse the rest of our stays instead.
      </p>
      <Button as-child variant="outline" class="mt-6 rounded-full">
        <NuxtLink to="/all-listings">All listings</NuxtLink>
      </Button>
    </div>

    <template v-else-if="listing">
      <ListingDetailPhotoGallery :listing="listing" />

      <div class="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div class="space-y-8">
          <ListingDetailSummary />
          <ListingDetailAmenities />
          <ListingDetailAvailability />
          <ListingDetailReviews />
          <ListingDetailGoodToKnow />
        </div>

        <div class="lg:sticky lg:top-24 lg:self-start">
          <ListingDetailBookingWidget />
        </div>
      </div>
    </template>
  </div>
</template>
