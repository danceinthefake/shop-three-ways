<script lang="ts">
  import { promos, SLIDE_INTERVAL_MS } from '../data/promos';

  let i = $state(0);

  $effect(() => {
    const id = setInterval(() => {
      i = (i + 1) % promos.length;
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  });
</script>

<div class="relative h-48 overflow-hidden rounded-lg bg-slate-200">
  <img src={promos[i].image} alt="" class="absolute inset-0 h-full w-full object-cover" />
  <div class="absolute inset-0 bg-black/40"></div>
  <div class="relative flex h-full flex-col justify-end gap-1 p-4 text-white">
    <h3 class="text-lg font-semibold">{promos[i].title}</h3>
    <p class="text-sm opacity-90">{promos[i].subtitle}</p>
  </div>
  <div class="absolute bottom-2 right-2 flex gap-1">
    {#each promos as p, idx (p.id)}
      <button
        type="button"
        onclick={() => (i = idx)}
        aria-label={`Go to slide ${idx + 1}`}
        class={`h-2 w-2 rounded-full transition ${idx === i ? 'bg-white' : 'bg-white/40'}`}
      ></button>
    {/each}
  </div>
</div>
