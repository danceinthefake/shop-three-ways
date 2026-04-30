import { useEffect, useState } from 'react';
import { PRODUCTS_URL, type Product } from '../data/products';

export default function ProductListReact() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch(PRODUCTS_URL)
      .then((r) => r.json() as Promise<Product[]>)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') return <p className="text-slate-500">Loading…</p>;
  if (status === 'error') return <p className="text-red-600">Failed to load products.</p>;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
      {products.map((p) => (
        <article key={p.id} className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <img src={p.images[0]} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" />
          <div className="flex flex-col gap-1 p-3">
            <span className="font-semibold">{p.title}</span>
            <span className="tabular-nums text-blue-700">${p.price}</span>
            <span className="line-clamp-2 text-sm text-slate-500">{p.description}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
