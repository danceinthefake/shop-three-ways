<script setup lang="ts">
import type { ToastVariant } from '../stores/toasts';

const props = withDefaults(
  defineProps<{
    variant?: ToastVariant;
    onDismiss?: () => void;
  }>(),
  { variant: 'info', onDismiss: undefined },
);

const variantClasses: Record<ToastVariant, string> = {
  info: 'border-slate-200 bg-white text-slate-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  wishlist: 'border-rose-200 bg-rose-50 text-rose-900',
};
</script>

<template>
  <div
    role="status"
    :class="[
      'flex items-start gap-3 rounded-md border px-3 py-2 text-sm shadow-md',
      variantClasses[props.variant],
    ]"
  >
    <div class="flex-1">
      <slot />
    </div>
    <button
      v-if="props.onDismiss"
      type="button"
      @click="props.onDismiss?.()"
      aria-label="Dismiss"
      class="text-slate-400 hover:text-slate-700"
    >✕</button>
  </div>
</template>
