<script setup lang="ts">
import { AlertCircle, AlertTriangle, Check, Copy, Key } from 'lucide-vue-next';
import { useMutation, useQuery } from 'villus';
import { GetAccessPoliciesDocument, CreateApiKeyDocument } from '~/api-service/generated/graphql';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  created: [];
}>();

const { data: policiesData } = useQuery({ query: GetAccessPoliciesDocument });
const { execute: createKey } = useMutation(CreateApiKeyDocument);

const availablePolicies = computed(() => policiesData.value?.getAccessPolicies?.data ?? []);

const keyName = ref('');
const selectedPolicies = ref<string[]>([]);
const saving = ref(false);
const error = ref('');
const generatedKey = ref('');
const copied = ref(false);

watch(() => props.open, (val) => {
  if (!val) {
    keyName.value = '';
    selectedPolicies.value = [];
    error.value = '';
    generatedKey.value = '';
    copied.value = false;
  }
});

function togglePolicy(id: string) {
  selectedPolicies.value = selectedPolicies.value.includes(id)
    ? selectedPolicies.value.filter((p) => p !== id)
    : [...selectedPolicies.value, id];
}

async function handleCreate() {
  if (!keyName.value.trim()) { error.value = 'Name is required.'; return; }
  saving.value = true;
  error.value = '';
  try {
    const { data, error: gqlError } = await createKey({
      input: { name: keyName.value, policyIds: selectedPolicies.value },
    });
    if (gqlError || !data?.createApiKey?.data) {
      error.value = 'Failed to create API key.';
      return;
    }
    generatedKey.value = data.createApiKey.data.key;
    emit('created');
  } catch {
    error.value = 'An error occurred.';
  } finally {
    saving.value = false;
  }
}

async function copyKey() {
  if (!generatedKey.value) return;
  await navigator.clipboard.writeText(generatedKey.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create API Key</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Creation form -->
        <div v-if="!generatedKey" class="space-y-4">
          <div class="space-y-1.5">
            <Label>Key Name</Label>
            <div class="relative">
              <Key class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input v-model="keyName" placeholder="e.g. my-integration" class="pl-9" />
            </div>
          </div>

          <div>
            <p class="mb-2 text-sm font-medium">Assign Policies</p>
            <div class="max-h-48 space-y-2 overflow-y-auto">
              <label
                v-for="policy in availablePolicies"
                :key="policy.id"
                class="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-2.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Checkbox
                  :model-value="selectedPolicies.includes(policy.id)"
                  @update:model-value="togglePolicy(policy.id)"
                />
                <span class="text-sm">{{ policy.name }}</span>
              </label>
              <p v-if="availablePolicies.length === 0" class="text-sm text-gray-400">No policies available.</p>
            </div>
          </div>

          <Alert v-if="error" variant="destructive">
            <AlertCircle class="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
        </div>

        <!-- Generated key display -->
        <div v-else class="space-y-3">
          <Alert>
            <AlertTriangle class="size-4" />
            <AlertTitle>Copy this key now</AlertTitle>
            <AlertDescription>It won't be shown again.</AlertDescription>
          </Alert>
          <div class="flex items-center gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <code class="flex-1 break-all text-xs">{{ generatedKey }}</code>
            <Button variant="ghost" size="icon" class="size-8 shrink-0" @click="copyKey">
              <Check v-if="copied" class="size-4 text-green-500" />
              <Copy v-else class="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="ghost" @click="emit('update:open', false)">Close</Button>
        <Button v-if="!generatedKey" :disabled="saving" @click="handleCreate">
          <span v-if="saving" class="flex items-center gap-2">
            <span class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Generating...
          </span>
          <span v-else>Generate Key</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
