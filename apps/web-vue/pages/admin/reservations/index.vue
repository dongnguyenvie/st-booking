<script setup lang="ts">
definePageMeta({ layout: 'admin' });
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold">Reservations</h1>
      <p class="mt-1 text-gray-500">Bookings across every listing</p>
    </div>

    <div class="mt-6 space-y-4">
      <ReservationsStatusFilter />
      <ReservationsTable />
    </div>
  </div>
</template>
