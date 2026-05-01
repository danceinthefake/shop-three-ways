import { useEffect, useMemo, useState } from 'react';
import { fetchProducts, type Product } from '../data/products';
import AddToCartButtonReact from './AddToCartButtonReact';
import WishlistButtonReact from './WishlistButtonReact';

export default function ProductListReact() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.title.toLowerCase().includes(q));
  }, [products, query]);

  if (status === 'loading') {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <article key={i} className="flex animate-pulse flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="aspect-square w-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </article>
        ))}
      </div>
    );
  }
  if (status === 'error') return <p className="text-red-600">Failed to load products.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 rounded border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          {filtered.length} of {products.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No products match "{query}".</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {filtered.map((p) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <img src={p.thumbnail} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" />
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="font-semibold">{p.title}</span>
                <span className="tabular-nums text-blue-700 dark:text-blue-400">${p.price}</span>
                <span className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{p.description}</span>
                <div className="mt-2 flex items-center gap-2">
                  <AddToCartButtonReact product={p} />
                  <WishlistButtonReact id={p.id} />
                  <a href={`/products/${p.slug}`} className="ml-auto text-xs text-blue-700 dark:text-blue-400 hover:underline">details →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
