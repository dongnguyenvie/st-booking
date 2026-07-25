<script setup lang="ts">
import { Calendar, Users } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

const store = useListingDetailStore();
const { checkIn, checkOut, guests, quote } = storeToRefs(store);

function money(value: number) {
  return `$${value.toLocaleString()}`;
}
</script>

<template>
  <aside class="rounded-2xl border border-border bg-card p-5 shadow-sm">
    <p class="text-center text-xs text-muted-foreground">
      Select dates and number of guests to see the total price per night
    </p>

    <div class="mt-4 grid grid-cols-2 gap-3">
      <label class="flex items-center gap-2 rounded-full border border-border px-3 py-2">
        <Calendar class="size-4 shrink-0 text-muted-foreground" />
        <input v-model="checkIn" type="date" aria-label="Check in" class="w-full bg-transparent text-xs outline-none">
      </label>
      <label class="flex items-center gap-2 rounded-full border border-border px-3 py-2">
        <Calendar class="size-4 shrink-0 text-muted-foreground" />
        <input v-model="checkOut" type="date" aria-label="Check out" class="w-full bg-transparent text-xs outline-none">
      </label>
    </div>

    <label class="mt-3 flex items-center gap-2 rounded-full border border-border px-3 py-2">
      <Users class="size-4 shrink-0 text-muted-foreground" />
      <input v-model.number="guests" type="number" min="1" aria-label="Guests" class="w-full bg-transparent text-sm outline-none">
    </label>

    <!-- Placeholder pricing. The API re-prices server-side before booking. -->
    <dl v-if="quote" class="mt-4 space-y-1 border-t border-border pt-4 text-sm">
      <div class="flex justify-between">
        <dt class="text-muted-foreground">{{ quote.nights }} nights</dt>
        <dd>{{ money(quote.subtotal) }}</dd>
      </div>
      <div class="flex justify-between">
        <dt class="text-muted-foreground">Cleaning fee</dt>
        <dd>{{ money(quote.cleaningFee) }}</dd>
      </div>
      <div class="flex justify-between pt-1 font-bold">
        <dt>Total</dt>
        <dd>{{ money(quote.total) }} CAD</dd>
      </div>
    </dl>

    <div class="mt-5 grid grid-cols-2 gap-3">
      <Button variant="outline" class="rounded-full">Send Inquiry</Button>
      <Button class="rounded-full" :disabled="!quote">Book now</Button>
    </div>
  </aside>
</template>
