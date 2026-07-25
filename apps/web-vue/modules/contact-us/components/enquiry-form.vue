<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContactUsStore } from '~/stores/contact-us/contact-us-store';
import { ROUTES } from '~/config/routes';

const store = useContactUsStore();
const { form, submitted, submitting, canSubmit } = storeToRefs(store);
</script>

<template>
  <form class="max-w-xl space-y-5" @submit.prevent="store.submit()">
    <p class="text-sm">Feel free to contact us using the form below</p>

    <div
      v-if="submitted"
      class="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
    >
      Thanks — we've received your message and will be in touch shortly.
    </div>

    <label class="block text-sm">
      <span class="mb-1 block font-semibold">Name</span>
      <Input v-model="form.name" placeholder="Name" required />
    </label>

    <label class="block text-sm">
      <span class="mb-1 block font-semibold">Email</span>
      <Input v-model="form.email" type="email" placeholder="Email" required />
    </label>

    <label class="block text-sm">
      <span class="mb-1 block font-semibold">Phone number</span>
      <Input v-model="form.phone" type="tel" placeholder="+1" />
    </label>

    <label class="block text-sm">
      <span class="sr-only">Message</span>
      <textarea
        v-model="form.message"
        rows="4"
        required
        placeholder="Write something"
        class="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>

    <label class="flex items-center gap-2 text-sm">
      <Checkbox
        v-model="form.agreedToTerms"
      />
      <span>
        I agree to the
        <NuxtLink :to="ROUTES.public.privacy" class="font-semibold underline">Privacy Policy</NuxtLink>
        and
        <NuxtLink :to="ROUTES.public.terms" class="font-semibold underline">Terms of Service</NuxtLink>
      </span>
    </label>

    <Button type="submit" class="rounded-full" :disabled="!canSubmit">
      {{ submitting ? 'Sending…' : 'Send' }}
    </Button>
  </form>
</template>
