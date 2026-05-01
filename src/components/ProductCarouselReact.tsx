import { useEffect, useRef, useState } from 'react';
import { PRODUCTS_URL, type Product } from '../data/products';

const SCROLL_STEP = 240;

export default function ProductCarouselReact() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const scrollerRef = useRef<HTMLDivElement>(null);

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

  const scroll = (dir: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' });
  };

  if (status === 'loading') return <p className="text-slate-500">Loading…</p>;
  if (status === 'error') return <p className="text-red-600">Failed to load products.</p>;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
      >‹</button>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((p) => (
          <article
            key={p.id}
            className="flex w-52 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-slate-200 bg-white"
          >
            <img src={p.images[0]} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="flex flex-col gap-1 p-3">
              <span className="truncate text-sm font-semibold">{p.title}</span>
              <span className="tabular-nums text-blue-700">${p.price}</span>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow hover:bg-slate-50"
      >›</button>
    </div>
  );
}
