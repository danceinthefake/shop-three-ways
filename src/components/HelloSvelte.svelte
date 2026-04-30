<script lang="ts">
  let count = $state(0);
</script>

<div>
  <strong>Svelte</strong>: {count}
  <button onclick={() => count++}>+</button>
</div>
