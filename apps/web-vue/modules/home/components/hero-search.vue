<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useHomeStore } from '~/stores/home/home-store';
import { ROUTES } from '~/config/routes';

const store = useHomeStore();
const { search } = storeToRefs(store);
const router = useRouter();

function submit() {
  router.push({ path: ROUTES.public.search, query: store.searchQuery() });
}
</script>

<template>
  <section class="border-b border-border bg-muted/30">
    <div class="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
        Your mountain stay in Canmore
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        Hand-picked cabins, chalets and lofts in the heart of the Canadian Rockies.
      </p>

      <form
        class="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row"
        @submit.prevent="submit"
      >
        <Input v-model="search.location" placeholder="Where to?" class="sm:flex-1" />
        <Input v-model="search.checkIn" type="date" aria-label="Check in" class="sm:w-40" />
        <Input v-model="search.checkOut" type="date" aria-label="Check out" class="sm:w-40" />
        <Input
          v-model.number="search.guests"
          type="number"
          min="1"
          aria-label="Guests"
          class="sm:w-24"
        />
        <Button type="submit">
          <Search class="mr-2 size-4" />
          Search
        </Button>
      </form>
    </div>
  </section>
</template>
