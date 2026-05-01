import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { cart, setQty } from '../stores/cart';

type Props = { id: number };

export default function QuantityStepperReact({ id }: Props) {
  const $cart = useStore(cart);
  const qty = $cart[id]?.qty ?? 0;

  // Local draft so typing doesn't commit until blur/Enter.
  const [draft, setDraft] = useState(String(qty));
  useEffect(() => {
    setDraft(String(qty));
  }, [qty]);

  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n) && n >= 0) setQty(id, n);
    else setDraft(String(qty));
  };

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
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
        }}
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
