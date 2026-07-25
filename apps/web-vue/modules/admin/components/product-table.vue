<script setup lang="ts">
interface Product { id: string; name: string; price: number; category: string; }

// TODO: Replace with villus useQuery once codegen is available
const products = ref<Product[]>([]);
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="products.length === 0">
            <TableCell colspan="3" class="text-center text-gray-400">
              No products found. Connect to API to load data.
            </TableCell>
          </TableRow>
          <TableRow v-for="product in products" :key="product.id">
            <TableCell>{{ product.name }}</TableCell>
            <TableCell>{{ product.price }}</TableCell>
            <TableCell>{{ product.category }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
