<script setup lang="ts">
import { PUBLIC_FOOTER_LINKS } from '~/config/routes';
</script>

<template>
  <footer class="border-t border-border bg-muted/30">
    <div class="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <nav class="flex flex-wrap gap-x-6 gap-y-2">
        <NuxtLink
          v-for="item in PUBLIC_FOOTER_LINKS"
          :key="item.to"
          :to="item.to"
          class="text-sm text-foreground/70 transition-colors hover:text-primary"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="space-y-1 text-sm text-muted-foreground">
        <p class="font-medium text-foreground">Canmore Stays by S&amp;T Properties</p>
        <p>
          <a href="tel:+14036689366" class="hover:text-primary">+1 (403) 668-9366</a>
        </p>
        <p>
          <a href="mailto:hello@stproperties.org" class="hover:text-primary">
            hello@stproperties.org
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>
