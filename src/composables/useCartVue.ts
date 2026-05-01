import { computed, type ComputedRef } from 'vue';
import { useStore } from '@nanostores/vue';
import { cart, type CartItem } from '../stores/cart';

export type CartTotals = {
  items: ComputedRef<CartItem[]>;
  subtotal: ComputedRef<number>;
  count: ComputedRef<number>;
};

/**
 * Composable: subscribes to the cart store and exposes items / subtotal /
 * count as Vue refs so consumers can read them directly in templates and
 * track them in their own computed values.
 */
export function useCart(): CartTotals {
  const $cart = useStore(cart);
  const items = computed(() => Object.values($cart.value));
  const subtotal = computed(() =>
    items.value.reduce((s, i) => s + i.price * i.qty, 0),
  );
  const count = computed(() =>
    items.value.reduce((s, i) => s + i.qty, 0),
  );
  return { items, subtotal, count };
}
