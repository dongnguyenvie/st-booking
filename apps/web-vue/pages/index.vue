<script setup lang="ts">
import { ROUTES } from '~/config/routes';

// Root redirect to login (middleware handles auth → dashboard)
definePageMeta({ layout: false });
navigateTo(ROUTES.auth.login);
</script>

<template>
  <div />
</template>
