<script lang="ts">
  import { cart } from '../stores/cart';
  import { shippingOptions, effectiveShippingFee } from '../data/shipping';

  type FieldKey = 'name' | 'email' | 'phone' | 'address' | 'city' | 'zip' | 'shipping';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const inputCls = 'rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none';

  const subtotal = $derived(
    Object.values($cart).reduce((s, i) => s + i.price * i.qty, 0),
  );

  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let address = $state('');
  let city = $state('');
  let zip = $state('');
  let shipping = $state('');
  let touched = $state<Partial<Record<FieldKey, boolean>>>({});
  let submitted = $state(false);

  const touch = (key: FieldKey) => {
    if (!touched[key]) touched = { ...touched, [key]: true };
  };

  const errors = $derived.by(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (name.trim().length < 2) e.name = 'Name is required.';
    if (!EMAIL_RE.test(email)) e.email = 'Valid email required.';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'At least 10 digits.';
    if (!address.trim()) e.address = 'Address is required.';
    if (!city.trim()) e.city = 'City is required.';
    if (zip.trim().length < 4) e.zip = 'Zip is required.';
    if (!shippingOptions.some((o) => o.id === shipping)) e.shipping = 'Pick a shipping method.';
    return e;
  });

  const isValid = $derived(Object.keys(errors).length === 0);

  const selectedOption = $derived(
    shippingOptions.find((o) => o.id === shipping),
  );
  const shippingFee = $derived(
    selectedOption ? effectiveShippingFee(selectedOption, subtotal) : 0,
  );
  const total = $derived(subtotal + shippingFee);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (isValid) submitted = true;
  }

  const showError = (key: FieldKey) => (touched[key] ? errors[key] : undefined);
</script>

{#if submitted}
  <div class="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-900">
    <p class="mb-1 font-semibold">Order placed (mock).</p>
    <p>Thanks {name}, shipping via {selectedOption?.name} ({selectedOption?.eta}).</p>
    <p class="mt-2 tabular-nums">Total charged: ${total.toFixed(2)}</p>
  </div>
{:else}
  <form onsubmit={handleSubmit} class="flex flex-col gap-2" novalidate>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Name</span>
      <input class={inputCls} bind:value={name} oninput={() => touch('name')} onblur={() => touch('name')} />
      {#if showError('name')}<span class="text-xs text-red-600">{showError('name')}</span>{/if}
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Email</span>
      <input class={inputCls} type="email" bind:value={email} oninput={() => touch('email')} onblur={() => touch('email')} />
      {#if showError('email')}<span class="text-xs text-red-600">{showError('email')}</span>{/if}
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Phone</span>
      <input class={inputCls} type="tel" bind:value={phone} oninput={() => touch('phone')} onblur={() => touch('phone')} />
      {#if showError('phone')}<span class="text-xs text-red-600">{showError('phone')}</span>{/if}
    </label>
    <label class="flex flex-col gap-1 text-sm">
      <span class="text-slate-600 dark:text-slate-300">Address</span>
      <input class={inputCls} bind:value={address} oninput={() => touch('address')} onblur={() => touch('address')} />
      {#if showError('address')}<span class="text-xs text-red-600">{showError('address')}</span>{/if}
    </label>
    <div class="grid grid-cols-2 gap-2">
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600 dark:text-slate-300">City</span>
        <input class={inputCls} bind:value={city} oninput={() => touch('city')} onblur={() => touch('city')} />
        {#if showError('city')}<span class="text-xs text-red-600">{showError('city')}</span>{/if}
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-slate-600 dark:text-slate-300">Zip</span>
        <input class={inputCls} bind:value={zip} oninput={() => touch('zip')} onblur={() => touch('zip')} />
        {#if showError('zip')}<span class="text-xs text-red-600">{showError('zip')}</span>{/if}
      </label>
    </div>

    <fieldset class="mt-2 flex flex-col gap-1">
      <legend class="text-sm text-slate-600 dark:text-slate-300">Shipping</legend>
      {#each shippingOptions as opt (opt.id)}
        {@const fee = effectiveShippingFee(opt, subtotal)}
        <label class="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="shipping-svelte"
            value={opt.id}
            bind:group={shipping}
            onchange={() => touch('shipping')}
          />
          <span class="flex-1">
            {opt.name}
            <span class="text-xs text-slate-500 dark:text-slate-400">· {opt.eta}</span>
          </span>
          <span class="tabular-nums">{fee === 0 ? 'Free' : `$${fee.toFixed(2)}`}</span>
        </label>
      {/each}
      {#if showError('shipping')}<span class="text-xs text-red-600">{showError('shipping')}</span>{/if}
    </fieldset>

    <dl class="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-slate-200 dark:border-slate-800 pt-2 text-sm">
      <dt class="text-slate-600 dark:text-slate-300">Subtotal</dt>
      <dd class="tabular-nums">${subtotal.toFixed(2)}</dd>
      <dt class="text-slate-600 dark:text-slate-300">Shipping</dt>
      <dd class="tabular-nums">
        {selectedOption ? (shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`) : '—'}
      </dd>
      <dt class="font-semibold">Total</dt>
      <dd class="tabular-nums font-semibold">${total.toFixed(2)}</dd>
    </dl>

    <button
      type="submit"
      class="mt-2 self-start rounded bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={!isValid}
    >
      Place order
    </button>
  </form>
{/if}
