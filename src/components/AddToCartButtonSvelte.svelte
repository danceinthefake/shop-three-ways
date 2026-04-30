<script lang="ts">
  import { cart, addToCart } from '../stores/cart';
  import type { Product } from '../data/products';

  let { product }: { product: Product } = $props();

  const qty = $derived($cart[product.id]?.qty ?? 0);
</script>

<button
  type="button"
  onclick={() => addToCart(product)}
  class="rounded bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-800"
>
  {qty > 0 ? `In cart · ${qty}` : 'Add to cart'}
</button>
