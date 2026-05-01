<script lang="ts">
  import { wishlist, toggleWishlist } from '../stores/wishlist';

  let { id }: { id: number } = $props();
  const saved = $derived(!!$wishlist[id]);
</script>

<button
  type="button"
  onclick={() => toggleWishlist(id)}
  aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
  aria-pressed={saved}
  class={`flex h-8 w-8 items-center justify-center rounded-full border text-base transition ${
    saved
      ? 'border-rose-300 bg-rose-50 text-rose-600'
      : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500'
  }`}
>
  {saved ? '♥' : '♡'}
</button>
