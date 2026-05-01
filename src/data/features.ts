export type FrameworkNotes = {
  react: string;
  vue: string;
  svelte: string;
};

export type Feature = {
  slug: string;
  title: string;
  concept: string;
  blurb: string;
  files: {
    react: string;
    vue: string;
    svelte: string;
  };
  notes: FrameworkNotes;
};

export const features: Feature[] = [
  {
    slug: 'slide-banner',
    title: 'Slide banner',
    concept: 'Timers + cleanup',
    blurb:
      'A setInterval that has to be torn down on unmount. The contrast is in how each framework expresses "do this on mount, undo it on unmount".',
    files: {
      react: 'SlideBannerReact.tsx',
      vue: 'SlideBannerVue.vue',
      svelte: 'SlideBannerSvelte.svelte',
    },
    notes: {
      react:
        'useEffect with an empty dependency array runs once after mount. The captured interval id lives in the closure; the returned function is the cleanup, called on unmount. Setup and teardown sit together — easy to read, easy to forget.',
      vue:
        'Vue splits mount and unmount into two hooks. onMounted starts the interval; onUnmounted clears it. The timer id is held in a let outside both because they don\'t share a closure. More verbose than React/Svelte, but the symmetry is explicit.',
      svelte:
        '$effect is the runes-mode replacement for onMount. Its returned function is the cleanup — same shape as React\'s useEffect, no dependency array because the runes runtime auto-tracks reactive reads (there are none here, so it runs once).',
    },
  },
  {
    slug: 'product-carousel',
    title: 'Product carousel',
    concept: 'DOM refs',
    blurb:
      'Capture a DOM element from the template so the prev/next buttons can call scrollBy() on it.',
    files: {
      react: 'ProductCarouselReact.tsx',
      vue: 'ProductCarouselVue.vue',
      svelte: 'ProductCarouselSvelte.svelte',
    },
    notes: {
      react:
        'useRef returns a stable object across renders. Pass it via the JSX ref prop and read element through .current. Always nullable — the element doesn\'t exist before the first commit.',
      vue:
        'Declare a normal ref(null), give the element a string name in the template (ref="scroller"), and Vue auto-binds it. Access through .value. The string-name binding is what links script and template.',
      svelte:
        'A plain variable wrapped in $state() so reactivity tracks it, then bind:this={scroller} in the template. Direct access — no .current or .value indirection. The $state wrap is a Svelte 5 quirk; in Svelte 4 a bare let was enough.',
    },
  },
  {
    slug: 'product-list',
    title: 'Product list',
    concept: 'Async fetch + derived state',
    blurb:
      'Fetch on mount, render a loading/error/list state machine, and derive a filtered view from a search query.',
    files: {
      react: 'ProductListReact.tsx',
      vue: 'ProductListVue.vue',
      svelte: 'ProductListSvelte.svelte',
    },
    notes: {
      react:
        'useState for products / status / query, useEffect with a cancelled flag for the fetch, useMemo with explicit [products, query] deps for the filter. React makes you spell out every dependency — the upside is that the data flow is fully visible.',
      vue:
        'ref for state, onMounted async for the fetch, computed for the filter. No deps to declare — Vue tracks reactive reads automatically. The cancelled flag isn\'t needed because onMounted only runs once.',
      svelte:
        '$state for everything, $effect for the fetch (also returns a cleanup with cancelled flag), $derived.by for the filter. .by takes a function (vs $derived which takes an expression) and is needed when the derivation has multiple statements.',
    },
  },
  {
    slug: 'add-to-cart',
    title: 'Add to cart button',
    concept: 'Events + global store subscription',
    blurb:
      'Each button reads the same nanostore to know how many of this product are already in the cart, and writes to it on click.',
    files: {
      react: 'AddToCartButtonReact.tsx',
      vue: 'AddToCartButtonVue.vue',
      svelte: 'AddToCartButtonSvelte.svelte',
    },
    notes: {
      react:
        'useStore from @nanostores/react subscribes the component to the store and re-renders on every change. Calling addToCart() outside the component just mutates the atom; the subscription propagates the new value back in.',
      vue:
        'useStore from @nanostores/vue returns a Vue ref. Use computed() to derive the qty so it stays reactive in templates. Reading $cart.value[id]?.qty inside computed registers the dependency.',
      svelte:
        'Just import the store and read it as $cart — Svelte\'s $-prefix auto-subscription works for any object with a Svelte-compatible subscribe() (nanostores conforms). qty is a $derived rune so it recomputes when the store changes.',
    },
  },
  {
    slug: 'cart-badge',
    title: 'Cart badge',
    concept: 'Read-only global state',
    blurb:
      'The smallest possible store consumer. Subscribes to a computed total and renders it.',
    files: {
      react: 'CartBadgeReact.tsx',
      vue: 'CartBadgeVue.vue',
      svelte: 'CartBadgeSvelte.svelte',
    },
    notes: {
      react:
        'useStore on the computed total. The component re-renders only when cartCount changes, not on every cart mutation that doesn\'t affect the sum.',
      vue:
        'useStore returns a ref. Templates auto-unwrap refs, so {{ count }} just works without .value.',
      svelte:
        '$cartCount auto-subscription. Three lines of script, zero subscription boilerplate.',
    },
  },
  {
    slug: 'quantity-stepper',
    title: 'Quantity stepper',
    concept: 'Two-way binding',
    blurb:
      'Bind an input to a store value, with deferred commit on blur/Enter so backspacing through the number does not delete the cart row.',
    files: {
      react: 'QuantityStepperReact.tsx',
      vue: 'QuantityStepperVue.vue',
      svelte: 'QuantityStepperSvelte.svelte',
    },
    notes: {
      react:
        'No native two-way binding. A local "draft" useState mirrors the store value, useEffect re-syncs when the external qty changes, and onBlur (or Enter) commits via setQty. The most code of the three because every wire is explicit.',
      vue:
        'v-model.lazy.number on a writable computed (with get/set). The .lazy modifier listens to the change event (which fires on blur for inputs) instead of input. The writable computed is the standard way to v-model derived state.',
      svelte:
        'Deliberately not using bind:value here — instead value={qty} + onchange. The change event already fires on blur, so we get the deferred commit for free without writing a getter/setter binding.',
    },
  },
  {
    slug: 'cart-view',
    title: 'Cart view',
    concept: 'List rendering + composition',
    blurb:
      'Iterates over the cart items and embeds the same-framework QuantityStepper for each row.',
    files: {
      react: 'CartViewReact.tsx',
      vue: 'CartViewVue.vue',
      svelte: 'CartViewSvelte.svelte',
    },
    notes: {
      react:
        'Object.values($cart).map(...) with a key prop on each row. Empty state is an early return — common React pattern for swapping the whole render.',
      vue:
        'computed for items and total (auto-tracked from the store ref). v-for with :key on the row, v-if/v-else for the empty state.',
      svelte:
        '$derived for items and total. {#each items as item (item.id)} with the keyed expression, {#if}/{:else} for the empty state.',
    },
  },
  {
    slug: 'product-detail',
    title: 'Product detail',
    concept: 'Local UI state (image gallery)',
    blurb:
      'Receives a Product as a prop, holds a tiny "selected image index" in local state, and lets the user click thumbnails to swap the main image. No store involvement.',
    files: {
      react: 'ProductDetailReact.tsx',
      vue: 'ProductDetailVue.vue',
      svelte: 'ProductDetailSvelte.svelte',
    },
    notes: {
      react:
        'useState(0) for the selected index. Click handler calls setSelected(i). Props are typed as a function argument — JSX reads them directly.',
      vue:
        'ref(0) for the selected index. Props via defineProps with a generic type. Template uses props.product.images directly.',
      svelte:
        '$state(0) for the index. Props via $props() destructure with a TS annotation. The template reads product.images[selected] without indirection.',
    },
  },
  {
    slug: 'checkout-form',
    title: 'Checkout form',
    concept: 'Forms + validation',
    blurb:
      'Five fields with required + email/zip-format validation, derived error map, gated submit, and inline success state. The genuinely-different muscle compared to everything else in the demo.',
    files: {
      react: 'CheckoutFormReact.tsx',
      vue: 'CheckoutFormVue.vue',
      svelte: 'CheckoutFormSvelte.svelte',
    },
    notes: {
      react:
        'A useState per field plus a useMemo for the errors map, with all five fields in the deps. Manual onChange wiring on every input — tedious but explicit. A small Field helper keeps the JSX repeating tolerable.',
      vue:
        'A ref per field, a computed for errors. v-model handles every input wire. The form template repeats but each field is just three lines (label + input + error span).',
      svelte:
        '$state per field, $derived.by for the errors map. bind:value on each input. The shape mirrors Vue closely; the rune syntax is the only meaningful difference.',
    },
  },
];
