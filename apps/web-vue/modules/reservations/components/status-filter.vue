<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useReservationsStore, type ReservationStatus } from '~/stores/reservations/reservations-store';

const store = useReservationsStore();
const { statusFilter } = storeToRefs(store);

const OPTIONS: Array<{ value: ReservationStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];
</script>

<template>
  <div class="flex gap-1">
    <Button
      v-for="option in OPTIONS"
      :key="option.value"
      :variant="statusFilter === option.value ? 'default' : 'ghost'"
      size="sm"
      @click="store.setStatusFilter(option.value)"
    >
      {{ option.label }}
    </Button>
  </div>
</template>
