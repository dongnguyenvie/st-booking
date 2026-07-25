<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useListingDetailStore } from '~/stores/listing-detail/listing-detail-store';

const { listing } = storeToRefs(useListingDetailStore());
</script>

<template>
  <section v-if="listing" class="space-y-6 border-t border-border pt-8">
    <h2 class="text-lg font-bold">Good to know</h2>

    <div>
      <h3 class="mb-3 text-sm font-bold">House Rules</h3>
      <dl class="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <div class="flex gap-2">
          <dt class="text-muted-foreground">Check-in:</dt>
          <dd>{{ listing.houseRules.checkIn }}</dd>
        </div>
        <div class="flex gap-2">
          <dt class="text-muted-foreground">Pets:</dt>
          <dd>{{ listing.houseRules.pets }}</dd>
        </div>
        <div class="flex gap-2">
          <dt class="text-muted-foreground">Check-out:</dt>
          <dd>{{ listing.houseRules.checkOut }}</dd>
        </div>
        <div class="flex gap-2">
          <dt class="text-muted-foreground">Smoking inside:</dt>
          <dd>{{ listing.houseRules.smoking }}</dd>
        </div>
      </dl>
    </div>

    <div>
      <h3 class="mb-3 text-sm font-bold">Cancellation policy</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="rule in listing.cancellationPolicy" :key="rule">{{ rule }}</li>
      </ul>
    </div>
  </section>
</template>
