<script setup lang="ts">
import { AlertCircle, ShieldOff } from 'lucide-vue-next';
import { useMutation } from 'villus';
import { TwoFactorDisableDocument, TwoFactorMethod } from '~/api-service/generated/graphql';

const props = defineProps<{
  method: TwoFactorMethod;
}>();
const emit = defineEmits<{ (e: 'done'): void }>();

const password = ref('');
const code = ref('');
const loading = ref(false);
const error = ref('');

const { execute } = useMutation(TwoFactorDisableDocument);

async function handleSubmit() {
  if (!password.value) return;
  loading.value = true;
  error.value = '';
  const { data, error: gqlError } = await execute({
    input: {
      password: password.value,
      // TOTP requires code verification in addition to password
      code: props.method === TwoFactorMethod.TOTP ? code.value : null,
    },
  });
  loading.value = false;
  if (gqlError || !data?.twoFactorDisable?.success) {
    error.value = gqlError?.message ?? 'Failed to disable 2FA';
    return;
  }
  password.value = '';
  code.value = '';
  emit('done');
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-1.5">
      <Label for="disable-password">Current password</Label>
      <Input
        id="disable-password"
        v-model="password"
        type="password"
        placeholder="Enter your password"
        required
      />
    </div>

    <div v-if="props.method === TwoFactorMethod.TOTP" class="space-y-1.5">
      <Label for="disable-code">Authenticator code</Label>
      <Input
        id="disable-code"
        v-model="code"
        maxlength="6"
        placeholder="000000"
        inputmode="numeric"
        class="text-center font-mono text-xl tracking-widest"
        required
      />
    </div>

    <Alert v-if="error" variant="destructive">
      <AlertCircle class="size-4" />
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <Button
      type="submit"
      variant="destructive"
      :disabled="loading || !password || (props.method === TwoFactorMethod.TOTP && code.length !== 6)"
    >
      <ShieldOff class="mr-2 size-4" />
      <span v-if="loading">Disabling...</span>
      <span v-else>Disable 2FA</span>
    </Button>
  </form>
</template>
