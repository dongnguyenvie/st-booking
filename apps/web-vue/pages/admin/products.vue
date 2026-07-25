<script setup lang="ts">
import { Plus } from 'lucide-vue-next';

definePageMeta({ layout: 'admin' });
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Product Management</h1>
      <Button>
        <Plus class="mr-2 size-4" />
        Add Product
      </Button>
    </div>

    <div class="mt-6">
      <AdminProductTable />
    </div>
  </div>
</template>
