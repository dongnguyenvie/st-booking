<script setup lang="ts">
import { Loader2, Shield } from 'lucide-vue-next';

definePageMeta({ layout: 'default' });

const { loginWithAuth0 } = useAuth();
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Innoland</CardTitle>
      <CardDescription>Sign in to your account</CardDescription>
    </CardHeader>

    <CardContent>
      <ClientOnly>
        <AuthLoginForm />

        <div class="relative my-4">
          <Separator />
          <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or</span>
        </div>

        <Button variant="outline" class="w-full" @click="loginWithAuth0">
          <Shield class="mr-2 size-4" />
          Sign in with Auth0
        </Button>

        <p class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?
          <NuxtLink to="/pos/register" class="font-medium text-primary hover:underline">
            Create one
          </NuxtLink>
        </p>

        <template #fallback>
          <div class="flex justify-center py-8">
            <Loader2 class="size-6 animate-spin text-gray-400" />
          </div>
        </template>
      </ClientOnly>
    </CardContent>
  </Card>
</template>
