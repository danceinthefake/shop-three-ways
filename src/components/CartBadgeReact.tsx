import { useStore } from '@nanostores/react';
import { cartCount } from '../stores/cart';

export default function CartBadgeReact() {
  const count = useStore(cartCount);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-900">
      <span className="text-xs uppercase tracking-wider text-sky-700">React</span>
      <span className="tabular-nums">{count}</span>
    </span>
  );
}
