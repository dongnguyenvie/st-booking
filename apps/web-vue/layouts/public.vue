<template>
  <div class="flex min-h-screen flex-col bg-background">
    <LayoutPublicHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutPublicFooter />
  </div>
</template>
