<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PRODUCTS_URL, type Product } from '../data/products';

const SCROLL_STEP = 240;

const products = ref<Product[]>([]);
const status = ref<'loading' | 'ready' | 'error'>('loading');
const scroller = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  try {
    const r = await fetch(PRODUCTS_URL);
    products.value = (await r.json()) as Product[];
    status.value = 'ready';
  } catch {
    status.value = 'error';
  }
});

const scroll = (dir: -1 | 1) => {
  scroller.value?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' });
};
</script>

<template>
  <p v-if="status === 'loading'" class="text-slate-500">Loading…</p>
  <p v-else-if="status === 'error'" class="text-red-600">Failed to load products.</p>
  <div v-else class="relative">
    <button
      type="button"
      @click="scroll(-1)"
      aria-label="Scroll left"
      class="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
    >‹</button>
    <div
      ref="scroller"
      class="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
    >
      <article
        v-for="p in products"
        :key="p.id"
        class="flex w-52 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-slate-200 bg-white"
      >
        <img :src="p.images[0]" :alt="p.title" loading="lazy" class="aspect-square w-full object-cover" />
        <div class="flex flex-col gap-1 p-3">
          <span class="truncate text-sm font-semibold">{{ p.title }}</span>
          <span class="tabular-nums text-blue-700">${{ p.price }}</span>
        </div>
      </article>
    </div>
    <button
      type="button"
      @click="scroll(1)"
      aria-label="Scroll right"
      class="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
    >›</button>
  </div>
</template>
