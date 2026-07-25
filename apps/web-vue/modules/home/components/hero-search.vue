<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useHomeStore } from '~/stores/home/home-store';
import { QUICK_FILTER_AMENITIES } from '~/mock/listings';
import { ROUTES } from '~/config/routes';

const store = useHomeStore();
const { criteria, quickFilters } = storeToRefs(store);
const router = useRouter();

function submit() {
  router.push({ path: ROUTES.public.search, query: store.searchQuery });
}
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Hero photo placeholder — the real image lands with the media pipeline. -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-foreground" />

    <div class="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
      <h1 class="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        Book your next stay with<br >Canmore Stays
      </h1>
      <p class="mt-4 text-sm font-medium text-white/90">
        Lower Price Guarantee | Canadian Owned &amp; Operated
      </p>

      <div class="mt-8">
        <SharedSearchBar v-model="criteria" @submit="submit" />
      </div>

      <ul class="mt-5 flex flex-wrap justify-center gap-3">
        <li v-for="amenity in QUICK_FILTER_AMENITIES" :key="amenity">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors"
            :class="quickFilters.includes(amenity) ? 'ring-2 ring-primary' : ''"
            @click="store.toggleQuickFilter(amenity)"
          >
            <span
              class="size-3.5 rounded-full border-2"
              :class="quickFilters.includes(amenity) ? 'border-primary bg-primary' : 'border-muted-foreground/40'"
            />
            {{ amenity }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>
