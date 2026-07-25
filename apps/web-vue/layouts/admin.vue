<script setup lang="ts">
import { useAppStore } from '~/stores/app-store';

const appStore = useAppStore();
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar -->
    <LayoutAdminSidebar :collapsed="appStore.sidebarCollapsed" />

    <!-- Main content area -->
    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutAdminHeader @toggle-sidebar="appStore.toggleSidebar()" />
      <main class="flex-1 overflow-auto bg-muted/30 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
