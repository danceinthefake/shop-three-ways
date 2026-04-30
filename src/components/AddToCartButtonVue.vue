<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { cart, addToCart } from '../stores/cart';
import type { Product } from '../data/products';

const props = defineProps<{ product: Product }>();

const $cart = useStore(cart);
const qty = computed(() => $cart.value[props.product.id]?.qty ?? 0);
</script>

<template>
  <button
    type="button"
    @click="addToCart(props.product)"
    class="rounded bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-800"
  >
    {{ qty > 0 ? `In cart · ${qty}` : 'Add to cart' }}
  </button>
</template>
