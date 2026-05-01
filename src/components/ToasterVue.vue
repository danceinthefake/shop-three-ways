<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { toasts, dismissToast } from '../stores/toasts';
import ToastVue from './ToastVue.vue';

const list = useStore(toasts);
</script>

<template>
  <TransitionGroup
    name="toast"
    tag="div"
    class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2"
  >
    <div v-for="t in list" :key="t.id" class="pointer-events-auto toast-item">
      <ToastVue :variant="t.variant" :on-dismiss="() => dismissToast(t.id)">
        <strong v-if="t.title" class="block">{{ t.title }}</strong>
        <span>{{ t.message }}</span>
      </ToastVue>
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: transform 200ms ease, opacity 200ms ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-active {
  position: absolute;
  right: 0;
}
</style>
