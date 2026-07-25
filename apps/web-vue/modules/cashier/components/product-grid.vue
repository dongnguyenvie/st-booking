<script setup lang="ts">
import { Search } from 'lucide-vue-next';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Espresso', price: 2.50, category: 'Coffee', emoji: '☕' },
  { id: 'p2', name: 'Latte', price: 4.00, category: 'Coffee', emoji: '🥛' },
  { id: 'p3', name: 'Cappuccino', price: 3.75, category: 'Coffee', emoji: '☕' },
  { id: 'p4', name: 'Cold Brew', price: 4.50, category: 'Coffee', emoji: '🧊' },
  { id: 'p5', name: 'Green Tea', price: 2.75, category: 'Tea', emoji: '🍵' },
  { id: 'p6', name: 'Chai Latte', price: 3.50, category: 'Tea', emoji: '🫖' },
  { id: 'p7', name: 'Orange Juice', price: 3.25, category: 'Juice', emoji: '🍊' },
  { id: 'p8', name: 'Apple Juice', price: 3.00, category: 'Juice', emoji: '🍎' },
  { id: 'p9', name: 'Smoothie', price: 5.00, category: 'Juice', emoji: '🥤' },
  { id: 'p10', name: 'Croissant', price: 2.50, category: 'Snack', emoji: '🥐' },
  { id: 'p11', name: 'Muffin', price: 2.25, category: 'Snack', emoji: '🧁' },
  { id: 'p12', name: 'Sandwich', price: 5.50, category: 'Snack', emoji: '🥪' },
  { id: 'p13', name: 'Cheesecake', price: 4.75, category: 'Dessert', emoji: '🍰' },
  { id: 'p14', name: 'Brownie', price: 3.00, category: 'Dessert', emoji: '🍫' },
  { id: 'p15', name: 'Ice Cream', price: 3.50, category: 'Dessert', emoji: '🍦' },
  { id: 'p16', name: 'Water', price: 1.00, category: 'Other', emoji: '💧' },
];

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Juice', 'Snack', 'Dessert', 'Other'];

const search = ref('');
const activeCategory = ref('All');

const filtered = computed(() => {
  let list = MOCK_PRODUCTS;
  if (activeCategory.value !== 'All') {
    list = list.filter((p) => p.category === activeCategory.value);
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  return list;
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input v-model="search" placeholder="Search products..." class="pl-9" />
    </div>

    <div class="flex flex-wrap gap-2">
      <Button
        v-for="cat in CATEGORIES"
        :key="cat"
        size="sm"
        :variant="activeCategory === cat ? 'default' : 'outline'"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </Button>
    </div>

    <div v-if="filtered.length === 0" class="flex h-40 items-center justify-center text-gray-400">
      No products found.
    </div>

    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Card
        v-for="product in filtered"
        :key="product.id"
        class="cursor-pointer transition-shadow hover:shadow-md"
        @click="emit('addToCart', product)"
      >
        <CardContent class="flex flex-col items-center gap-1 p-3 text-center">
          <span class="text-3xl">{{ product.emoji }}</span>
          <p class="text-sm font-medium leading-tight">{{ product.name }}</p>
          <p class="text-xs text-gray-500">${{ product.price.toFixed(2) }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
