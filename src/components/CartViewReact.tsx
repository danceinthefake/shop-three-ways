import { removeFromCart } from '../stores/cart';
import { useCart } from '../hooks/useCartReact';
import QuantityStepperReact from './QuantityStepperReact';

export default function CartViewReact() {
  const { items, subtotal: total } = useCart();

  if (items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Cart is empty.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-wrap items-center gap-3 rounded border border-slate-200 dark:border-slate-800 p-2">
          <img src={item.image} alt={item.title} className="h-12 w-12 shrink-0 rounded object-cover" />
          <div className="min-w-0 flex-1 truncate text-sm">{item.title}</div>
          <span className="shrink-0 tabular-nums text-blue-700 dark:text-blue-400">${item.price}</span>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <QuantityStepperReact id={item.id} />
            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-600"
            >
              remove
            </button>
          </div>
        </div>
      ))}
      <div className="mt-2 flex justify-end gap-3 text-sm">
        <span className="text-slate-500 dark:text-slate-400">Total</span>
        <span className="tabular-nums font-semibold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
