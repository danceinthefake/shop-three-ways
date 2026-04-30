<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { cartCount } from '../stores/cart';

const count = useStore(cartCount);
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-900">
    <span class="text-xs uppercase tracking-wider text-emerald-700">Vue</span>
    <span class="tabular-nums">{{ count }}</span>
  </span>
</template>
