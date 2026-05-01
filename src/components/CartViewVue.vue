<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { cart, removeFromCart } from '../stores/cart';
import QuantityStepperVue from './QuantityStepperVue.vue';

const $cart = useStore(cart);
const items = computed(() => Object.values($cart.value));
const total = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * i.qty, 0),
);
</script>

<template>
  <p v-if="items.length === 0" class="text-sm text-slate-500">Cart is empty.</p>
  <div v-else class="flex flex-col gap-3">
    <div
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-3 rounded border border-slate-200 p-2"
    >
      <img :src="item.image" :alt="item.title" class="h-12 w-12 shrink-0 rounded object-cover" />
      <div class="flex-1 truncate text-sm">{{ item.title }}</div>
      <span class="tabular-nums text-blue-700">${{ item.price }}</span>
      <QuantityStepperVue :id="item.id" />
      <button
        type="button"
        @click="removeFromCart(item.id)"
        class="text-xs text-slate-500 hover:text-red-600"
      >remove</button>
    </div>
    <div class="mt-2 flex justify-end gap-3 text-sm">
      <span class="text-slate-500">Total</span>
      <span class="tabular-nums font-semibold">${{ total.toFixed(2) }}</span>
    </div>
  </div>
</template>
