<script lang="ts">
  import { toasts, dismissToast } from '../stores/toasts';
  import ToastSvelte from './ToastSvelte.svelte';
</script>

<div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
  {#each $toasts as t (t.id)}
    <div class="pointer-events-auto">
      <ToastSvelte variant={t.variant} onDismiss={() => dismissToast(t.id)}>
        {#if t.title}<strong class="block">{t.title}</strong>{/if}
        <span>{t.message}</span>
      </ToastSvelte>
    </div>
  {/each}
</div>
