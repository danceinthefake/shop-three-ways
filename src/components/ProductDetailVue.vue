<script setup lang="ts">
import { ref } from 'vue';
import type { Product } from '../data/products';
import AddToCartButtonVue from './AddToCartButtonVue.vue';

const props = defineProps<{ product: Product }>();
const selected = ref(0);
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
      <img
        :src="props.product.images[selected]"
        :alt="props.product.title"
        class="aspect-square w-full rounded-lg border border-slate-200 bg-white object-cover"
      />
      <div v-if="props.product.images.length > 1" class="mt-2 flex gap-2">
        <button
          v-for="(src, i) in props.product.images"
          :key="src"
          type="button"
          @click="selected = i"
          :aria-label="`View image ${i + 1}`"
          :class="[
            'h-14 w-14 overflow-hidden rounded border-2',
            i === selected ? 'border-blue-600' : 'border-transparent',
          ]"
        >
          <img :src="src" alt="" class="h-full w-full object-cover" />
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <span class="text-xs uppercase tracking-wider text-slate-500">{{ props.product.category }}</span>
      <h2 class="text-2xl font-bold">{{ props.product.title }}</h2>
      <span class="text-xl tabular-nums text-blue-700">${{ props.product.price }}</span>
      <p class="text-sm leading-relaxed text-slate-600">{{ props.product.description }}</p>
      <div class="mt-2">
        <AddToCartButtonVue :product="props.product" />
      </div>
    </div>
  </div>
</template>
