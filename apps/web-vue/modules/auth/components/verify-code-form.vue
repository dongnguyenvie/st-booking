<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { TwoFactorMethod } from '~/api-service/generated/graphql';

interface Props {
  method: TwoFactorMethod;
  email: string;
  loading: boolean;
  error: string;
  isLockedOut: boolean;
  isResending: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'submit', code: string): void;
  (e: 'resend'): void;
}>();

const code = ref('');

function onSubmit() {
  if (code.value.length !== 6) return;
  emit('submit', code.value);
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div class="space-y-1.5">
      <Label for="verify-code">
        {{ props.method === TwoFactorMethod.TOTP ? 'Authenticator code' : 'Email verification code' }}
      </Label>
      <Input
        id="verify-code"
        v-model="code"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="6"
        placeholder="000000"
        :disabled="props.loading || props.isLockedOut"
        class="text-center text-2xl tracking-widest font-mono"
        required
      />
      <p v-if="props.method === TwoFactorMethod.EMAIL" class="text-xs text-muted-foreground">
        Code sent to {{ props.email }}. Check your inbox (or server logs in dev).
      </p>
      <p v-else class="text-xs text-muted-foreground">
        Open your authenticator app and enter the 6-digit code.
      </p>
    </div>

    <Alert v-if="props.isLockedOut" variant="destructive">
      <AlertCircle class="size-4" />
      <AlertTitle>Locked out</AlertTitle>
      <AlertDescription>
        Too many failed attempts. Try again in 10 minutes.
      </AlertDescription>
    </Alert>

    <Alert v-else-if="props.error" variant="destructive">
      <AlertCircle class="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ props.error }}</AlertDescription>
    </Alert>

    <Button type="submit" class="w-full" :disabled="props.loading || props.isLockedOut || code.length !== 6">
      <span v-if="props.loading" class="flex items-center gap-2">
        <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Verifying...
      </span>
      <span v-else>Verify</span>
    </Button>

    <Button
      v-if="props.method === TwoFactorMethod.EMAIL"
      type="button"
      variant="ghost"
      class="w-full"
      :disabled="props.isResending || props.isLockedOut"
      @click="emit('resend')"
    >
      <span v-if="props.isResending">Sending...</span>
      <span v-else>Resend code</span>
    </Button>
  </form>
</template>
