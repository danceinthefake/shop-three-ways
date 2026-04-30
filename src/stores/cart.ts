import { atom, computed } from 'nanostores';
import type { Product } from '../data/products';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
};

export type Cart = Record<number, CartItem>;

export const cart = atom<Cart>({});

export const cartCount = computed(cart, ($cart) =>
  Object.values($cart).reduce((sum, item) => sum + item.qty, 0),
);

export function addToCart(product: Product) {
  const current = cart.get();
  const existing = current[product.id];
  cart.set({
    ...current,
    [product.id]: existing
      ? { ...existing, qty: existing.qty + 1 }
      : {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          qty: 1,
        },
  });
}

export function removeFromCart(id: number) {
  const { [id]: _, ...rest } = cart.get();
  cart.set(rest);
}

export function setQty(id: number, qty: number) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  const current = cart.get();
  const existing = current[id];
  if (!existing) return;
  cart.set({ ...current, [id]: { ...existing, qty } });
}
