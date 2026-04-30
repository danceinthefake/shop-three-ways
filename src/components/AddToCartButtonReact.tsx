import { useStore } from '@nanostores/react';
import { cart, addToCart } from '../stores/cart';
import type { Product } from '../data/products';

type Props = { product: Product };

export default function AddToCartButtonReact({ product }: Props) {
  const $cart = useStore(cart);
  const qty = $cart[product.id]?.qty ?? 0;

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="rounded bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-800"
    >
      {qty > 0 ? `In cart · ${qty}` : 'Add to cart'}
    </button>
  );
}
