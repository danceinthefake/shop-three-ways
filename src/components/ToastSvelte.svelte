<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ToastVariant } from '../stores/toasts';

  let {
    variant = 'info',
    onDismiss,
    children,
  }: {
    variant?: ToastVariant;
    onDismiss?: () => void;
    children: Snippet;
  } = $props();

  const variantClasses: Record<ToastVariant, string> = {
    info: 'border-slate-200 bg-white text-slate-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    wishlist: 'border-rose-200 bg-rose-50 text-rose-900',
  };
</script>

<div
  role="status"
  class={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm shadow-md ${variantClasses[variant]}`}
>
  <div class="flex-1">
    {@render children()}
  </div>
  {#if onDismiss}
    <button
      type="button"
      onclick={() => onDismiss?.()}
      aria-label="Dismiss"
      class="text-slate-400 hover:text-slate-700"
    >✕</button>
  {/if}
</div>
