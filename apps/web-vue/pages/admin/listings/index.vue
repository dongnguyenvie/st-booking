<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

definePageMeta({ layout: 'admin' });
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Listings</h1>
        <p class="mt-1 text-gray-500">Properties available to book</p>
      </div>
      <Button>
        <Plus class="mr-2 size-4" />
        New Listing
      </Button>
    </div>

    <div class="mt-6 space-y-4">
      <ListingsStatusFilter />
      <ListingsTable />
    </div>
  </div>
</template>
