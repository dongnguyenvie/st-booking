<script setup lang="ts">
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center gap-3">
      <SharedAppLogo />
      <Separator orientation="vertical" class="h-6" />
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">POS Terminal</span>
    </div>

    <LayoutProfileDropdownMenu />
  </header>
</template>
