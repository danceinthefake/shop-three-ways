<script lang="ts">
  import { fly } from 'svelte/transition';
  import { toasts, dismissToast } from '../stores/toasts';
  import ToastSvelte from './ToastSvelte.svelte';
</script>

<div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-72 flex-col gap-2">
  {#each $toasts as t (t.id)}
    <div
      class="pointer-events-auto"
      transition:fly={{ x: 20, duration: 200 }}
    >
      <ToastSvelte variant={t.variant} onDismiss={() => dismissToast(t.id)}>
        {#if t.title}<strong class="block">{t.title}</strong>{/if}
        <span>{t.message}</span>
      </ToastSvelte>
    </div>
  {/each}
</div>
