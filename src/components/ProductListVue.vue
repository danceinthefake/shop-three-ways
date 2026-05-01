<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { PRODUCTS_URL, type Product } from '../data/products';
import AddToCartButtonVue from './AddToCartButtonVue.vue';

const products = ref<Product[]>([]);
const status = ref<'loading' | 'ready' | 'error'>('loading');
const query = ref('');

onMounted(async () => {
  try {
    const r = await fetch(PRODUCTS_URL);
    products.value = (await r.json()) as Product[];
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
  <p v-if="status === 'loading'" class="text-slate-500">Loading…</p>
  <p v-else-if="status === 'error'" class="text-red-600">Failed to load products.</p>
  <div v-else class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <input
        type="search"
        v-model="query"
        placeholder="Search products…"
        class="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      />
      <span class="text-xs text-slate-500 tabular-nums">
        {{ filtered.length }} of {{ products.length }}
      </span>
    </div>

    <p v-if="filtered.length === 0" class="text-sm text-slate-500">
      No products match "{{ query }}".
    </p>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      <article
        v-for="p in filtered"
        :key="p.id"
        class="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white"
      >
        <img :src="p.images[0]" :alt="p.title" loading="lazy" class="aspect-square w-full object-cover" />
        <div class="flex flex-1 flex-col gap-1 p-3">
          <span class="font-semibold">{{ p.title }}</span>
          <span class="tabular-nums text-blue-700">${{ p.price }}</span>
          <span class="line-clamp-2 text-sm text-slate-500">{{ p.description }}</span>
          <div class="mt-2 flex items-center justify-between gap-2">
            <AddToCartButtonVue :product="p" />
            <a :href="`/products/${p.slug}`" class="text-xs text-blue-700 hover:underline">details →</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
