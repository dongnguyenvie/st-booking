<script setup lang="ts">
import { PanelLeft, ChevronRight, Bell } from 'lucide-vue-next';

const emit = defineEmits<{
  toggleSidebar: [];
}>();

const route = useRoute();

/** Derive page title from route path */
const pageTitle = computed(() => {
  const segment = route.path.split('/').pop() || 'dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
});
</script>

<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="size-8" @click="emit('toggleSidebar')">
        <PanelLeft class="size-4" />
      </Button>
      <div class="hidden items-center gap-2 text-sm sm:flex">
        <span class="text-muted-foreground">Admin</span>
        <ChevronRight class="size-3 text-muted-foreground" />
        <span class="font-medium">{{ pageTitle }}</span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="size-8">
        <Bell class="size-4" />
      </Button>

      <LayoutProfileDropdownMenu />
    </div>
  </header>
</template>
