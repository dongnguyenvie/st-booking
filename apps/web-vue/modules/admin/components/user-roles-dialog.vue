<script setup lang="ts">
import { AlertCircle, X } from 'lucide-vue-next';
import { useQuery, useMutation } from 'villus';
import {
  GetUserRolesDocument,
  GetRolesDocument,
  AssignRoleToUserDocument,
  RemoveRoleFromUserDocument,
} from '~/api-service/generated/graphql';

const props = defineProps<{
  open: boolean;
  user: { id: string; name: string; email: string } | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

interface RoleItem {
  id: string;
  name: string;
  description?: string | null;
  permissionCount: number;
}

const userId = computed(() => props.user?.id ?? '');

const { data: userRolesData, execute: refetchUserRoles } = useQuery({
  query: GetUserRolesDocument,
  variables: computed(() => ({ userId: userId.value })),
  paused: computed(() => !props.open || !props.user),
});

const { data: allRolesData, execute: refetchAllRoles } = useQuery({
  query: GetRolesDocument,
  variables: { pagination: { page: 1, limit: 100 } },
  paused: computed(() => !props.open || !props.user),
});

const { execute: assignRole } = useMutation(AssignRoleToUserDocument);
const { execute: removeRole } = useMutation(RemoveRoleFromUserDocument);

function toRoleItem(r: {
  id: string;
  name: string;
  description?: string | null;
  rolePermissions?: { permission: { key: string } }[] | null;
}): RoleItem {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    permissionCount: r.rolePermissions?.length ?? 0,
  };
}

const assignedRoles = computed<RoleItem[]>(() =>
  (userRolesData.value?.getUserRoles?.data ?? []).map(toRoleItem),
);
const allRoles = computed<RoleItem[]>(() =>
  (allRolesData.value?.getRoles?.data ?? []).map(toRoleItem),
);

const availableRoles = computed(() =>
  allRoles.value.filter((r) => !assignedRoles.value.some((a) => a.id === r.id)),
);

async function refetch() {
  await Promise.all([refetchUserRoles(), refetchAllRoles()]);
}

const selectedRoleId = ref('');
const actionError = ref('');

async function handleAssign() {
  if (!props.user || !selectedRoleId.value) return;
  actionError.value = '';
  const { error } = await assignRole({ userId: userId.value, roleId: selectedRoleId.value });
  if (error) {
    actionError.value = 'Failed to assign role.';
    return;
  }
  selectedRoleId.value = '';
  await refetch();
}

async function handleRemove(roleId: string) {
  if (!props.user) return;
  actionError.value = '';
  const { error } = await removeRole({ userId: userId.value, roleId });
  if (error) {
    actionError.value = 'Failed to remove role.';
    return;
  }
  await refetch();
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Manage Roles</DialogTitle>
      </DialogHeader>

      <div v-if="user" class="space-y-4">
        <p class="text-sm text-gray-500">
          User: <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
          ({{ user.email }})
        </p>

        <div>
          <p class="mb-2 text-sm font-medium">Assigned Roles</p>
          <div v-if="assignedRoles.length === 0" class="text-sm text-gray-400">No roles assigned.</div>
          <div v-else class="space-y-2">
            <div
              v-for="role in assignedRoles"
              :key="role.id"
              class="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 dark:border-gray-700"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">{{ role.name }}</span>
                <Badge variant="outline" class="text-[10px]">{{ role.permissionCount }} perms</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="size-7 text-destructive hover:text-destructive"
                @click="handleRemove(role.id)"
              >
                <X class="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <p class="mb-2 text-sm font-medium">Assign Role</p>
          <div class="flex gap-2">
            <Select v-model="selectedRoleId">
              <SelectTrigger class="flex-1">
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="r in availableRoles" :key="r.id" :value="r.id">
                  {{ r.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button :disabled="!selectedRoleId" @click="handleAssign">Assign</Button>
          </div>
          <p v-if="availableRoles.length === 0" class="mt-2 text-xs text-gray-400">
            All roles are already assigned.
          </p>
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
