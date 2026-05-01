import { useEffect, useState } from 'react';
import { promos, SLIDE_INTERVAL_MS } from '../data/promos';

export default function SlideBannerReact() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % promos.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const slide = promos[i];

  return (
    <div className="relative h-48 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
      <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex h-full flex-col justify-end gap-1 p-4 text-white">
        <h3 className="text-lg font-semibold">{slide.title}</h3>
        <p className="text-sm opacity-90">{slide.subtitle}</p>
      </div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        {promos.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 w-2 rounded-full transition ${idx === i ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
