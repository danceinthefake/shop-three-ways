import { computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import { pushToast } from './toasts';

export type Wishlist = Record<number, true>;

export const wishlist = persistentAtom<Wishlist>('shop-three-ways:wishlist', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const wishlistCount = computed(wishlist, ($w) => Object.keys($w).length);

export function toggleWishlist(id: number): boolean {
  const current = wishlist.get();
  if (current[id]) {
    const { [id]: _, ...rest } = current;
    wishlist.set(rest);
    pushToast({ variant: 'wishlist', message: 'Removed from wishlist' });
    return false;
  }
  wishlist.set({ ...current, [id]: true });
  pushToast({ variant: 'wishlist', message: 'Saved to wishlist' });
  return true;
}
