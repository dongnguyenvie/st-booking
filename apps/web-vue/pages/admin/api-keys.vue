<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

definePageMeta({ layout: 'admin' });

const createDialogOpen = ref(false);

function handleCreated() {
  // table auto-refetches via its own query
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">API Keys</h1>
        <p class="mt-1 text-gray-500">Manage programmatic access keys</p>
      </div>
      <Button @click="createDialogOpen = true">
        <Plus class="mr-2 size-4" />
        New API Key
      </Button>
    </div>

    <div class="mt-6">
      <ClientOnly>
        <AdminApiKeysTable />
      </ClientOnly>
    </div>

    <ClientOnly>
      <AdminCreateApiKeyDialog
        v-model:open="createDialogOpen"
        @created="handleCreated"
      />
    </ClientOnly>
  </div>
</template>
