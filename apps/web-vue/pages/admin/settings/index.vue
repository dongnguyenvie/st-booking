<script setup lang="ts">
import { Settings, Bell, Shield, Save, ChevronRight } from 'lucide-vue-next';
import { ROUTES } from '~/config/routes';

definePageMeta({ layout: 'admin' });

const siteName = ref('Canmore Stays');
const supportEmail = ref('support@innoland.com');
const emailNotifications = ref(true);
const maintenanceMode = ref(false);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Settings</h1>
    <p class="mt-1 text-gray-500">Configure platform settings</p>

    <div class="mt-6 space-y-6">
      <!-- General -->
      <Card>
        <CardHeader class="flex flex-row items-center gap-2 pb-3">
          <Settings class="size-4 text-gray-500" />
          <CardTitle class="text-base">General</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-1.5">
            <Label for="site-name">Site Name</Label>
            <Input id="site-name" v-model="siteName" placeholder="Site name" />
          </div>
          <div class="space-y-1.5">
            <Label for="support-email">Support Email</Label>
            <Input id="support-email" v-model="supportEmail" type="email" placeholder="support@example.com" />
          </div>
        </CardContent>
      </Card>

      <!-- Notifications -->
      <Card>
        <CardHeader class="flex flex-row items-center gap-2 pb-3">
          <Bell class="size-4 text-gray-500" />
          <CardTitle class="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Email Notifications</p>
              <p class="text-sm text-gray-500">Receive system alerts via email</p>
            </div>
            <Switch v-model="emailNotifications" />
          </div>
        </CardContent>
      </Card>

      <!-- Security -->
      <Card>
        <CardHeader class="flex flex-row items-center gap-2 pb-3">
          <Shield class="size-4 text-gray-500" />
          <CardTitle class="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <NuxtLink
            :to="ROUTES.admin.security"
            class="-mx-2 flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent"
          >
            <div>
              <p class="font-medium">Two-Factor Authentication</p>
              <p class="text-sm text-gray-500">Manage TOTP or email verification for your account</p>
            </div>
            <ChevronRight class="size-4 text-gray-400" />
          </NuxtLink>

          <Separator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Maintenance Mode</p>
              <p class="text-sm text-gray-500">Disable public access to the site</p>
            </div>
            <Switch v-model="maintenanceMode" />
          </div>
        </CardContent>
      </Card>

      <div class="flex justify-end">
        <Button>
          <Save class="mr-2 size-4" />
          Save Settings
        </Button>
      </div>
    </div>
  </div>
</template>
