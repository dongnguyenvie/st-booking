<script setup lang="ts">
import { AlertCircle, X } from 'lucide-vue-next';
import { useQuery, useMutation } from 'villus';
import {
  GetUserAccessPoliciesDocument,
  GetAccessPoliciesDocument,
  AssignPolicyToUserDocument,
  RemovePolicyFromUserDocument,
} from '~/api-service/generated/graphql';

const props = defineProps<{
  open: boolean;
  user: { id: string; name: string; email: string } | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

interface Policy { id: string; name: string; description: string; }

const userId = computed(() => props.user?.id ?? '');

const { data: userPoliciesData, execute: refetchUserPolicies } = useQuery({
  query: GetUserAccessPoliciesDocument,
  variables: computed(() => ({ userId: userId.value })),
  paused: computed(() => !props.open || !props.user),
});

const { data: allPoliciesData, execute: refetchAllPolicies } = useQuery({
  query: GetAccessPoliciesDocument,
  paused: computed(() => !props.open || !props.user),
});

const { execute: assignPolicy } = useMutation(AssignPolicyToUserDocument);
const { execute: removePolicy } = useMutation(RemovePolicyFromUserDocument);

const assignedPolicies = computed<Policy[]>(() => userPoliciesData.value?.getUserAccessPolicies?.data ?? []);
const allPolicies = computed<Policy[]>(() => allPoliciesData.value?.getAccessPolicies?.data ?? []);

async function refetch() {
  await Promise.all([refetchUserPolicies(), refetchAllPolicies()]);
}

const selectedPolicyId = ref('');
const actionError = ref('');

const availablePolicies = computed(() =>
  allPolicies.value.filter((p) => !assignedPolicies.value.some((a) => a.id === p.id))
);

async function handleAssign() {
  if (!props.user || !selectedPolicyId.value) return;
  actionError.value = '';
  const { error } = await assignPolicy({ userId: userId.value, policyId: selectedPolicyId.value });
  if (error) { actionError.value = 'Failed to assign policy.'; return; }
  selectedPolicyId.value = '';
  await refetch();
}

async function handleRemove(policyId: string) {
  if (!props.user) return;
  actionError.value = '';
  const { error } = await removePolicy({ userId: userId.value, policyId });
  if (error) { actionError.value = 'Failed to remove policy.'; return; }
  await refetch();
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Manage Policies</DialogTitle>
      </DialogHeader>

      <div v-if="user" class="space-y-4">
        <p class="text-sm text-gray-500">
          User: <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
        </p>

        <div>
          <p class="mb-2 text-sm font-medium">Assigned Policies</p>
          <div v-if="assignedPolicies.length === 0" class="text-sm text-gray-400">No policies assigned.</div>
          <div v-else class="space-y-2">
            <div
              v-for="policy in assignedPolicies"
              :key="policy.id"
              class="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 dark:border-gray-700"
            >
              <span class="text-sm font-medium">{{ policy.name }}</span>
              <Button variant="ghost" size="icon" class="size-7 text-destructive hover:text-destructive" @click="handleRemove(policy.id)">
                <X class="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <p class="mb-2 text-sm font-medium">Assign Policy</p>
          <div class="flex gap-2">
            <Select v-model="selectedPolicyId">
              <SelectTrigger class="flex-1">
                <SelectValue placeholder="Select policy..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="p in availablePolicies" :key="p.id" :value="p.id">
                  {{ p.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button :disabled="!selectedPolicyId" @click="handleAssign">Assign</Button>
          </div>
        </div>

        <Alert v-if="actionError" variant="destructive">
          <AlertCircle class="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ actionError }}</AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button variant="ghost" @click="emit('update:open', false)">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
