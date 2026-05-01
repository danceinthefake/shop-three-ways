import { useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { cart, type CartItem } from '../stores/cart';

export type CartTotals = {
  items: CartItem[];
  subtotal: number;
  count: number;
};

/**
 * Custom hook: subscribes to the cart store and returns the items list,
 * subtotal, and total quantity. The useMemo guards against re-allocating
 * the totals object on unrelated re-renders.
 */
export function useCart(): CartTotals {
  const $cart = useStore(cart);
  return useMemo(() => {
    const items = Object.values($cart);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return { items, subtotal, count };
  }, [$cart]);
}
