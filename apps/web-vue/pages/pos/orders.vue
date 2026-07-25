<script setup lang="ts">
definePageMeta({ layout: 'pos' });
</script>

<template>
  <div class="flex h-full">
    <!-- Product grid (left) -->
    <div class="flex-1 overflow-auto p-4">
      <CashierProductGrid />
    </div>

    <!-- Cart summary (right) -->
    <div class="w-80 border-l border-gray-200 dark:border-gray-800">
      <CashierCartSummary />
    </div>
  </div>
</template>
