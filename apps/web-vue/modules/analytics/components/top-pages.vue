<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAnalyticsStore } from '~/stores/analytics/analytics-store';

const store = useAnalyticsStore();
const { topPages } = storeToRefs(store);
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Sessions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="topPages.length === 0">
            <TableCell colspan="3" class="text-center text-gray-400">No traffic recorded.</TableCell>
          </TableRow>
          <TableRow v-for="row in topPages" :key="row.page">
            <TableCell>
              <code class="text-sm text-primary">{{ row.page }}</code>
            </TableCell>
            <TableCell>{{ row.views.toLocaleString() }}</TableCell>
            <TableCell>{{ row.sessions.toLocaleString() }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
