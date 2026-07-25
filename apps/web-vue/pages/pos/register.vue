<script setup lang="ts">
import { Loader2, Shield } from 'lucide-vue-next';
import { ROUTES } from '~/config/routes';

definePageMeta({ layout: 'default' });

async function signUpWithAuth0() {
  if (!import.meta.client) return;
  try {
    const { useAuth0 } = await import('@auth0/auth0-vue');
    const auth0 = useAuth0();
    await auth0.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  } catch {
    console.warn('[Auth] Auth0 not available');
  }
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Create Account</h1>
      <p class="mt-1 text-sm text-gray-500">Register to access Innoland POS</p>
    </div>

    <ClientOnly>
      <AuthRegisterForm />

      <div class="relative my-4">
        <Separator />
        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">or</span>
      </div>

      <Button variant="outline" class="w-full" @click="signUpWithAuth0">
        <Shield class="mr-2 size-4" />
        Sign up with Auth0
      </Button>

      <p class="text-center text-sm text-gray-500">
        Already have an account?
        <NuxtLink :to="ROUTES.auth.login" class="text-primary hover:underline">Sign in</NuxtLink>
      </p>

      <template #fallback>
        <div class="flex justify-center py-8">
          <Loader2 class="size-6 animate-spin text-gray-400" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
