<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useSearchStore } from '~/stores/search/search-store';
import { ALL_AMENITIES } from '~/mock/listings';

const store = useSearchStore();
const { filters, filterModalOpen } = storeToRefs(store);

const STEPPERS = [
  { key: 'bedrooms' as const, label: 'Bedrooms' },
  { key: 'bathrooms' as const, label: 'Bathrooms' },
];

function step(key: 'bedrooms' | 'bathrooms', delta: number) {
  filters.value[key] = Math.max(0, filters.value[key] + delta);
}

function apply() {
  store.runSearch();
  store.closeFilterModal();
}
</script>

<template>
  <Dialog :open="filterModalOpen" @update:open="(v) => { if (!v) store.closeFilterModal(); }">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Filters</DialogTitle>
      </DialogHeader>

      <div class="space-y-6">
        <div>
          <p class="mb-2 text-sm font-semibold">Price per night</p>
          <div class="flex items-center gap-3">
            <Input v-model.number="filters.priceFrom" type="number" min="0" placeholder="From" />
            <span class="text-muted-foreground">–</span>
            <Input v-model.number="filters.priceTo" type="number" min="0" placeholder="To" />
          </div>
        </div>

        <div>
          <p class="mb-2 text-sm font-semibold">Rooms &amp; beds</p>
          <div class="space-y-2">
            <div v-for="s in STEPPERS" :key="s.key" class="flex items-center justify-between">
              <span class="text-sm">{{ s.label }}</span>
              <div class="flex items-center gap-3">
                <Button variant="outline" size="icon" class="size-8 rounded-full" @click="step(s.key, -1)">
                  <Minus class="size-3.5" />
                </Button>
                <span class="w-6 text-center text-sm">{{ filters[s.key] || 'Any' }}</span>
                <Button variant="outline" size="icon" class="size-8 rounded-full" @click="step(s.key, 1)">
                  <Plus class="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p class="mb-2 text-sm font-semibold">Amenities</p>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="amenity in ALL_AMENITIES" :key="amenity" class="flex items-center gap-2 text-sm">
              <Checkbox
                :model-value="filters.amenities.includes(amenity)"
                @update:model-value="store.toggleAmenity(amenity)"
              />
              {{ amenity }}
            </label>
          </div>
        </div>
      </div>

      <DialogFooter class="sm:justify-between">
        <Button variant="ghost" @click="store.clearFilters()">Clear all</Button>
        <Button @click="apply">Apply</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
