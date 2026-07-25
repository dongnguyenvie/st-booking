<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { useMutation } from 'villus';
import { UpdateUserPrivilegesDocument } from '~/api-service/generated/graphql';

const props = defineProps<{
  open: boolean;
  user: { id: string; name: string; email: string; privileges: string[] } | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  saved: [];
}>();

const ALL_PRIVILEGES = ['SUPER_ADMIN', 'ADMIN', 'POS_MANAGER', 'POS_USER'] as const;

const selected = ref<string[]>([]);
const saving = ref(false);
const error = ref('');

watch(() => props.user, (u) => {
  selected.value = u ? [...u.privileges] : [];
}, { immediate: true });

const { execute } = useMutation(UpdateUserPrivilegesDocument);

function togglePrivilege(priv: string) {
  if (selected.value.includes(priv)) {
    selected.value = selected.value.filter((p) => p !== priv);
  } else {
    selected.value = [...selected.value, priv];
  }
}

async function handleSave() {
  if (!props.user) return;
  saving.value = true;
  error.value = '';
  try {
    const { error: gqlError } = await execute({
      input: { userId: props.user.id, privileges: selected.value },
    });
    if (gqlError) {
      error.value = 'Failed to update privileges.';
      return;
    }
    emit('saved');
    emit('update:open', false);
  } catch {
    error.value = 'An error occurred.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Privileges</DialogTitle>
      </DialogHeader>

      <div v-if="user" class="space-y-4">
        <p class="text-sm text-gray-500">
          User: <span class="font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
          ({{ user.email }})
        </p>

        <div class="space-y-2">
          <label
            v-for="priv in ALL_PRIVILEGES"
            :key="priv"
            class="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Checkbox
              :checked="selected.includes(priv)"
              @update:checked="togglePrivilege(priv)"
            />
            <span class="text-sm font-medium">{{ priv }}</span>
          </label>
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
          <span v-else>Save Changes</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
