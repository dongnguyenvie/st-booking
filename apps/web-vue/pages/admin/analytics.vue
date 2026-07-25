<script setup lang="ts">
import { Eye, Users, MousePointerClick, Clock } from 'lucide-vue-next';
import type { Component } from 'vue';

definePageMeta({ layout: 'admin' });

interface PageStat { page: string; views: number; sessions: number; }
interface Metric { title: string; value: string; change: string; icon: Component; }

const metrics: Metric[] = [
  { title: 'Page Views', value: '24,521', change: '+12%', icon: Eye },
  { title: 'Unique Visitors', value: '8,340', change: '+5%', icon: Users },
  { title: 'Click-Through Rate', value: '3.2%', change: '-0.4%', icon: MousePointerClick },
  { title: 'Avg. Session', value: '2m 14s', change: '+8%', icon: Clock },
];

const topPages: PageStat[] = [
  { page: '/pos/dashboard', views: 6210, sessions: 3100 },
  { page: '/admin/users', views: 4830, sessions: 2400 },
  { page: '/pos/checkout', views: 3920, sessions: 1950 },
  { page: '/admin/dashboard', views: 3100, sessions: 1600 },
  { page: '/pos/orders', views: 2540, sessions: 1200 },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Analytics</h1>
    <p class="mt-1 text-gray-500">Traffic and engagement overview</p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="metric in metrics" :key="metric.title">
        <CardContent class="flex items-center gap-4 p-5">
          <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <component :is="metric.icon" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ metric.title }}</p>
            <p class="text-2xl font-bold">{{ metric.value }}</p>
            <p
              class="text-xs"
              :class="metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'"
            >
              {{ metric.change }} vs last month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="mt-8">
      <h2 class="mb-4 text-lg font-semibold">Top Pages</h2>
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
              <TableRow v-for="row in topPages" :key="row.page">
                <TableCell>
                  <code class="text-sm text-primary">{{ row.page }}</code>
                </TableCell>
                <TableCell>{{ row.views }}</TableCell>
                <TableCell>{{ row.sessions }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
