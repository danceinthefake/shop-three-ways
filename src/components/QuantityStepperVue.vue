<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { cart, setQty } from '../stores/cart';

const props = defineProps<{ id: number }>();
const $cart = useStore(cart);

// Writable computed = the Vue idiom for v-model on derived state.
const qty = computed<number>({
  get: () => $cart.value[props.id]?.qty ?? 0,
  set: (v) => setQty(props.id, v),
});
</script>

<template>
  <div class="inline-flex items-center rounded border border-slate-300 dark:border-slate-700">
    <button
      type="button"
      @click="qty -= 1"
      class="px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Decrease"
    >−</button>
    <input
      type="number"
      :min="0"
      v-model.lazy.number="qty"
      class="w-12 border-x border-slate-300 dark:border-slate-700 px-2 py-1 text-center tabular-nums focus:outline-none"
    />
    <button
      type="button"
      @click="qty += 1"
      class="px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Increase"
    >+</button>
  </div>
</template>
