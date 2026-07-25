<script setup lang="ts">
import { Menu, Mountain } from 'lucide-vue-next';
import { PUBLIC_NAV } from '~/config/routes';

const mobileOpen = ref(false);
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Mountain class="size-4" />
        </div>
        <span class="text-sm font-bold uppercase tracking-wide">Canmore Stays</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="item in PUBLIC_NAV"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <Button variant="ghost" size="icon" class="md:hidden" @click="mobileOpen = !mobileOpen">
        <Menu class="size-5" />
      </Button>
    </div>

    <nav v-if="mobileOpen" class="border-t border-border px-4 py-2 md:hidden">
      <NuxtLink
        v-for="item in PUBLIC_NAV"
        :key="item.to"
        :to="item.to"
        class="block py-2 text-sm font-medium text-foreground/70 hover:text-primary"
        @click="mobileOpen = false"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
