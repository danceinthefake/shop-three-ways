<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@nanostores/vue';
import { cart } from '../stores/cart';
import { shippingOptions, effectiveShippingFee } from '../data/shipping';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls = 'rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none';

const $cart = useStore(cart);
const subtotal = computed(() =>
  Object.values($cart.value).reduce((s, i) => s + i.price * i.qty, 0),
);

const name = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');
const city = ref('');
const zip = ref('');
const shipping = ref('');
const tried = ref(false);
const submitted = ref(false);

const errors = computed(() => {
  const e: Record<string, string> = {};
  if (name.value.trim().length < 2) e.name = 'Name is required.';
  if (!EMAIL_RE.test(email.value)) e.email = 'Valid email required.';
  if (phone.value.replace(/\D/g, '').length < 10) e.phone = 'At least 10 digits.';
  if (!address.value.trim()) e.address = 'Address is required.';
  if (!city.value.trim()) e.city = 'City is required.';
  if (zip.value.trim().length < 4) e.zip = 'Zip is required.';
  if (!shippingOptions.some((o) => o.id === shipping.value)) e.shipping = 'Pick a shipping method.';
  return e;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

const selectedOption = computed(() =>
  shippingOptions.find((o) => o.id === shipping.value),
);
const shippingFee = computed(() =>
  selectedOption.value ? effectiveShippingFee(selectedOption.value, subtotal.value) : 0,
);
const total = computed(() => subtotal.value + shippingFee.value);

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
    <p class="mb-1 font-semibold">Order placed (mock).</p>
    <p>Thanks {{ name }}, shipping via {{ selectedOption?.name }} ({{ selectedOption?.eta }}).</p>
    <p class="mt-2 tabular-nums">Total charged: ${{ total.toFixed(2) }}</p>
  </div>
  <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-2" novalidate>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Name</span>
      <input :class="inputCls" v-model="name" />
      <span v-if="showError('name')" class="text-xs text-red-600">{{ showError('name') }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Email</span>
      <input :class="inputCls" type="email" v-model="email" />
      <span v-if="showError('email')" class="text-xs text-red-600">{{ showError('email') }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Phone</span>
      <input :class="inputCls" type="tel" v-model="phone" />
      <span v-if="showError('phone')" class="text-xs text-red-600">{{ showError('phone') }}</span>
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Address</span>
      <input :class="inputCls" v-model="address" />
      <span v-if="showError('address')" class="text-xs text-red-600">{{ showError('address') }}</span>
    </label>
    <div class="grid grid-cols-2 gap-2">
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600 dark:text-slate-300">City</span>
        <input :class="inputCls" v-model="city" />
        <span v-if="showError('city')" class="text-xs text-red-600">{{ showError('city') }}</span>
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600 dark:text-slate-300">Zip</span>
        <input :class="inputCls" v-model="zip" />
        <span v-if="showError('zip')" class="text-xs text-red-600">{{ showError('zip') }}</span>
      </label>
    </div>

    <fieldset class="mt-2 flex flex-col gap-1">
      <legend class="text-sm text-slate-600 dark:text-slate-300">Shipping</legend>
      <label
        v-for="opt in shippingOptions"
        :key="opt.id"
        class="flex items-center gap-2 text-sm"
      >
        <input
          type="radio"
          name="shipping-vue"
          :value="opt.id"
          v-model="shipping"
        />
        <span class="flex-1">
          {{ opt.name }}
          <span class="text-xs text-slate-500 dark:text-slate-400">· {{ opt.eta }}</span>
        </span>
        <span class="tabular-nums">
          {{ effectiveShippingFee(opt, subtotal) === 0 ? 'Free' : `$${effectiveShippingFee(opt, subtotal).toFixed(2)}` }}
        </span>
      </label>
      <span v-if="showError('shipping')" class="text-xs text-red-600">{{ showError('shipping') }}</span>
    </fieldset>

    <dl class="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-slate-200 dark:border-slate-800 pt-2 text-sm">
      <dt class="text-slate-600 dark:text-slate-300">Subtotal</dt>
      <dd class="tabular-nums">${{ subtotal.toFixed(2) }}</dd>
      <dt class="text-slate-600 dark:text-slate-300">Shipping</dt>
      <dd class="tabular-nums">
        {{ selectedOption ? (shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`) : '—' }}
      </dd>
      <dt class="font-semibold">Total</dt>
      <dd class="tabular-nums font-semibold">${{ total.toFixed(2) }}</dd>
    </dl>

    <button
      type="submit"
      class="mt-2 self-start rounded bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      :disabled="tried && !isValid"
    >
      Place order
    </button>
  </form>
</template>
