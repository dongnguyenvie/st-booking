<script setup lang="ts">
definePageMeta({ layout: 'public' });
useHead({ title: 'All listings — Canmore Stays' });
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6 px-4 py-8">
    <h1 class="text-xl font-bold">Properties</h1>
    <AllListingsCatalogueToolbar />
    <AllListingsCatalogueGrid />
  </div>
</template>
