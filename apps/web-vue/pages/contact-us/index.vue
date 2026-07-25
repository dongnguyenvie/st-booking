<script setup lang="ts">
definePageMeta({ layout: 'public' });
useHead({ title: 'Contact us — Canmore Stays' });
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10">
    <h1 class="text-2xl font-bold text-primary">Contact Us</h1>

    <div class="mt-8 grid gap-12 lg:grid-cols-2">
      <ContactUsEnquiryForm />
      <ContactUsCompanyDetails />
    </div>
  </div>
</template>
