<script lang="ts">
  import type { Product } from '../data/products';
  import AddToCartButtonSvelte from './AddToCartButtonSvelte.svelte';

  let { product }: { product: Product } = $props();
  let selected = $state(0);
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
  <div>
    <img
      src={product.images[selected]}
      alt={product.title}
      class="aspect-square w-full rounded-lg border border-slate-200 bg-white object-cover"
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
    <span class="text-xs uppercase tracking-wider text-slate-500">{product.category}</span>
    <h2 class="text-2xl font-bold">{product.title}</h2>
    <span class="text-xl tabular-nums text-blue-700">${product.price}</span>
    <p class="text-sm leading-relaxed text-slate-600">{product.description}</p>
    <div class="mt-2">
      <AddToCartButtonSvelte {product} />
    </div>
  </div>
</div>
