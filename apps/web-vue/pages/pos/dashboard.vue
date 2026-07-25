<script setup lang="ts">
import { ShoppingCart, Receipt } from 'lucide-vue-next';

definePageMeta({ layout: 'pos' });

const { user } = useAuth();
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">POS Dashboard</h1>
    <p class="mt-1 text-gray-500">Welcome, {{ user?.name }}</p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center gap-2 pb-2">
          <ShoppingCart class="size-5" />
          <CardTitle class="text-base">New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">Start a new order for a customer</p>
        </CardContent>
        <CardFooter>
          <Button as-child class="w-full">
            <NuxtLink to="/pos/orders">Open POS</NuxtLink>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center gap-2 pb-2">
          <Receipt class="size-5" />
          <CardTitle class="text-base">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">View and manage recent orders</p>
        </CardContent>
        <CardFooter>
          <Button as-child variant="outline" class="w-full">
            <NuxtLink to="/pos/checkout">View History</NuxtLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
