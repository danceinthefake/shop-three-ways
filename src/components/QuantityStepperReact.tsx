import { useStore } from '@nanostores/react';
import { cart, setQty } from '../stores/cart';

type Props = { id: number };

export default function QuantityStepperReact({ id }: Props) {
  const $cart = useStore(cart);
  const qty = $cart[id]?.qty ?? 0;

  return (
    <div className="inline-flex items-center rounded border border-slate-300">
      <button
        type="button"
        onClick={() => setQty(id, qty - 1)}
        className="px-2 py-1 text-slate-700 hover:bg-slate-100"
        aria-label="Decrease"
      >
        −
      </button>
      <input
        type="number"
        min={0}
        value={qty}
        onChange={(e) => setQty(id, Number(e.target.value))}
        className="w-12 border-x border-slate-300 px-2 py-1 text-center tabular-nums focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setQty(id, qty + 1)}
        className="px-2 py-1 text-slate-700 hover:bg-slate-100"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
