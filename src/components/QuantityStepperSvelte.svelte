<script lang="ts">
  import { cart, setQty } from '../stores/cart';

  let { id }: { id: number } = $props();

  const qty = $derived($cart[id]?.qty ?? 0);
</script>

<div class="inline-flex items-center rounded border border-slate-300">
  <button
    type="button"
    onclick={() => setQty(id, qty - 1)}
    class="px-2 py-1 text-slate-700 hover:bg-slate-100"
    aria-label="Decrease"
  >−</button>
  <input
    type="number"
    min={0}
    bind:value={() => qty, (v) => setQty(id, Number(v))}
    class="w-12 border-x border-slate-300 px-2 py-1 text-center tabular-nums focus:outline-none"
  />
  <button
    type="button"
    onclick={() => setQty(id, qty + 1)}
    class="px-2 py-1 text-slate-700 hover:bg-slate-100"
    aria-label="Increase"
  >+</button>
</div>
