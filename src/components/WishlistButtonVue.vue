<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { wishlist, toggleWishlist } from '../stores/wishlist';

const props = defineProps<{ id: number }>();
const $wishlist = useStore(wishlist);
const saved = computed(() => !!$wishlist.value[props.id]);
</script>

<template>
  <button
    type="button"
    @click="toggleWishlist(props.id)"
    :aria-label="saved ? 'Remove from wishlist' : 'Save to wishlist'"
    :aria-pressed="saved"
    :class="[
      'flex h-8 w-8 items-center justify-center rounded-full border text-base transition',
      saved
        ? 'border-rose-300 bg-rose-50 text-rose-600'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500',
    ]"
  >
    {{ saved ? '♥' : '♡' }}
  </button>
</template>
