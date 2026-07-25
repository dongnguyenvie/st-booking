<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

const store = useListingDetailStore();
const { checkIn, checkOut } = storeToRefs(store);
</script>

<template>
  <section class="space-y-4 border-t border-border pt-8">
    <h2 class="text-lg font-bold">Available days</h2>

    <!--
      Date inputs stand in for the 2-month availability calendar. The real
      calendar needs the AvailabilityDay API to grey out booked nights.
    -->
    <div class="flex flex-wrap items-end gap-4">
      <label class="text-sm">
        <span class="mb-1 block font-medium">Check-in</span>
        <Input v-model="checkIn" type="date" class="w-44" />
      </label>
      <label class="text-sm">
        <span class="mb-1 block font-medium">Check-out</span>
        <Input v-model="checkOut" type="date" class="w-44" />
      </label>
      <Button variant="outline" size="sm" class="rounded-full" @click="store.clearDates()">
        Clear dates
      </Button>
    </div>

    <p class="text-sm text-muted-foreground">Select check-in and check-out dates</p>
  </section>
</template>
