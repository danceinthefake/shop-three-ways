import { useEffect, useRef, useState } from 'react';
import { fetchProducts, type Product } from '../data/products';

const SCROLL_STEP = 240;

export default function ProductCarouselReact() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const scrollerRef = useRef<HTMLDivElement>(null);

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

  const scroll = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' });
  };

  if (status === 'loading') {
    return (
      <div className="flex gap-3 overflow-hidden pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="flex w-52 shrink-0 animate-pulse flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="aspect-square w-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </article>
        ))}
      </div>
    );
  }
  if (status === 'error') return <p className="text-red-600">Failed to load products.</p>;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow hover:bg-slate-50 dark:hover:bg-slate-800"
      >‹</button>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((p) => (
          <a
            key={p.id}
            href={`/products/${p.slug}`}
            className="flex w-52 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600"
          >
            <img src={p.thumbnail} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="flex flex-col gap-1 p-3">
              <span className="truncate text-sm font-semibold">{p.title}</span>
              <span className="tabular-nums text-blue-700 dark:text-blue-400">${p.price}</span>
            </div>
          </a>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow hover:bg-slate-50 dark:hover:bg-slate-800"
      >›</button>
    </div>
  );
}
