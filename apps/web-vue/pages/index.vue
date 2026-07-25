<script setup lang="ts">
// The public guest surface — reachable without a session.
definePageMeta({ layout: 'public' });
</script>

<template>
  <div>
    <HomeHeroSearch />
    <HomeTopProperties />
  </div>
</template>
