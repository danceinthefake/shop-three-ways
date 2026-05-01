<script lang="ts">
  import { fetchProducts, type Product } from '../data/products';

  const SCROLL_STEP = 240;

  let products = $state<Product[]>([]);
  let status = $state<'loading' | 'ready' | 'error'>('loading');
  let scroller: HTMLDivElement | undefined = $state();

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

  function scroll(dir: -1 | 1) {
    scroller?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' });
  }
</script>

{#if status === 'loading'}
  <p class="text-slate-500">Loading…</p>
{:else if status === 'error'}
  <p class="text-red-600">Failed to load products.</p>
{:else}
  <div class="relative">
    <button
      type="button"
      onclick={() => scroll(-1)}
      aria-label="Scroll left"
      class="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
    >‹</button>
    <div
      bind:this={scroller}
      class="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
    >
      {#each products as p (p.id)}
        <a
          href={`/products/${p.slug}`}
          class="flex w-52 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-slate-200 bg-white hover:border-blue-300"
        >
          <img src={p.thumbnail} alt={p.title} loading="lazy" class="aspect-square w-full object-cover" />
          <div class="flex flex-col gap-1 p-3">
            <span class="truncate text-sm font-semibold">{p.title}</span>
            <span class="tabular-nums text-blue-700">${p.price}</span>
          </div>
        </a>
      {/each}
    </div>
    <button
      type="button"
      onclick={() => scroll(1)}
      aria-label="Scroll right"
      class="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
    >›</button>
  </div>
{/if}
