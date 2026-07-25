<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { useMutation, useQuery } from 'villus';
import {
  GetAvailableScopesDocument,
  CreateAccessPolicyDocument,
  UpdateAccessPolicyDocument,
} from '~/api-service/generated/graphql';

const props = defineProps<{
  open: boolean;
  editingPolicy?: {
    id: string;
    name: string;
    description: string;
    scopes: string[];
    permissions: string[];
  } | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  saved: [];
}>();

const activeTab = ref('general');
const policyName = ref('');
const description = ref('');
const selectedScopes = ref<string[]>([]);
const selectedPermissions = ref<string[]>([]);
const saving = ref(false);
const error = ref('');

const { data: scopesData } = useQuery({ query: GetAvailableScopesDocument });
const { execute: createPolicy } = useMutation(CreateAccessPolicyDocument);
const { execute: updatePolicy } = useMutation(UpdateAccessPolicyDocument);

// Flatten graphql + rest scope strings into a name-list for the scope selector
const availableScopes = computed<string[]>(() => {
  const d = scopesData.value?.getAvailableScopes?.data as
    { graphql?: string[] | null; rest?: string[] | null; permissions?: string[] | null } | undefined;
  if (!d) return [];
  return [...(d.graphql ?? []), ...(d.rest ?? [])];
});

const allPermissions = computed<string[]>(() => {
  const d = scopesData.value?.getAvailableScopes?.data as
    { permissions?: string[] | null } | undefined;
  return [...new Set(d?.permissions ?? [])];
});

watch(() => props.editingPolicy, (p) => {
  if (p) {
    policyName.value = p.name;
    description.value = p.description;
    selectedScopes.value = [...p.scopes];
    selectedPermissions.value = [...p.permissions];
  } else {
    policyName.value = '';
    description.value = '';
    selectedScopes.value = [];
    selectedPermissions.value = [];
  }
  activeTab.value = 'general';
}, { immediate: true });

function toggleScope(scope: string) {
  selectedScopes.value = selectedScopes.value.includes(scope)
    ? selectedScopes.value.filter((s) => s !== scope)
    : [...selectedScopes.value, scope];
}


function togglePermission(perm: string) {
  selectedPermissions.value = selectedPermissions.value.includes(perm)
    ? selectedPermissions.value.filter((p) => p !== perm)
    : [...selectedPermissions.value, perm];
}

async function handleSave() {
  if (!policyName.value.trim()) { error.value = 'Name is required.'; return; }
  saving.value = true;
  error.value = '';
  try {
    const input = {
      name: policyName.value,
      description: description.value,
      scopes: selectedScopes.value,
      permissions: selectedPermissions.value,
    };
    const result = props.editingPolicy
      ? await updatePolicy({ id: props.editingPolicy.id, input })
      : await createPolicy({ input });
    if (result.error) { error.value = 'Failed to save policy.'; return; }
    emit('saved');
    emit('update:open', false);
  } catch {
    error.value = 'An error occurred.';
  } finally {
    saving.value = false;
  }
}

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Scopes', value: 'scopes' },
  { label: 'Permissions', value: 'permissions' },
];
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ editingPolicy ? 'Edit Policy' : 'Create Policy' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Tab bar -->
        <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-3 pb-2 text-sm font-medium transition-colors"
            :class="activeTab === tab.value
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- General -->
        <div v-if="activeTab === 'general'" class="space-y-3">
          <div class="space-y-1.5">
            <Label>Name</Label>
            <Input v-model="policyName" placeholder="Policy name" />
          </div>
          <div class="space-y-1.5">
            <Label>Description</Label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="Optional description"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <!-- Scopes -->
        <div v-else-if="activeTab === 'scopes'" class="space-y-2">
          <p class="text-sm text-gray-500">Select applicable scopes</p>
          <label
            v-for="scope in availableScopes"
            :key="scope"
            class="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Checkbox
              :checked="selectedScopes.includes(scope)"
              @update:checked="toggleScope(scope)"
            />
            <span class="text-sm font-medium">{{ scope }}</span>
          </label>
          <p v-if="availableScopes.length === 0" class="text-sm text-gray-400">No scopes available.</p>
        </div>

        <!-- Permissions -->
        <div v-else-if="activeTab === 'permissions'" class="space-y-2">
          <p class="text-sm text-gray-500">Select permissions</p>
          <label
            v-for="perm in allPermissions"
            :key="perm"
            class="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Checkbox
              :checked="selectedPermissions.includes(perm)"
              @update:checked="togglePermission(perm)"
            />
            <span class="text-sm font-medium">{{ perm }}</span>
          </label>
          <p v-if="allPermissions.length === 0" class="text-sm text-gray-400">No permissions available.</p>
        </div>

        <Alert v-if="error" variant="destructive">
          <AlertCircle class="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button variant="ghost" @click="emit('update:open', false)">Cancel</Button>
        <Button :disabled="saving" @click="handleSave">
          <span v-if="saving" class="flex items-center gap-2">
            <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Saving...
          </span>
          <span v-else>{{ editingPolicy ? 'Update' : 'Create' }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
