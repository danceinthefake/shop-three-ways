import { useStore } from '@nanostores/react';
import { cart, removeFromCart } from '../stores/cart';
import QuantityStepperReact from './QuantityStepperReact';

export default function CartViewReact() {
  const $cart = useStore(cart);
  const items = Object.values($cart);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Cart is empty.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 rounded border border-slate-200 p-2">
          <img src={item.image} alt={item.title} className="h-12 w-12 shrink-0 rounded object-cover" />
          <div className="flex-1 truncate text-sm">{item.title}</div>
          <span className="tabular-nums text-blue-700">${item.price}</span>
          <QuantityStepperReact id={item.id} />
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="text-xs text-slate-500 hover:text-red-600"
          >
            remove
          </button>
        </div>
      ))}
      <div className="mt-2 flex justify-end gap-3 text-sm">
        <span className="text-slate-500">Total</span>
        <span className="tabular-nums font-semibold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
