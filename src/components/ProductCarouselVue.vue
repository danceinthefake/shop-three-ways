<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchProducts, type Product } from '../data/products';

const SCROLL_STEP = 240;

const products = ref<Product[]>([]);
const status = ref<'loading' | 'ready' | 'error'>('loading');
const scroller = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  try {
    products.value = await fetchProducts();
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
  <div v-if="status === 'loading'" class="flex gap-3 overflow-hidden pb-2">
    <article
      v-for="i in 6"
      :key="i"
      class="flex w-52 shrink-0 animate-pulse flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <div class="aspect-square w-full bg-slate-200 dark:bg-slate-700" />
      <div class="flex flex-col gap-2 p-3">
        <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div class="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </article>
  </div>
  <p v-else-if="status === 'error'" class="text-red-600">Failed to load products.</p>
  <div v-else class="relative">
    <button
      type="button"
      @click="scroll(-1)"
      aria-label="Scroll left"
      class="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow hover:bg-slate-50 dark:hover:bg-slate-800"
    >‹</button>
    <div
      ref="scroller"
      class="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
    >
      <a
        v-for="p in products"
        :key="p.id"
        :href="`/products/${p.slug}`"
        class="flex w-52 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600"
      >
        <img :src="p.thumbnail" :alt="p.title" loading="lazy" class="aspect-square w-full object-cover" />
        <div class="flex flex-col gap-1 p-3">
          <span class="truncate text-sm font-semibold">{{ p.title }}</span>
          <span class="tabular-nums text-blue-700 dark:text-blue-400">${{ p.price }}</span>
        </div>
      </a>
    </div>
    <button
      type="button"
      @click="scroll(1)"
      aria-label="Scroll right"
      class="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow hover:bg-slate-50 dark:hover:bg-slate-800"
    >›</button>
  </div>
</template>
