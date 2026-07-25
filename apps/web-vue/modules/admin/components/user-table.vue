<script setup lang="ts">
import { Loader2, MoreHorizontal, Shield, UsersRound } from 'lucide-vue-next';
import { useQuery } from 'villus';
import { GetUsersDocument } from '~/api-service/generated/graphql';
import { PRIVILEGE_LABELS } from '@repo/core';

interface User {
  id: string;
  name?: string | null;
  email: string;
  isActive: boolean;
  privileges?: number[] | null;
  createdAt: string;
}

interface DialogUser {
  id: string;
  name: string;
  email: string;
  privileges: string[];
}

const { data, isFetching } = useQuery({ query: GetUsersDocument });
const users = computed<User[]>(() => data.value?.getUsers?.data ?? []);

const privilegesDialogOpen = ref(false);
const rolesDialogOpen = ref(false);
const selectedUser = ref<DialogUser | null>(null);

function toDialogUser(user: User): DialogUser {
  return {
    id: user.id,
    name: user.name ?? '',
    email: user.email,
    privileges: (user.privileges ?? []).map(String),
  };
}

function openPrivilegesDialog(user: User) {
  selectedUser.value = toDialogUser(user);
  privilegesDialogOpen.value = true;
}

function openRolesDialog(user: User) {
  selectedUser.value = toDialogUser(user);
  rolesDialogOpen.value = true;
}

function formatDate(val: string) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString();
}
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <div v-if="isFetching" class="flex justify-center py-8">
        <Loader2 class="size-6 animate-spin text-gray-400" />
      </div>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Privileges</TableHead>
            <TableHead>Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="users.length === 0">
            <TableCell colspan="6" class="text-center text-gray-400">No users found.</TableCell>
          </TableRow>
          <TableRow v-for="user in users" :key="user.id">
            <TableCell class="font-medium">{{ user.name }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>
              <Badge :variant="user.isActive ? 'default' : 'secondary'" class="text-xs">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </Badge>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <Badge v-for="priv in user.privileges" :key="priv" variant="outline" class="text-xs">
                  {{ PRIVILEGE_LABELS[priv] ?? priv }}
                </Badge>
              </div>
            </TableCell>
            <TableCell>{{ formatDate(user.createdAt) }}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="size-8">
                    <MoreHorizontal class="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="openRolesDialog(user)">
                    <UsersRound class="mr-2 size-4" />
                    Manage Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="openPrivilegesDialog(user)">
                    <Shield class="mr-2 size-4" />
                    Edit Privileges
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>

    <ClientOnly>
      <AdminUserPrivilegesDialog
        v-model:open="privilegesDialogOpen"
        :user="selectedUser"
        @saved="() => {}"
      />
      <AdminUserRolesDialog
        v-model:open="rolesDialogOpen"
        :user="selectedUser"
      />
    </ClientOnly>
  </Card>
</template>
