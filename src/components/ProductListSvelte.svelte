<script lang="ts">
  import { PRODUCTS_URL, type Product } from '../data/products';
  import AddToCartButtonSvelte from './AddToCartButtonSvelte.svelte';

  let products = $state<Product[]>([]);
  let status = $state<'loading' | 'ready' | 'error'>('loading');

  $effect(() => {
    let cancelled = false;
    fetch(PRODUCTS_URL)
      .then((r) => r.json() as Promise<Product[]>)
      .then((data) => {
        if (!cancelled) {
          products = data;
          status = 'ready';
        }
      })
      .catch(() => {
        if (!cancelled) status = 'error';
      });
    return () => {
      cancelled = true;
    };
  });
</script>

{#if status === 'loading'}
  <p class="text-slate-500">Loading…</p>
{:else if status === 'error'}
  <p class="text-red-600">Failed to load products.</p>
{:else}
  <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
    {#each products as p (p.id)}
      <article class="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
        <img src={p.images[0]} alt={p.title} loading="lazy" class="aspect-square w-full object-cover" />
        <div class="flex flex-1 flex-col gap-1 p-3">
          <span class="font-semibold">{p.title}</span>
          <span class="tabular-nums text-blue-700">${p.price}</span>
          <span class="line-clamp-2 text-sm text-slate-500">{p.description}</span>
          <div class="mt-2">
            <AddToCartButtonSvelte product={p} />
          </div>
        </div>
      </article>
    {/each}
  </div>
{/if}
