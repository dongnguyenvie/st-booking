<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { useMutation } from 'villus';
import { getHomeRouteByPrivileges } from '~/config/get-home-route-by-privileges';
import { SignInDocument } from '~/api-service/generated/graphql';
import { useAuthStore } from '~/stores/auth-store';
import { ROUTES } from '~/config/routes';

const { setSession } = useAuth();
const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const { execute } = useMutation(SignInDocument);

async function handleSubmit() {
  loading.value = true;
  error.value = '';

  try {
    const { data, error: gqlError } = await execute({
      input: { email: email.value, password: password.value },
    });

    if (gqlError || !data?.signIn?.data) {
      error.value = gqlError?.message || 'Invalid email or password';
      return;
    }

    const { accessToken, user, twoFactorRequired, preAuthToken, twoFactorMethod } = data.signIn.data;

    // 2FA branch: stash pre-auth challenge, route to verify step
    if (twoFactorRequired && preAuthToken && twoFactorMethod) {
      authStore.setTwoFactorChallenge({
        preAuthToken,
        method: twoFactorMethod,
        email: email.value,
      });
      await router.push(ROUTES.auth.verify);
      return;
    }

    if (!accessToken || !user) {
      error.value = 'Invalid sign-in response';
      return;
    }

    setSession(accessToken, {
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      privileges: user.privileges ?? [],
    });

    const homePath = getHomeRouteByPrivileges(user.privileges ?? []);
    await router.push(homePath);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-1.5">
      <Label for="login-email">Email</Label>
      <Input id="login-email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>

    <div class="space-y-1.5">
      <Label for="login-password">Password</Label>
      <Input id="login-password" v-model="password" type="password" placeholder="Enter password" required />
    </div>

    <Alert v-if="error" variant="destructive">
      <AlertCircle class="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <Button type="submit" class="w-full" :disabled="loading">
      <span v-if="loading" class="flex items-center gap-2">
        <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Signing in...
      </span>
      <span v-else>Sign In</span>
    </Button>
  </form>
</template>
