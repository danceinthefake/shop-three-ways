<script lang="ts">
  import { cartCount } from '../stores/cart';
</script>

<span class="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-900">
  <span class="text-xs uppercase tracking-wider text-orange-700">Svelte</span>
  <span class="tabular-nums">{$cartCount}</span>
</span>
