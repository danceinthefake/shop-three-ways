<script lang="ts">
  import { cart, removeFromCart } from '../stores/cart';
  import QuantityStepperSvelte from './QuantityStepperSvelte.svelte';

  const items = $derived(Object.values($cart));
  const total = $derived(items.reduce((sum, i) => sum + i.price * i.qty, 0));
</script>

{#if items.length === 0}
  <p class="text-sm text-slate-500">Cart is empty.</p>
{:else}
  <div class="flex flex-col gap-3">
    {#each items as item (item.id)}
      <div class="flex items-center gap-3 rounded border border-slate-200 p-2">
        <img src={item.image} alt={item.title} class="h-12 w-12 shrink-0 rounded object-cover" />
        <div class="flex-1 truncate text-sm">{item.title}</div>
        <span class="tabular-nums text-blue-700">${item.price}</span>
        <QuantityStepperSvelte id={item.id} />
        <button
          type="button"
          onclick={() => removeFromCart(item.id)}
          class="text-xs text-slate-500 hover:text-red-600"
        >remove</button>
      </div>
    {/each}
    <div class="mt-2 flex justify-end gap-3 text-sm">
      <span class="text-slate-500">Total</span>
      <span class="tabular-nums font-semibold">${total.toFixed(2)}</span>
    </div>
  </div>
{/if}
