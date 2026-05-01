<script lang="ts">
  import { cart, setQty } from '../stores/cart';

  let { id }: { id: number } = $props();

  const qty = $derived($cart[id]?.qty ?? 0);
</script>

<div class="inline-flex items-center rounded border border-slate-300 dark:border-slate-700">
  <button
    type="button"
    onclick={() => setQty(id, qty - 1)}
    class="px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
    aria-label="Decrease"
  >−</button>
  <input
    type="number"
    min={0}
    value={qty}
    onchange={(e) => setQty(id, Number(e.currentTarget.value))}
    class="w-12 border-x border-slate-300 dark:border-slate-700 px-2 py-1 text-center tabular-nums focus:outline-none"
  />
  <button
    type="button"
    onclick={() => setQty(id, qty + 1)}
    class="px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
    aria-label="Increase"
  >+</button>
</div>
