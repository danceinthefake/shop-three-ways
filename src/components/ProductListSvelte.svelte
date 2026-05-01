<script lang="ts">
  import { fetchProducts } from '../data/products';
  import AddToCartButtonSvelte from './AddToCartButtonSvelte.svelte';
  import WishlistButtonSvelte from './WishlistButtonSvelte.svelte';

  // Kicked off once at component setup. {#await} subscribes the template to
  // its three states (pending / fulfilled / rejected) — no useState, no
  // useEffect, no cancelled-flag bookkeeping.
  const productsPromise = fetchProducts();

  let query = $state('');
</script>

{#await productsPromise}
  <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
    {#each Array(8) as _, i (i)}
      <article class="flex animate-pulse flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div class="aspect-square w-full bg-slate-200 dark:bg-slate-700"></div>
        <div class="flex flex-col gap-2 p-3">
          <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div class="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div class="h-3 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
          <div class="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800"></div>
        </div>
      </article>
    {/each}
  </div>
{:then products}
  {@const q = query.trim().toLowerCase()}
  {@const filtered = q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products}
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <input
        type="search"
        bind:value={query}
        placeholder="Search products…"
        class="flex-1 rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      />
      <span class="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
        {filtered.length} of {products.length}
      </span>
    </div>

    {#if filtered.length === 0}
      <p class="text-sm text-slate-500 dark:text-slate-400">No products match "{query}".</p>
    {:else}
      <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {#each filtered as p (p.id)}
          <article class="flex flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <img src={p.thumbnail} alt={p.title} loading="lazy" class="aspect-square w-full object-cover" />
            <div class="flex flex-1 flex-col gap-1 p-3">
              <span class="font-semibold">{p.title}</span>
              <span class="tabular-nums text-blue-700 dark:text-blue-400">${p.price}</span>
              <span class="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{p.description}</span>
              <div class="mt-2 flex items-center gap-2">
                <AddToCartButtonSvelte product={p} />
                <WishlistButtonSvelte id={p.id} />
                <a href={`/products/${p.slug}`} class="ml-auto text-xs text-blue-700 dark:text-blue-400 hover:underline">details →</a>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </div>
{:catch}
  <p class="text-red-600">Failed to load products.</p>
{/await}
