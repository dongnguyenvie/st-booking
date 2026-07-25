<script setup lang="ts">
import { Loader2, Trash2 } from 'lucide-vue-next';
import { useQuery, useMutation } from 'villus';
import { GetMyApiKeysDocument, DeleteApiKeyDocument } from '~/api-service/generated/graphql';

interface ApiKey {
  id: string;
  name: string;
  accessPolicyIds: string[];
  createdAt: string;
}

const { data, isFetching, execute: refetch } = useQuery({ query: GetMyApiKeysDocument });
const { execute: deleteKey } = useMutation(DeleteApiKeyDocument);

const apiKeys = computed<ApiKey[]>(() => data.value?.getMyApiKeys?.data ?? []);
const deletingId = ref<string | null>(null);

async function handleDelete(id: string) {
  deletingId.value = id;
  await deleteKey({ id });
  deletingId.value = null;
  await refetch();
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
            <TableHead>Policies</TableHead>
            <TableHead>Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="apiKeys.length === 0">
            <TableCell colspan="4" class="text-center text-gray-400">No API keys found.</TableCell>
          </TableRow>
          <TableRow v-for="key in apiKeys" :key="key.id">
            <TableCell class="font-medium">{{ key.name }}</TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-1">
                <Badge v-for="policyId in key.accessPolicyIds" :key="policyId" variant="outline" class="text-xs">
                  {{ policyId }}
                </Badge>
              </div>
            </TableCell>
            <TableCell>{{ formatDate(key.createdAt) }}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                class="size-8 text-destructive hover:text-destructive"
                :disabled="deletingId === key.id"
                @click="handleDelete(key.id)"
              >
                <Loader2 v-if="deletingId === key.id" class="size-4 animate-spin" />
                <Trash2 v-else class="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
