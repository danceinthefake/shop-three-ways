<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { toasts, dismissToast } from '../stores/toasts';
import ToastVue from './ToastVue.vue';

const list = useStore(toasts);
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
    <div v-for="t in list" :key="t.id" class="pointer-events-auto">
      <ToastVue :variant="t.variant" :on-dismiss="() => dismissToast(t.id)">
        <strong v-if="t.title" class="block">{{ t.title }}</strong>
        <span>{{ t.message }}</span>
      </ToastVue>
    </div>
  </div>
</template>
