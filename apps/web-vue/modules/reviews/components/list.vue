<script setup lang="ts">
import { Loader2, MessageSquareOff, Star } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useReviewsStore } from '~/stores/reviews/reviews-store';

const store = useReviewsStore();
const { loading, visible, awaitingResponseOnly, awaitingResponseCount, averageRating } =
  storeToRefs(store);

onMounted(() => store.fetchAll());
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500">
        Average {{ averageRating }} / 5 · {{ awaitingResponseCount }} awaiting a reply
      </p>
      <Button
        :variant="awaitingResponseOnly ? 'default' : 'ghost'"
        size="sm"
        @click="store.toggleAwaitingResponseOnly()"
      >
        Awaiting reply
      </Button>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <Loader2 class="size-6 animate-spin text-gray-400" />
    </div>

    <Card v-else-if="visible.length === 0">
      <CardContent class="py-10 text-center text-gray-400">
        <MessageSquareOff class="mx-auto mb-2 size-8" />
        No reviews to show.
      </CardContent>
    </Card>

    <Card v-for="review in visible" v-else :key="review.id">
      <CardContent class="space-y-2 py-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">{{ review.listingTitle }}</p>
            <p class="text-xs text-gray-500">{{ review.guestName }} · stayed {{ review.stayedOn }}</p>
          </div>
          <div class="flex items-center gap-0.5">
            <Star
              v-for="n in 5"
              :key="n"
              class="size-4"
              :class="n <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'"
            />
          </div>
        </div>

        <p class="text-sm">{{ review.body }}</p>

        <div v-if="review.response" class="rounded-md bg-muted/50 p-3 text-sm">
          <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Host reply</p>
          {{ review.response }}
        </div>
        <Badge v-else variant="secondary" class="text-xs">Awaiting reply</Badge>
      </CardContent>
    </Card>
  </div>
</template>
