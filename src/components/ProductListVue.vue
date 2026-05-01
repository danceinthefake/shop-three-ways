<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchProducts, type Product } from '../data/products';
import AddToCartButtonVue from './AddToCartButtonVue.vue';
import WishlistButtonVue from './WishlistButtonVue.vue';

const products = ref<Product[]>([]);
const status = ref<'loading' | 'ready' | 'error'>('loading');
const query = ref('');

onMounted(async () => {
  try {
    products.value = await fetchProducts();
    status.value = 'ready';
  } catch {
    status.value = 'error';
  }
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return products.value;
  return products.value.filter((p) => p.title.toLowerCase().includes(q));
});
</script>

<template>
  <div v-if="status === 'loading'" class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
    <article
      v-for="i in 8"
      :key="i"
      class="flex animate-pulse flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <div class="aspect-square w-full bg-slate-200 dark:bg-slate-700" />
      <div class="flex flex-col gap-2 p-3">
        <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div class="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div class="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div class="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </article>
  </div>
  <p v-else-if="status === 'error'" class="text-red-600">Failed to load products.</p>
  <div v-else class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <input
        type="search"
        v-model="query"
        placeholder="Search products…"
        class="flex-1 rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      />
      <span class="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
        {{ filtered.length }} of {{ products.length }}
      </span>
    </div>

    <p v-if="filtered.length === 0" class="text-sm text-slate-500 dark:text-slate-400">
      No products match "{{ query }}".
    </p>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      <article
        v-for="p in filtered"
        :key="p.id"
        class="flex flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <img :src="p.thumbnail" :alt="p.title" loading="lazy" class="aspect-square w-full object-cover" />
        <div class="flex flex-1 flex-col gap-1 p-3">
          <span class="font-semibold">{{ p.title }}</span>
          <span class="tabular-nums text-blue-700 dark:text-blue-400">${{ p.price }}</span>
          <span class="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{{ p.description }}</span>
          <div class="mt-2 flex items-center gap-2">
            <AddToCartButtonVue :product="p" />
            <WishlistButtonVue :id="p.id" />
            <a :href="`/products/${p.slug}`" class="ml-auto text-xs text-blue-700 dark:text-blue-400 hover:underline">details →</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
