<script setup lang="ts">
import { Loader2, CalendarX } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useReservationsStore } from '~/stores/reservations/reservations-store';

const store = useReservationsStore();
const { loading, visible } = storeToRefs(store);

onMounted(() => store.fetchAll());

const STATUS_VARIANT = {
  confirmed: 'default',
  pending: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
} as const;

function nights(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(ms / 86_400_000);
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
            <TableHead>Code</TableHead>
            <TableHead>Listing</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Stay</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="visible.length === 0">
            <TableCell colspan="7" class="py-10 text-center text-gray-400">
              <CalendarX class="mx-auto mb-2 size-8" />
              No reservations match this filter.
            </TableCell>
          </TableRow>
          <TableRow v-for="reservation in visible" :key="reservation.id">
            <TableCell class="font-mono text-xs">{{ reservation.code }}</TableCell>
            <TableCell class="font-medium">{{ reservation.listingTitle }}</TableCell>
            <TableCell>{{ reservation.guestName }}</TableCell>
            <TableCell>{{ reservation.checkIn }} → {{ reservation.checkOut }}</TableCell>
            <TableCell>{{ nights(reservation.checkIn, reservation.checkOut) }}</TableCell>
            <TableCell>${{ reservation.total.toLocaleString() }}</TableCell>
            <TableCell>
              <Badge :variant="STATUS_VARIANT[reservation.status]" class="text-xs capitalize">
                {{ reservation.status }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
