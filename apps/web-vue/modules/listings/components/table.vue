<script setup lang="ts">
import { Loader2, Home } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useListingsStore } from '~/stores/listings/listings-store';

const store = useListingsStore();
const { loading, visible } = storeToRefs(store);

onMounted(() => store.fetchAll());

const STATUS_VARIANT = {
  published: 'default',
  draft: 'secondary',
  unlisted: 'outline',
} as const;

function money(value: number) {
  return `$${value.toLocaleString()}`;
}
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <div v-if="loading" class="flex justify-center py-8">
        <Loader2 class="size-6 animate-spin text-gray-400" />
      </div>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Sleeps</TableHead>
            <TableHead>Beds / Baths</TableHead>
            <TableHead>Nightly</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="visible.length === 0">
            <TableCell colspan="6" class="py-10 text-center text-gray-400">
              <Home class="mx-auto mb-2 size-8" />
              No listings match this filter.
            </TableCell>
          </TableRow>
          <TableRow v-for="listing in visible" :key="listing.id">
            <TableCell class="font-medium">{{ listing.title }}</TableCell>
            <TableCell>{{ listing.location }}</TableCell>
            <TableCell>{{ listing.maxGuests }}</TableCell>
            <TableCell>{{ listing.bedrooms }} / {{ listing.bathrooms }}</TableCell>
            <TableCell>{{ money(listing.nightlyRate) }}</TableCell>
            <TableCell>
              <Badge :variant="STATUS_VARIANT[listing.status]" class="text-xs capitalize">
                {{ listing.status }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
