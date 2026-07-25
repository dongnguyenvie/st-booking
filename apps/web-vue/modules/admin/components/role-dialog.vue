<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
import { useMutation } from 'villus';
import { CreateRoleDocument, UpdateRoleDocument } from '~/api-service/generated/graphql';

const props = defineProps<{
  open: boolean;
  editingRole: { id: string; name: string; description: string } | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  saved: [];
}>();

const name = ref('');
const description = ref('');
const saving = ref(false);
const error = ref('');

const isEdit = computed(() => !!props.editingRole);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      name.value = props.editingRole?.name ?? '';
      description.value = props.editingRole?.description ?? '';
      error.value = '';
    }
  },
  { immediate: true },
);

const { execute: createRole } = useMutation(CreateRoleDocument);
const { execute: updateRole } = useMutation(UpdateRoleDocument);

async function handleSave() {
  const trimmed = name.value.trim();
  if (!trimmed) {
    error.value = 'Role name is required.';
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    const desc = description.value.trim() || undefined;
    const { error: gqlError } = props.editingRole
      ? await updateRole({ id: props.editingRole.id, input: { name: trimmed, description: desc } })
      : await createRole({ input: { name: trimmed, description: desc, permissionKeys: [] } });
    if (gqlError) {
      error.value = gqlError.message || 'Failed to save role.';
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
        <DialogTitle>{{ isEdit ? 'Edit Role' : 'New Role' }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="role-name">Name</Label>
          <Input id="role-name" v-model="name" placeholder="e.g. host_operator" />
        </div>
        <div class="space-y-2">
          <Label for="role-description">Description</Label>
          <Input id="role-description" v-model="description" placeholder="Optional description" />
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
          <span v-else>{{ isEdit ? 'Save Changes' : 'Create Role' }}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
