<script setup lang="ts">
// The public guest surface — reachable without a session.
definePageMeta({ layout: 'public' });
useHead({ title: 'Canmore Stays — book your next mountain stay' });
</script>

<template>
  <div>
    <HomeHeroSearch />
    <HomeTopProperties />
    <HomeFindYourProperty />
  </div>
</template>
