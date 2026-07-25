<script setup lang="ts">
definePageMeta({ layout: 'admin' });
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold">Reviews</h1>
      <p class="mt-1 text-gray-500">Guest feedback and host replies</p>
    </div>

    <div class="mt-6">
      <ReviewsList />
    </div>
  </div>
</template>
