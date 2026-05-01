<script lang="ts">
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const inputCls = 'rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none';

  let name = $state('');
  let email = $state('');
  let address = $state('');
  let city = $state('');
  let zip = $state('');
  let tried = $state(false);
  let submitted = $state(false);

  const errors = $derived.by(() => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Name is required.';
    if (!EMAIL_RE.test(email)) e.email = 'Valid email required.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!city.trim()) e.city = 'City is required.';
    if (zip.trim().length < 4) e.zip = 'Zip is required.';
    return e;
  });

  const isValid = $derived(Object.keys(errors).length === 0);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    tried = true;
    if (isValid) submitted = true;
  }

  const showError = (key: string) => (tried ? errors[key] : undefined);
</script>

{#if submitted}
  <div class="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900">
    Order placed (mock). Thanks, {name}.
  </div>
{:else}
  <form onsubmit={handleSubmit} class="flex flex-col gap-2" novalidate>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Name</span>
      <input class={inputCls} bind:value={name} />
      {#if showError('name')}<span class="text-xs text-red-600">{showError('name')}</span>{/if}
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Email</span>
      <input class={inputCls} type="email" bind:value={email} />
      {#if showError('email')}<span class="text-xs text-red-600">{showError('email')}</span>{/if}
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Address</span>
      <input class={inputCls} bind:value={address} />
      {#if showError('address')}<span class="text-xs text-red-600">{showError('address')}</span>{/if}
    </label>
    <div class="grid grid-cols-2 gap-2">
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600 dark:text-slate-300">City</span>
        <input class={inputCls} bind:value={city} />
        {#if showError('city')}<span class="text-xs text-red-600">{showError('city')}</span>{/if}
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600 dark:text-slate-300">Zip</span>
        <input class={inputCls} bind:value={zip} />
        {#if showError('zip')}<span class="text-xs text-red-600">{showError('zip')}</span>{/if}
      </label>
    </div>
    <button
      type="submit"
      class="mt-2 self-start rounded bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      disabled={tried && !isValid}
    >
      Place order
    </button>
  </form>
{/if}
