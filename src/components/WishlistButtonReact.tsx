import { useStore } from '@nanostores/react';
import { wishlist, toggleWishlist } from '../stores/wishlist';

type Props = { id: number };

export default function WishlistButtonReact({ id }: Props) {
  const $wishlist = useStore(wishlist);
  const saved = !!$wishlist[id];

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(id)}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={saved}
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-base transition ${
        saved
          ? 'border-rose-300 bg-rose-50 text-rose-600'
          : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500'
      }`}
    >
      {saved ? '♥' : '♡'}
    </button>
  );
}
