<script setup lang="ts">
import { Plus, Loader2, ShieldOff, Pencil, Trash2, Star, StarOff } from 'lucide-vue-next';
import { useQuery, useMutation } from 'villus';
import {
  GetRolesDocument,
  GetPermissionsDocument,
  SetRolePermissionsDocument,
  SetDefaultRoleDocument,
  DeleteRoleDocument,
} from '~/api-service/generated/graphql';

definePageMeta({ layout: 'admin' });

const { data: rolesData, isFetching: rolesFetching, execute: refetchRoles } = useQuery({
  query: GetRolesDocument,
  variables: { pagination: { page: 1, limit: 100 } },
});
const { data: permsData, isFetching: permsFetching } = useQuery({
  query: GetPermissionsDocument,
  variables: { pagination: { page: 1, limit: 100 } },
});

const roles = computed(() => rolesData.value?.getRoles?.data ?? []);
const permissions = computed(() => permsData.value?.getPermissions?.data ?? []);
const loading = computed(() => rolesFetching.value || permsFetching.value);

// Group permissions by resource for the matrix rows
const groupedPermissions = computed(() => {
  const groups: Record<string, typeof permissions.value> = {};
  for (const p of permissions.value) {
    (groups[p.resource] ??= []).push(p);
  }
  return Object.entries(groups)
    .map(([resource, perms]) => ({ resource, perms }))
    .sort((a, b) => a.resource.localeCompare(b.resource));
});

function roleKeys(role: (typeof roles.value)[number]): string[] {
  return (role.rolePermissions ?? []).map((rp) => rp.permission.key);
}

function roleHasPerm(role: (typeof roles.value)[number], key: string): boolean {
  return roleKeys(role).includes(key);
}

const { execute: setRolePermissions } = useMutation(SetRolePermissionsDocument);
const { execute: setDefaultRole } = useMutation(SetDefaultRoleDocument);
const { execute: deleteRoleMutation } = useMutation(DeleteRoleDocument);

// Track in-flight cell toggles so we can disable them: `${roleId}:${key}`
const pending = ref<Set<string>>(new Set());

async function toggle(role: (typeof roles.value)[number], key: string) {
  const ck = `${role.id}:${key}`;
  if (pending.value.has(ck)) return;
  const current = roleKeys(role);
  const next = current.includes(key)
    ? current.filter((k) => k !== key)
    : [...current, key];
  pending.value = new Set(pending.value).add(ck);
  try {
    await setRolePermissions({ input: { roleId: role.id, permissionKeys: next } });
    await refetchRoles();
  } finally {
    const s = new Set(pending.value);
    s.delete(ck);
    pending.value = s;
  }
}

async function makeDefault(role: (typeof roles.value)[number]) {
  if (role.isDefault) return;
  await setDefaultRole({ id: role.id });
  await refetchRoles();
}

// Role create / edit dialog
const roleDialogOpen = ref(false);
const editingRole = ref<{ id: string; name: string; description: string } | null>(null);

function openCreate() {
  editingRole.value = null;
  roleDialogOpen.value = true;
}
function openEdit(role: (typeof roles.value)[number]) {
  editingRole.value = { id: role.id, name: role.name, description: role.description ?? '' };
  roleDialogOpen.value = true;
}
async function onRoleSaved() {
  await refetchRoles();
}

// Delete confirmation
const deleteTarget = ref<{ id: string; name: string } | null>(null);
const deleting = ref(false);
function askDelete(role: (typeof roles.value)[number]) {
  deleteTarget.value = { id: role.id, name: role.name };
}
async function confirmDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await deleteRoleMutation({ id: deleteTarget.value.id });
    await refetchRoles();
    deleteTarget.value = null;
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Roles &amp; Permissions</h1>
        <p class="mt-1 text-gray-500">Assign permissions to roles. Columns are roles, rows are permissions.</p>
      </div>
      <Button @click="openCreate">
        <Plus class="mr-2 size-4" />
        New Role
      </Button>
    </div>

    <div class="mt-6">
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="size-6 animate-spin text-gray-400" />
      </div>

      <div v-else-if="roles.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
        <ShieldOff class="mb-2 size-10" />
        <p>No roles found. Create one to get started.</p>
      </div>

      <Card v-else>
        <CardContent class="overflow-x-auto p-0">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="sticky left-0 z-10 bg-card px-4 py-3 text-left font-semibold">Permission</th>
                <th
                  v-for="role in roles"
                  :key="role.id"
                  class="min-w-[140px] px-3 py-3 text-center align-top"
                >
                  <div class="flex flex-col items-center gap-1">
                    <div class="flex items-center gap-1 font-semibold">
                      <span>{{ role.name }}</span>
                      <Badge v-if="role.isDefault" variant="secondary" class="text-[10px]">default</Badge>
                    </div>
                    <div class="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        class="size-6"
                        :title="role.isDefault ? 'Signup default' : 'Set as signup default'"
                        @click="makeDefault(role)"
                      >
                        <Star v-if="role.isDefault" class="size-3.5 text-yellow-500" />
                        <StarOff v-else class="size-3.5 text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="icon" class="size-6" title="Rename" @click="openEdit(role)">
                        <Pencil class="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" class="size-6" title="Delete" @click="askDelete(role)">
                        <Trash2 class="size-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="group in groupedPermissions" :key="group.resource">
                <tr class="border-b border-border bg-muted/40">
                  <td
                    :colspan="roles.length + 1"
                    class="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {{ group.resource }}
                  </td>
                </tr>
                <tr v-for="perm in group.perms" :key="perm.id" class="border-b border-border/60 hover:bg-muted/30">
                  <td class="sticky left-0 z-10 bg-card px-4 py-2">
                    <div class="font-medium">{{ perm.key }}</div>
                    <div v-if="perm.description" class="text-xs text-gray-400">{{ perm.description }}</div>
                  </td>
                  <td v-for="role in roles" :key="role.id" class="px-3 py-2 text-center">
                    <div class="flex justify-center">
                      <Loader2
                        v-if="pending.has(`${role.id}:${perm.key}`)"
                        class="size-4 animate-spin text-gray-400"
                      />
                      <Checkbox
                        v-else
                        :checked="roleHasPerm(role, perm.key)"
                        @update:checked="toggle(role, perm.key)"
                      />
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-if="permissions.length === 0">
                <td :colspan="roles.length + 1" class="px-4 py-6 text-center text-gray-400">
                  No permissions in catalog.
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>

    <ClientOnly>
      <AdminRoleDialog
        v-model:open="roleDialogOpen"
        :editing-role="editingRole"
        @saved="onRoleSaved"
      />

      <Dialog :open="!!deleteTarget" @update:open="(v) => { if (!v) deleteTarget = null; }">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
          </DialogHeader>
          <p class="text-sm text-gray-500">
            Are you sure you want to delete
            <span class="font-medium text-gray-900 dark:text-white">{{ deleteTarget?.name }}</span>?
            This soft-deletes the role and removes it from all users.
          </p>
          <DialogFooter>
            <Button variant="ghost" @click="deleteTarget = null">Cancel</Button>
            <Button variant="destructive" :disabled="deleting" @click="confirmDelete">
              <span v-if="deleting">Deleting...</span>
              <span v-else>Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientOnly>
  </div>
</template>
