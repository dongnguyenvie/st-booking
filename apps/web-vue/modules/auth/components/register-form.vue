<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { useMutation } from 'villus';
import { ROUTES } from '~/config/routes';
import { RegisterUserDocument } from '~/api-service/generated/graphql';

const { setSession } = useAuth();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const { execute } = useMutation(RegisterUserDocument);

function validate(): string | null {
  if (!name.value.trim()) return 'Name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Invalid email format';
  if (password.value.length < 6) return 'Password must be at least 6 characters';
  if (password.value !== confirmPassword.value) return 'Passwords do not match';
  return null;
}

async function handleSubmit() {
  const validationError = validate();
  if (validationError) {
    error.value = validationError;
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const { data, error: gqlError } = await execute({
      input: { name: name.value, email: email.value, password: password.value },
    });

    if (gqlError || !data?.registerUser?.data) {
      error.value = 'Registration failed. Please try again.';
      return;
    }

    const { accessToken, user } = data.registerUser.data;
    setSession(accessToken, user);
    await router.push(ROUTES.admin.dashboard);
  } catch {
    error.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-1.5">
      <Label for="reg-name">Name</Label>
      <Input id="reg-name" v-model="name" type="text" placeholder="Your name" required />
    </div>

    <div class="space-y-1.5">
      <Label for="reg-email">Email</Label>
      <Input id="reg-email" v-model="email" type="email" placeholder="you@example.com" required />
    </div>

    <div class="space-y-1.5">
      <Label for="reg-password">Password</Label>
      <Input id="reg-password" v-model="password" type="password" placeholder="Min. 6 characters" required />
    </div>

    <div class="space-y-1.5">
      <Label for="reg-confirm">Confirm Password</Label>
      <Input id="reg-confirm" v-model="confirmPassword" type="password" placeholder="Repeat password" required />
    </div>

    <Alert v-if="error" variant="destructive">
      <AlertCircle class="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <Button type="submit" class="w-full" :disabled="loading">
      <span v-if="loading" class="flex items-center gap-2">
        <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Creating account...
      </span>
      <span v-else>Create Account</span>
    </Button>
  </form>
</template>
