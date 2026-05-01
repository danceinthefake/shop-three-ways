<script setup lang="ts">
import { computed, ref } from 'vue';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls = 'rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none';

const name = ref('');
const email = ref('');
const address = ref('');
const city = ref('');
const zip = ref('');
const tried = ref(false);
const submitted = ref(false);

const errors = computed(() => {
  const e: Record<string, string> = {};
  if (name.value.trim().length < 2) e.name = 'Name is required.';
  if (!EMAIL_RE.test(email.value)) e.email = 'Valid email required.';
  if (!address.value.trim()) e.address = 'Address is required.';
  if (!city.value.trim()) e.city = 'City is required.';
  if (zip.value.trim().length < 4) e.zip = 'Zip is required.';
  return e;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

function handleSubmit() {
  tried.value = true;
  if (isValid.value) submitted.value = true;
}

const showError = (key: string) => (tried.value ? errors.value[key] : undefined);
</script>

<template>
  <div
    v-if="submitted"
    class="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900"
  >
    Order placed (mock). Thanks, {{ name }}.
  </div>
  <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-2" novalidate>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600">Name</span>
      <input :class="inputCls" v-model="name" />
      <span v-if="showError('name')" class="text-xs text-red-600">{{ showError('name') }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600">Email</span>
      <input :class="inputCls" type="email" v-model="email" />
      <span v-if="showError('email')" class="text-xs text-red-600">{{ showError('email') }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600">Address</span>
      <input :class="inputCls" v-model="address" />
      <span v-if="showError('address')" class="text-xs text-red-600">{{ showError('address') }}</span>
    </label>
    <div class="grid grid-cols-2 gap-2">
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600">City</span>
        <input :class="inputCls" v-model="city" />
        <span v-if="showError('city')" class="text-xs text-red-600">{{ showError('city') }}</span>
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600">Zip</span>
        <input :class="inputCls" v-model="zip" />
        <span v-if="showError('zip')" class="text-xs text-red-600">{{ showError('zip') }}</span>
      </label>
    </div>
    <button
      type="submit"
      class="mt-2 self-start rounded bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      :disabled="tried && !isValid"
    >
      Place order
    </button>
  </form>
</template>
