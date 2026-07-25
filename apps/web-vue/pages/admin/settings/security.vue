<script setup lang="ts">
import { Shield, ShieldCheck, Loader2 } from 'lucide-vue-next';
import { useQuery } from 'villus';
import { MeDocument, TwoFactorMethod } from '~/api-service/generated/graphql';
import { useAuthStore } from '~/stores/auth-store';

definePageMeta({ layout: 'admin' });

const authStore = useAuthStore();

const { data, isFetching, execute: refetchMe } = useQuery({
  query: MeDocument,
  cachePolicy: 'network-only',
});

const me = computed(() => data.value?.me);
const isEnabled = computed(() => me.value?.twoFactorEnabled ?? false);
const method = computed(() => me.value?.twoFactorMethod ?? null);

const setupTab = ref<TwoFactorMethod>(TwoFactorMethod.TOTP);

async function handleSetupDone() {
  await refetchMe();
  // Sync auth store with new 2FA status for menus/guards that read from it
  if (me.value) {
    authStore.updateUser({
      id: me.value.id,
      email: me.value.email,
      name: me.value.name ?? '',
      privileges: me.value.privileges ?? [],
    });
  }
}

async function handleDisableDone() {
  await refetchMe();
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Security</h1>
      <p class="mt-1 text-gray-500">Manage two-factor authentication for your account.</p>
    </div>

    <div v-if="isFetching && !me" class="flex justify-center py-12">
      <Loader2 class="size-6 animate-spin text-gray-400" />
    </div>

    <div v-else class="space-y-6">
      <!-- Status card -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-3">
          <div class="flex items-center gap-2">
            <component :is="isEnabled ? ShieldCheck : Shield" class="size-5" :class="isEnabled ? 'text-green-600' : 'text-gray-400'" />
            <CardTitle class="text-base">Two-Factor Authentication</CardTitle>
          </div>
          <Badge :variant="isEnabled ? 'default' : 'secondary'">
            {{ isEnabled ? `Enabled (${method})` : 'Disabled' }}
          </Badge>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            <span v-if="isEnabled">
              Your account is protected by {{ method === TwoFactorMethod.TOTP ? 'an authenticator app' : 'email verification' }}.
              You'll be prompted for a code on every sign-in.
            </span>
            <span v-else>
              Add an extra layer of security by requiring a verification code at sign-in.
            </span>
          </p>
        </CardContent>
      </Card>

      <!-- Setup card (shown when disabled) -->
      <Card v-if="!isEnabled">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Enable two-factor authentication</CardTitle>
          <CardDescription>Choose a method to secure your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs v-model="setupTab" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger :value="TwoFactorMethod.TOTP">Authenticator app</TabsTrigger>
              <TabsTrigger :value="TwoFactorMethod.EMAIL">Email</TabsTrigger>
            </TabsList>
            <TabsContent :value="TwoFactorMethod.TOTP" class="pt-4">
              <SecurityTwoFactorTotpSetup @done="handleSetupDone" />
            </TabsContent>
            <TabsContent :value="TwoFactorMethod.EMAIL" class="pt-4">
              <SecurityTwoFactorEmailSetup @done="handleSetupDone" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <!-- Disable card (shown when enabled) -->
      <Card v-else>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Disable two-factor authentication</CardTitle>
          <CardDescription>
            Verify your identity to turn off 2FA. This weakens your account security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityTwoFactorDisableCard
            :method="method ?? TwoFactorMethod.EMAIL"
            @done="handleDisableDone"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
