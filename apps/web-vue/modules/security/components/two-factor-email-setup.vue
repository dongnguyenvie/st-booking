<script setup lang="ts">
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next';
import { useMutation } from 'villus';
import {
  TwoFactorSetupInitDocument,
  TwoFactorSetupVerifyDocument,
  TwoFactorMethod,
} from '~/api-service/generated/graphql';

const emit = defineEmits<{ (e: 'done'): void }>();

const phase = ref<'idle' | 'sent' | 'done'>('idle');
const code = ref('');
const loading = ref(false);
const error = ref('');

const { execute: initSetup } = useMutation(TwoFactorSetupInitDocument);
const { execute: verifySetup } = useMutation(TwoFactorSetupVerifyDocument);

async function handleStart() {
  loading.value = true;
  error.value = '';
  const { error: gqlError } = await initSetup({ method: TwoFactorMethod.EMAIL });
  loading.value = false;
  if (gqlError) {
    error.value = gqlError.message;
    return;
  }
  phase.value = 'sent';
}

async function handleVerify() {
  if (code.value.length !== 6) return;
  loading.value = true;
  error.value = '';
  const { data, error: gqlError } = await verifySetup({
    input: { method: TwoFactorMethod.EMAIL, code: code.value },
  });
  loading.value = false;
  if (gqlError || !data?.twoFactorSetupVerify?.success) {
    error.value = gqlError?.message ?? 'Invalid code';
    return;
  }
  phase.value = 'done';
  emit('done');
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="phase === 'idle'">
      <p class="text-sm text-muted-foreground">
        A 6-digit code will be sent to your email each time you sign in.
      </p>
      <Button class="mt-3" :disabled="loading" @click="handleStart">
        <span v-if="loading">Sending...</span>
        <span v-else>Send verification code</span>
      </Button>
    </div>

    <div v-else-if="phase === 'sent'" class="space-y-3">
      <p class="text-sm text-muted-foreground">
        Check your inbox (or dev server logs). Enter the 6-digit code below.
      </p>
      <div class="space-y-1.5">
        <Label for="email-code">Verification code</Label>
        <Input
          id="email-code"
          v-model="code"
          maxlength="6"
          placeholder="000000"
          inputmode="numeric"
          class="text-center font-mono text-xl tracking-widest"
        />
      </div>
      <Alert v-if="error" variant="destructive">
        <AlertCircle class="size-4" />
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>
      <div class="flex gap-2">
        <Button class="flex-1" :disabled="loading || code.length !== 6" @click="handleVerify">
          <span v-if="loading">Verifying...</span>
          <span v-else>Verify and enable</span>
        </Button>
        <Button variant="ghost" :disabled="loading" @click="handleStart">Resend</Button>
      </div>
    </div>

    <div v-else class="flex items-center gap-2 text-green-600">
      <CheckCircle2 class="size-5" />
      <span class="text-sm font-medium">Email 2FA enabled successfully</span>
    </div>
  </div>
</template>
