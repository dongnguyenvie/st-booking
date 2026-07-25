<script setup lang="ts">
import { AlertCircle, CheckCircle2 } from 'lucide-vue-next';
import { useMutation } from 'villus';
import {
  TwoFactorSetupInitDocument,
  TwoFactorSetupVerifyDocument,
  TwoFactorMethod,
} from '~/api-service/generated/graphql';

const emit = defineEmits<{ (e: 'done'): void }>();

const qrCode = ref<string | null>(null);
const secret = ref<string | null>(null);
const code = ref('');
const phase = ref<'idle' | 'scanning' | 'done'>('idle');
const loading = ref(false);
const error = ref('');

const { execute: initSetup } = useMutation(TwoFactorSetupInitDocument);
const { execute: verifySetup } = useMutation(TwoFactorSetupVerifyDocument);

async function handleStart() {
  loading.value = true;
  error.value = '';
  const { data, error: gqlError } = await initSetup({ method: TwoFactorMethod.TOTP });
  loading.value = false;
  if (gqlError || !data?.twoFactorSetupInit) {
    error.value = gqlError?.message ?? 'Failed to start TOTP setup';
    return;
  }
  qrCode.value = data.twoFactorSetupInit.qrCodeDataUrl ?? null;
  secret.value = data.twoFactorSetupInit.secret ?? null;
  phase.value = 'scanning';
}

async function handleVerify() {
  if (code.value.length !== 6) return;
  loading.value = true;
  error.value = '';
  const { data, error: gqlError } = await verifySetup({
    input: { method: TwoFactorMethod.TOTP, code: code.value },
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
        Scan a QR code with Google Authenticator, 1Password, or any TOTP app.
      </p>
      <Button class="mt-3" :disabled="loading" @click="handleStart">
        <span v-if="loading">Starting...</span>
        <span v-else>Start TOTP setup</span>
      </Button>
    </div>

    <div v-else-if="phase === 'scanning'" class="space-y-3">
      <div v-if="qrCode" class="flex justify-center rounded-md border border-border bg-white p-4">
        <img :src="qrCode" alt="TOTP QR code" class="size-48" />
      </div>
      <div v-if="secret" class="space-y-1">
        <Label>Or enter secret manually</Label>
        <Input :model-value="secret" readonly class="font-mono text-xs" />
      </div>
      <div class="space-y-1.5">
        <Label for="totp-code">Enter 6-digit code from your app</Label>
        <Input
          id="totp-code"
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
      <Button class="w-full" :disabled="loading || code.length !== 6" @click="handleVerify">
        <span v-if="loading">Verifying...</span>
        <span v-else>Verify and enable</span>
      </Button>
    </div>

    <div v-else class="flex items-center gap-2 text-green-600">
      <CheckCircle2 class="size-5" />
      <span class="text-sm font-medium">TOTP enabled successfully</span>
    </div>
  </div>
</template>
