<script setup lang="ts">
import {
  LayoutDashboard, Users, Package, Shield, Key,
  BarChart3, FileBarChart, Settings, Building2,
} from 'lucide-vue-next';
import { ROUTES } from '~/config/routes';

defineProps<{
  collapsed: boolean;
}>();

const route = useRoute();

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.admin.dashboard },
  { label: 'Users', icon: Users, to: ROUTES.admin.users },
  { label: 'Products', icon: Package, to: ROUTES.admin.products },
  { label: 'Roles & Permissions', icon: Shield, to: ROUTES.admin.permissions },
  { label: 'API Keys', icon: Key, to: ROUTES.admin.apiKeys },
  { label: 'Analytics', icon: BarChart3, to: ROUTES.admin.analytics },
  { label: 'Reports', icon: FileBarChart, to: ROUTES.admin.reports },
];

const bottomNav = [
  { label: 'Settings', icon: Settings, to: ROUTES.admin.settings },
];

function isActive(path: string) {
  return route.path === path;
}
</script>

<template>
  <aside
    class="flex h-full flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-200"
    :class="collapsed ? 'w-[60px]' : 'w-[240px]'"
  >
    <!-- Logo -->
    <div class="flex h-14 shrink-0 items-center border-b border-border/50 px-4">
      <NuxtLink to="/admin/dashboard" class="flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 class="size-4" />
        </div>
        <span v-if="!collapsed" class="text-sm font-semibold">Innoland</span>
      </NuxtLink>
    </div>

    <!-- Main nav -->
    <nav class="flex-1 space-y-0.5 overflow-auto px-2 py-3">
      <NuxtLink
        v-for="item in mainNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'"
      >
        <component :is="item.icon" class="size-4 shrink-0" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Bottom nav -->
    <div class="border-t border-border/50 px-2 py-3">
      <NuxtLink
        v-for="item in bottomNav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        :class="isActive(item.to)
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'"
      >
        <component :is="item.icon" class="size-4 shrink-0" />
        <span v-if="!collapsed">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>
