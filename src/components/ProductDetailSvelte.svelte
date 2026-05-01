<script lang="ts">
  import type { Product } from '../data/products';
  import AddToCartButtonSvelte from './AddToCartButtonSvelte.svelte';

  let { product }: { product: Product } = $props();
  let selected = $state(0);
</script>

{#snippet stars(rating: number)}
  <span aria-label={`${rating.toFixed(1)} out of 5`} class="tracking-tight">
    {#each Array(5) as _, i (i)}
      <span class={i < Math.round(rating) ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600'}>★</span>
    {/each}
  </span>
{/snippet}

<div class="flex flex-col gap-8">
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
      <img
        src={product.images[selected]}
        alt={product.title}
        class="aspect-square w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 object-cover"
      />
      {#if product.images.length > 1}
        <div class="mt-2 flex gap-2">
          {#each product.images as src, i (src)}
            <button
              type="button"
              onclick={() => (selected = i)}
              aria-label={`View image ${i + 1}`}
              class={`h-14 w-14 overflow-hidden rounded border-2 ${
                i === selected ? 'border-blue-600' : 'border-transparent'
              }`}
            >
              <img {src} alt="" class="h-full w-full object-cover" />
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex flex-col gap-3">
      <span class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{product.category}</span>
      <h2 class="text-2xl font-bold">{product.title}</h2>
      <div class="flex items-center gap-2 text-sm">
        {@render stars(product.rating)}
        <span class="text-slate-500 dark:text-slate-400">
          {product.rating.toFixed(2)} ({product.reviews.length} reviews)
        </span>
      </div>
      <span class="text-xl tabular-nums text-blue-700 dark:text-blue-400">${product.price}</span>
      <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>
      <div class="mt-2">
        <AddToCartButtonSvelte {product} />
      </div>
    </div>
  </div>

  {#if product.reviews.length > 0}
    <section>
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reviews</h3>
      <ul class="flex flex-col gap-3">
        {#each product.reviews as r, i (i)}
          <li class="rounded border border-slate-200 dark:border-slate-800 p-3">
            <div class="mb-1 flex items-center justify-between gap-2 text-sm">
              <span class="font-medium">{r.reviewerName}</span>
              {@render stars(r.rating)}
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
            <p class="mt-1 text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>
