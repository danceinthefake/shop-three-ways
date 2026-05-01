<script lang="ts">
  import { fetchProducts, type Product } from '../data/products';
  import AddToCartButtonSvelte from './AddToCartButtonSvelte.svelte';

  let products = $state<Product[]>([]);
  let status = $state<'loading' | 'ready' | 'error'>('loading');
  let query = $state('');

  $effect(() => {
    let cancelled = false;
    fetchProducts()
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

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  });
</script>

{#if status === 'loading'}
  <p class="text-slate-500">Loading…</p>
{:else if status === 'error'}
  <p class="text-red-600">Failed to load products.</p>
{:else}
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <input
        type="search"
        bind:value={query}
        placeholder="Search products…"
        class="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      />
      <span class="text-xs text-slate-500 tabular-nums">
        {filtered.length} of {products.length}
      </span>
    </div>

    {#if filtered.length === 0}
      <p class="text-sm text-slate-500">No products match "{query}".</p>
    {:else}
      <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {#each filtered as p (p.id)}
          <article class="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
            <img src={p.thumbnail} alt={p.title} loading="lazy" class="aspect-square w-full object-cover" />
            <div class="flex flex-1 flex-col gap-1 p-3">
              <span class="font-semibold">{p.title}</span>
              <span class="tabular-nums text-blue-700">${p.price}</span>
              <span class="line-clamp-2 text-sm text-slate-500">{p.description}</span>
              <div class="mt-2 flex items-center justify-between gap-2">
                <AddToCartButtonSvelte product={p} />
                <a href={`/products/${p.slug}`} class="text-xs text-blue-700 hover:underline">details →</a>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
{/if}
