<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PRODUCTS_URL, type Product } from '../data/products';
import AddToCartButtonVue from './AddToCartButtonVue.vue';

const products = ref<Product[]>([]);
const status = ref<'loading' | 'ready' | 'error'>('loading');

onMounted(async () => {
  try {
    const r = await fetch(PRODUCTS_URL);
    products.value = (await r.json()) as Product[];
    status.value = 'ready';
  } catch {
    status.value = 'error';
  }
});
</script>

<template>
  <p v-if="status === 'loading'" class="text-slate-500">Loading…</p>
  <p v-else-if="status === 'error'" class="text-red-600">Failed to load products.</p>
  <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
    <article
      v-for="p in products"
      :key="p.id"
      class="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white"
    >
      <img :src="p.images[0]" :alt="p.title" loading="lazy" class="aspect-square w-full object-cover" />
      <div class="flex flex-1 flex-col gap-1 p-3">
        <span class="font-semibold">{{ p.title }}</span>
        <span class="tabular-nums text-blue-700">${{ p.price }}</span>
        <span class="line-clamp-2 text-sm text-slate-500">{{ p.description }}</span>
        <div class="mt-2">
          <AddToCartButtonVue :product="p" />
        </div>
      </div>
    </article>
  </div>
</template>
