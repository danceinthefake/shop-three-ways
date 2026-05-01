<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import { cart, removeFromCart } from '../stores/cart';
  import QuantityStepperSvelte from './QuantityStepperSvelte.svelte';

  const items = $derived(Object.values($cart));
  const total = $derived(items.reduce((sum, i) => sum + i.price * i.qty, 0));
</script>

{#if items.length === 0}
  <p class="text-sm text-slate-500 dark:text-slate-400">Cart is empty.</p>
{:else}
  <div class="flex flex-col gap-3">
    {#each items as item (item.id)}
      <div
        class="flex flex-wrap items-center gap-3 rounded border border-slate-200 dark:border-slate-800 p-2"
        animate:flip={{ duration: 200 }}
        transition:fade={{ duration: 150 }}
      >
        <img src={item.image} alt={item.title} class="h-12 w-12 shrink-0 rounded object-cover" />
        <div class="min-w-0 flex-1 truncate text-sm">{item.title}</div>
        <span class="shrink-0 tabular-nums text-blue-700 dark:text-blue-400">${item.price}</span>
        <div class="ml-auto flex shrink-0 items-center gap-3">
          <QuantityStepperSvelte id={item.id} />
          <button
            type="button"
            onclick={() => removeFromCart(item.id)}
            class="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600"
          >remove</button>
        </div>
      </div>
    {/each}
    <div class="mt-2 flex justify-end gap-3 text-sm">
      <span class="text-slate-500 dark:text-slate-400">Total</span>
      <span class="tabular-nums font-semibold">${total.toFixed(2)}</span>
    </div>
  </div>
{/if}
