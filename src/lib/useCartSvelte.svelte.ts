import { fromStore } from 'svelte/store';
import { cart, type CartItem } from '../stores/cart';

/**
 * A rune-using function. Svelte 5 lets you use $state / $derived / $effect
 * outside .svelte components if the file ends in .svelte.ts (or .svelte.js).
 *
 * fromStore wraps a regular Svelte-compatible store (nanostores qualify) so
 * its current value is reactive. The returned object uses getters because
 * $derived values are "live" — bare values would freeze at the call site.
 */
export function useCart(): {
  readonly items: CartItem[];
  readonly subtotal: number;
  readonly count: number;
} {
  const cartRef = fromStore(cart);
  const items = $derived(Object.values(cartRef.current));
  const subtotal = $derived(
    items.reduce((s, i) => s + i.price * i.qty, 0),
  );
  const count = $derived(
    items.reduce((s, i) => s + i.qty, 0),
  );
  return {
    get items() {
      return items;
    },
    get subtotal() {
      return subtotal;
    },
    get count() {
      return count;
    },
  };
}
