<script setup lang="ts">
import { Plus, Loader2, ShieldOff } from 'lucide-vue-next';
import { useQuery } from 'villus';
import { GetAccessPoliciesDocument } from '~/api-service/generated/graphql';

definePageMeta({ layout: 'admin' });

const { data, isFetching, execute: refetch } = useQuery({ query: GetAccessPoliciesDocument });

const policies = computed(() => data.value?.getAccessPolicies?.data ?? []);

const createDialogOpen = ref(false);
const editingPolicy = ref<{
  id: string; name: string; description: string; scopes: string[]; permissions: string[];
} | null>(null);

function handleEdit(policy: typeof editingPolicy.value) {
  editingPolicy.value = policy;
  createDialogOpen.value = true;
}

function handleCreate() {
  editingPolicy.value = null;
  createDialogOpen.value = true;
}

async function handleSaved() {
  await refetch();
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Permissions</h1>
        <p class="mt-1 text-gray-500">Manage access policies and scopes</p>
      </div>
      <Button @click="handleCreate">
        <Plus class="mr-2 size-4" />
        New Policy
      </Button>
    </div>

    <div class="mt-6">
      <div v-if="isFetching" class="flex justify-center py-12">
        <Loader2 class="size-6 animate-spin text-gray-400" />
      </div>

      <div v-else-if="policies.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
        <ShieldOff class="mb-2 size-10" />
        <p>No policies found. Create one to get started.</p>
      </div>

      <ClientOnly v-else>
        <AdminPolicyCardGrid :policies="policies" @edit="handleEdit" />
      </ClientOnly>
    </div>

    <ClientOnly>
      <AdminCreatePolicyDialog
        v-model:open="createDialogOpen"
        :editing-policy="editingPolicy"
        @saved="handleSaved"
      />
    </ClientOnly>
  </div>
</template>
