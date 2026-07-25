<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMutation } from 'villus';
import {
  VerifyTwoFactorDocument,
  ResendTwoFactorEmailDocument,
} from '~/api-service/generated/graphql';
import { useAuthStore } from '~/stores/auth-store';
import { ROUTES } from '~/config/routes';
import { getHomeRouteByPrivileges } from '~/config/get-home-route-by-privileges';

definePageMeta({ layout: 'default' });

const authStore = useAuthStore();
const { twoFactorChallenge, isAuthenticated } = storeToRefs(authStore);
const { setSession } = useAuth();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const isLockedOut = ref(false);
const isResending = ref(false);

const { execute: executeVerify } = useMutation(VerifyTwoFactorDocument);
const { execute: executeResend } = useMutation(ResendTwoFactorEmailDocument);

const SESSION_EXPIRED_KEYWORDS = ['expired', 'invalid', 'not found'];
const LOCKOUT_KEYWORDS = ['too many', 'locked', 'rate'];

function classifyError(msg: string): 'expired' | 'lockout' | 'other' {
  const lower = msg.toLowerCase();
  if (SESSION_EXPIRED_KEYWORDS.some((k) => lower.includes(k))) return 'expired';
  if (LOCKOUT_KEYWORDS.some((k) => lower.includes(k))) return 'lockout';
  return 'other';
}

// Guard: no challenge AND not yet authenticated → back to login.
// Skip when already authenticated — the push below races with this on success.
watchEffect(() => {
  if (twoFactorChallenge.value === null && !isAuthenticated.value) {
    router.replace(ROUTES.auth.login);
  }
});

async function handleSubmit(code: string) {
  if (!twoFactorChallenge.value) return;
  loading.value = true;
  error.value = '';

  const { data, error: gqlError } = await executeVerify({
    input: { code, preAuthToken: twoFactorChallenge.value.preAuthToken },
  });

  loading.value = false;

  if (gqlError || !data?.verifyTwoFactor?.data) {
    const msg = gqlError?.message ?? 'Verification failed';
    const kind = classifyError(msg);
    if (kind === 'expired') {
      authStore.clearTwoFactorChallenge();
      await router.replace(ROUTES.auth.login);
      return;
    }
    if (kind === 'lockout') {
      isLockedOut.value = true;
    }
    error.value = msg;
    return;
  }

  const { accessToken, user } = data.verifyTwoFactor.data;
  setSession(accessToken, {
    id: user.id,
    email: user.email,
    name: user.name ?? '',
    privileges: user.privileges ?? [],
  });
  authStore.clearTwoFactorChallenge();
  const target = getHomeRouteByPrivileges(user.privileges ?? []);
  await router.push(target);
}

async function handleResend() {
  if (!twoFactorChallenge.value) return;
  isResending.value = true;
  await executeResend({
    input: { preAuthToken: twoFactorChallenge.value.preAuthToken },
  });
  isResending.value = false;
}
</script>

<template>
  <Card v-if="twoFactorChallenge" class="w-full max-w-sm">
    <CardHeader class="text-center">
      <CardTitle class="text-2xl">Two-factor verification</CardTitle>
      <CardDescription>Additional verification required to sign in.</CardDescription>
    </CardHeader>

    <CardContent>
      <ClientOnly>
        <AuthVerifyCodeForm
          :method="twoFactorChallenge.method"
          :email="twoFactorChallenge.email"
          :loading="loading"
          :error="error"
          :is-locked-out="isLockedOut"
          :is-resending="isResending"
          @submit="handleSubmit"
          @resend="handleResend"
        />
      </ClientOnly>
    </CardContent>
  </Card>
</template>
