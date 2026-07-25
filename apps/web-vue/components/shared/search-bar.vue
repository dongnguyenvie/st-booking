<script setup lang="ts">
import { MapPin, Calendar, Users, Search, SlidersHorizontal } from 'lucide-vue-next';
import type { SearchCriteria } from '~/mock/search-criteria';

const model = defineModel<SearchCriteria>({ required: true });

withDefaults(defineProps<{ submitLabel?: 'search' | 'filter' }>(), {
  submitLabel: 'search',
});

const emit = defineEmits<{ submit: [] }>();
</script>

<template>
  <form
    class="flex flex-col gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm lg:flex-row lg:items-center"
    @submit.prevent="emit('submit')"
  >
    <label class="flex flex-1 items-center gap-3 rounded-2xl px-3 py-2">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <MapPin class="size-4 text-primary" />
      </span>
      <span class="flex-1">
        <span class="block text-xs font-semibold">Location</span>
        <input
          v-model="model.location"
          class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Anywhere in Canmore"
        >
      </span>
    </label>

    <label class="flex flex-1 items-center gap-3 rounded-2xl px-3 py-2">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <Calendar class="size-4 text-primary" />
      </span>
      <span class="flex-1">
        <span class="block text-xs font-semibold">Check-In</span>
        <input
          v-model="model.checkIn"
          type="date"
          class="w-full bg-transparent text-sm outline-none"
        >
      </span>
    </label>

    <label class="flex flex-1 items-center gap-3 rounded-2xl px-3 py-2">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <Calendar class="size-4 text-primary" />
      </span>
      <span class="flex-1">
        <span class="block text-xs font-semibold">Check-Out</span>
        <input
          v-model="model.checkOut"
          type="date"
          class="w-full bg-transparent text-sm outline-none"
        >
      </span>
    </label>

    <label class="flex items-center gap-3 rounded-2xl px-3 py-2 lg:w-40">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
        <Users class="size-4 text-primary" />
      </span>
      <span class="flex-1">
        <span class="block text-xs font-semibold">Guests</span>
        <input
          v-model.number="model.guests"
          type="number"
          min="1"
          class="w-full bg-transparent text-sm outline-none"
        >
      </span>
    </label>

    <Button type="submit" size="lg" class="rounded-full lg:w-40" :variant="submitLabel === 'filter' ? 'outline' : 'default'">
      <component :is="submitLabel === 'filter' ? SlidersHorizontal : Search" class="mr-2 size-4" />
      {{ submitLabel === 'filter' ? 'Filter' : 'Search' }}
    </Button>
  </form>
</template>
