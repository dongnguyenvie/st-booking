<script setup lang="ts">
import { LogOut, ArrowLeftRight } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth-store';
import { ROUTES } from '~/config/routes';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const groups = computed(() => authStore.availablePrivilegeGroups);
const activePrivilege = computed(() => authStore.activePrivilege);

const initials = computed(() =>
  user.value?.name?.charAt(0)?.toUpperCase() || '?',
);

/** The other group the user can switch to (not the currently active one) */
const switchTarget = computed(() => {
  if (groups.value.length < 2) return null;
  return groups.value.find((g) =>
    activePrivilege.value === null || !g.privileges.includes(activePrivilege.value),
  ) ?? null;
});

/** Switch to the target privilege group */
function switchDashboard() {
  if (!switchTarget.value) return;
  const target = switchTarget.value.privileges.find((p) => user.value?.privileges.includes(p));
  if (!target) return;
  authStore.setActivePrivilege(target);
  router.push(switchTarget.value.route);
}

async function logout() {
  authStore.clearAuth();
  await router.push(ROUTES.auth.login);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="flex items-center gap-2 px-2.5 py-1.5 h-auto rounded-md border border-border">
        <div class="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {{ initials }}
        </div>
        <span class="hidden text-sm font-medium sm:inline">{{ user?.name }}</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-52">
      <!-- User info -->
      <DropdownMenuLabel class="font-normal">
        <p class="text-sm font-medium">{{ user?.name }}</p>
        <p class="text-xs text-muted-foreground truncate">{{ user?.email }}</p>
      </DropdownMenuLabel>

      <!-- Dashboard switcher — single item, only shown when user can switch -->
      <template v-if="switchTarget">
        <DropdownMenuSeparator />
        <DropdownMenuItem class="cursor-pointer" @click="switchDashboard">
          <ArrowLeftRight class="size-4 mr-2" />
          Switch to {{ switchTarget.label }}
        </DropdownMenuItem>
      </template>

      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive focus:text-destructive cursor-pointer" @click="logout">
        <LogOut class="size-4 mr-2" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
