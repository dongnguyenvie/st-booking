<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next';
import type { Component } from 'vue';

// Dynamic icon resolution via lucide — accepts i-lucide-foo-bar string prop
// and resolves to the matching lucide-vue-next component at runtime.
import * as LucideIcons from 'lucide-vue-next';

defineProps<{
  title: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}>();

function resolveIcon(name: string): Component | null {
  // Convert i-lucide-foo-bar → FooBar
  const key = name
    .replace(/^i-lucide-/, '')
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  // Cast via unknown to avoid structural mismatch on the lucide module namespace
  return (LucideIcons as unknown as Record<string, Component>)[key] ?? null;
}
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
      <div class="flex size-9 items-center justify-center rounded-lg bg-primary/10">
        <component :is="resolveIcon(icon)" class="size-4 text-primary" />
      </div>
    </div>
    <div class="mt-3">
      <p class="text-3xl font-bold tracking-tight">{{ value }}</p>
      <p v-if="trend" class="mt-1 flex items-center gap-1 text-xs font-medium" :class="trendUp ? 'text-green-600' : 'text-red-500'">
        <TrendingUp v-if="trendUp" class="size-3" />
        <TrendingDown v-else class="size-3" />
        {{ trend }}
      </p>
    </div>
  </div>
</template>
