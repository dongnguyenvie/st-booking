<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';

defineProps<{
  policies: Array<{
    id: string;
    name: string;
    description: string;
    scopes: string[];
    permissions: string[];
  }>;
}>();

const emit = defineEmits<{
  edit: [policy: { id: string; name: string; description: string; scopes: string[]; permissions: string[] }];
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Card v-for="policy in policies" :key="policy.id">
      <CardContent class="flex flex-col gap-3 p-4">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-semibold">{{ policy.name }}</p>
            <p class="mt-0.5 text-sm text-gray-500">{{ policy.description || 'No description' }}</p>
          </div>
          <Button variant="ghost" size="icon" class="size-7" @click="emit('edit', policy)">
            <Pencil class="size-3.5" />
          </Button>
        </div>

        <div class="flex flex-wrap gap-1">
          <Badge variant="secondary" class="text-xs">
            {{ policy.scopes.length }} scope{{ policy.scopes.length !== 1 ? 's' : '' }}
          </Badge>
          <Badge
            v-for="perm in policy.permissions.slice(0, 3)"
            :key="perm"
            variant="outline"
            class="text-xs"
          >
            {{ perm }}
          </Badge>
          <Badge v-if="policy.permissions.length > 3" variant="secondary" class="text-xs">
            +{{ policy.permissions.length - 3 }} more
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
