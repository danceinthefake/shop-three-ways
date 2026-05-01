import { useState } from 'react';
import type { Product } from '../data/products';
import AddToCartButtonReact from './AddToCartButtonReact';

type Props = { product: Product };

export default function ProductDetailReact({ product }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <img
          src={product.images[selected]}
          alt={product.title}
          className="aspect-square w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 object-cover"
        />
        {product.images.length > 1 && (
          <div className="mt-2 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-14 w-14 overflow-hidden rounded border-2 ${
                  i === selected ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{product.category}</span>
        <h2 className="text-2xl font-bold">{product.title}</h2>
        <span className="text-xl tabular-nums text-blue-700 dark:text-blue-400">${product.price}</span>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="mt-2">
          <AddToCartButtonReact product={product} />
        </div>
      </div>
    </div>
  );
}
