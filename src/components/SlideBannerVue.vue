<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { promos, SLIDE_INTERVAL_MS } from '../data/promos';

const i = ref(0);
let timerId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  timerId = setInterval(() => {
    i.value = (i.value + 1) % promos.length;
  }, SLIDE_INTERVAL_MS);
});

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});
</script>

<template>
  <div class="relative h-48 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
    <img :src="promos[i].image" alt="" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-black/40" />
    <div class="relative flex h-full flex-col justify-end gap-1 p-4 text-white">
      <h3 class="text-lg font-semibold">{{ promos[i].title }}</h3>
      <p class="text-sm opacity-90">{{ promos[i].subtitle }}</p>
    </div>
    <div class="absolute bottom-2 right-2 flex gap-1">
      <button
        v-for="(p, idx) in promos"
        :key="p.id"
        type="button"
        @click="i = idx"
        :aria-label="`Go to slide ${idx + 1}`"
        :class="[
          'h-2 w-2 rounded-full transition',
          idx === i ? 'bg-white' : 'bg-white/40',
        ]"
      />
    </div>
  </div>
</template>
