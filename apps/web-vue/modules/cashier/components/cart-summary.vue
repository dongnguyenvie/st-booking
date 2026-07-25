<script setup lang="ts">
import { CreditCard } from 'lucide-vue-next';
import { useCartStore } from '~/modules/cashier/stores/cart-store';

const cartStore = useCartStore();
</script>

<template>
  <div class="flex h-full flex-col p-4">
    <h2 class="text-lg font-semibold">Cart</h2>

    <div v-if="cartStore.items.length === 0" class="flex flex-1 items-center justify-center">
      <p class="text-sm text-gray-400">Cart is empty</p>
    </div>

    <div v-else class="flex-1 space-y-2 overflow-auto py-4">
      <div
        v-for="item in cartStore.items"
        :key="item.productId"
        class="flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-800"
      >
        <div>
          <p class="text-sm font-medium">{{ item.name }}</p>
          <p class="text-xs text-gray-500">x{{ item.quantity }}</p>
        </div>
        <p class="text-sm font-medium">${{ (item.price * item.quantity).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Total + checkout -->
    <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
      <div class="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${{ cartStore.total.toFixed(2) }}</span>
      </div>
      <Button class="mt-3 w-full" :disabled="cartStore.items.length === 0">
        <CreditCard class="mr-2 size-4" />
        Checkout
      </Button>
    </div>
  </div>
</template>
