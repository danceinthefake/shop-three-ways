export type FrameworkNotes = {
  react: string;
  vue: string;
  svelte: string;
};

// Order matters: longer / more specific terms must come before shorter
// substrings of themselves (e.g. v-model.lazy before v-model).
const TERM_LINKS: Array<{ term: string; href: string }> = [
  { term: '$-prefix auto-subscription', href: '/glossary#dollar-store' },
  { term: 'v-model.lazy', href: '/glossary#v-model-modifiers' },
  { term: 'v-model', href: '/glossary#v-model' },
  { term: 'bind:value', href: '/glossary#bind-value' },
  { term: 'bind:this', href: '/glossary#bind-this' },
  { term: '$derived.by', href: '/glossary#derived-rune' },
  { term: '$derived', href: '/glossary#derived-rune' },
  { term: '$effect', href: '/glossary#effect-rune' },
  { term: '$state', href: '/glossary#state-rune' },
  { term: '$props', href: '/glossary#props-rune' },
  { term: 'useEffect', href: '/glossary#useEffect' },
  { term: 'useState', href: '/glossary#useState' },
  { term: 'useMemo', href: '/glossary#useMemo' },
  { term: 'useRef', href: '/glossary#useRef' },
  { term: 'useStore', href: '/glossary#useStore' },
  { term: 'dependency array', href: '/glossary#dependency-array' },
  { term: 'writable computed', href: '/glossary#writable-computed' },
  { term: 'controlled input', href: '/glossary#controlled-input' },
  { term: 'persistentAtom', href: '/glossary#persistentAtom' },
  { term: 'defineProps', href: '/glossary#defineProps' },
  { term: 'onMounted', href: '/glossary#onMounted' },
  { term: 'onUnmounted', href: '/glossary#onMounted' },
  { term: 'computed', href: '/glossary#computed' },
  { term: 'rune', href: '/glossary#rune' },
  { term: 'atom', href: '/glossary#atom' },
  { term: 'cleanup', href: '/glossary#cleanup' },
  { term: 'closure', href: '/glossary#closure' },
  { term: 'subscribes', href: '/glossary#subscribe' },
  { term: 'subscribe()', href: '/glossary#subscribe' },
  { term: 'subscribe', href: '/glossary#subscribe' },
];

const ANCHOR_CLASS = 'text-blue-700 underline decoration-blue-200 underline-offset-2 hover:decoration-blue-500';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert a plain-text note into HTML, replacing the FIRST occurrence of each
 * known term with a link to its glossary anchor. Boundary uses [^\w-$] so that
 * 'ref' doesn't match inside 'useRef' and '$state' won't match inside a longer
 * identifier like '$state2'.
 */
export function linkifyNote(note: string): string {
  let html = escapeHtml(note);
  for (const { term, href } of TERM_LINKS) {
    const escaped = escapeRegex(term);
    const re = new RegExp(`(?<![\\w$-])(${escaped})(?![\\w$-])`);
    if (re.test(html)) {
      html = html.replace(re, `<a href="${href}" class="${ANCHOR_CLASS}">$1</a>`);
    }
  }
  return html;
}

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
        'useRef returns a stable object across renders. Pass it via the JSX ref prop and read element through .current. Always nullable — the element doesn\'t exist before the first commit. The fetch lives in useEffect with a cancelled flag.',
      vue:
        'Declare a normal ref(null), give the element a string name in the template (ref="scroller"), and Vue auto-binds it. Access through .value. The fetch goes in onMounted async.',
      svelte:
        '{#await} for the fetch — same simplification as in ProductList. bind:this={scroller} captures the element directly, no .current or .value. The $state wrap on the variable is a Svelte 5 quirk; in Svelte 4 a bare let was enough.',
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
        'No state machine at all — {#await} is built into the template. The promise is fired once at component setup and Svelte renders the {pending / :then / :catch} branches automatically. The filtered list is a {@const} inside {:then}, which auto-recomputes when query changes. Compare to React/Vue: half the script section disappears, no cancelled flag needed.',
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
        'Object.values($cart).map(...) with a key prop on each row. Empty state is an early return. No animation — for a slide-out on remove or FLIP on reorder, you would reach for framer-motion or similar.',
      vue:
        'computed for items and total. v-for with :key on the row, v-if/v-else for the empty state. <TransitionGroup> wraps the list and a small <style scoped> block defines cart-row-enter/leave/move classes for slide-and-fade animation on add/remove.',
      svelte:
        '$derived for items and total. The interesting bit: animate:flip={{ duration: 200 }} on each row gives free FLIP animation when items reorder or the list shifts after a remove. transition:fade handles the entry/exit. Both come from svelte/animate and svelte/transition — no library, no CSS.',
    },
  },
  {
    slug: 'product-detail',
    title: 'Product detail',
    concept: 'Local UI state + nested data rendering',
    blurb:
      'Image gallery with selected-index local state, plus a reviews list with star ratings. The reviews loop is a small showcase of nested data rendering, and the star widget is reused both for the product rating and per-review rating.',
    files: {
      react: 'ProductDetailReact.tsx',
      vue: 'ProductDetailVue.vue',
      svelte: 'ProductDetailSvelte.svelte',
    },
    notes: {
      react:
        'useState(0) for the selected index. Stars is a small inner component that accepts rating and renders five filled-or-not glyphs. The reviews loop is a plain map with key={i}.',
      vue:
        'ref(0) for the selected index. Stars are inlined as a v-for over [1..5] — no separate component because the template syntax already reads cleanly. Reviews loop with v-for and Math.round inline.',
      svelte:
        '$state(0) for the index. The Stars widget is a {#snippet stars(rating)} ... {/snippet} declared inline and called with {@render stars(product.rating)} — Svelte 5\'s parameterized snippets, like a tiny private component without the file boundary.',
    },
  },
  {
    slug: 'checkout-form',
    title: 'Checkout form',
    concept: 'Forms + validation + radio groups',
    blurb:
      'Seven fields including a phone number and a shipping radio group, all validated. Live order summary derives subtotal from the cart store, looks up the selected shipping option, and surfaces a free-shipping threshold. Submit is gated until everything is valid; success replaces the form inline.',
    files: {
      react: 'CheckoutFormReact.tsx',
      vue: 'CheckoutFormVue.vue',
      svelte: 'CheckoutFormSvelte.svelte',
    },
    notes: {
      react:
        'A useState per field plus a useMemo for the errors map (all seven fields in the deps), and three more useMemos for selectedOption / shippingFee / total derived from the cart subtotal. Radio inputs are explicit checked + onChange — no shortcut for groups in React. A small Field helper keeps the repeating JSX tolerable.',
      vue:
        'A ref per field, computed for errors and for the order summary. v-model handles text inputs AND the radio group — same directive, no special-case for groups. Cart subtotal comes through useStore + computed.',
      svelte:
        '$state per field, $derived.by for the errors map, more $derived for the summary. Radio group uses bind:group={shipping} — the cleanest of the three for a one-of-many input. Cart store is read with $-prefix auto-subscription, no adapter.',
    },
  },
  {
    slug: 'wishlist-toggle',
    title: 'Wishlist toggle',
    concept: 'Local UI state + persistent global store',
    blurb:
      'A heart-shaped toggle on each product card that persists across sessions. The button reads "is this in the wishlist?" from a derived value and toggles the entry on click — same shape as the cart, but the store is a Set-of-ids and the state read is a boolean.',
    files: {
      react: 'WishlistButtonReact.tsx',
      vue: 'WishlistButtonVue.vue',
      svelte: 'WishlistButtonSvelte.svelte',
    },
    notes: {
      react:
        'useStore(wishlist) gives the current map; saved is a plain boolean derived inline. aria-pressed on the button + class swap based on saved is the entire visual state.',
      vue:
        'useStore returns a Vue ref; computed wraps the boolean lookup so the template auto-tracks it. :class array switches between two Tailwind sets.',
      svelte:
        '$wishlist auto-subscription, then saved is a $derived rune over the lookup. Pure runes, no adapter — same five lines you would write to read any other store.',
    },
  },
  {
    slug: 'use-cart',
    title: 'useCart — hook / composable / rune function',
    concept: 'Logic composition (reusable reactive logic)',
    blurb:
      'Cart subtotal lookup is needed in both CartView and CheckoutForm. Each framework has its own pattern for extracting reactive logic into a reusable function — different name, same idea. The three live in src/hooks, src/composables, and src/lib so they read like real-world code rather than demo files.',
    files: {
      react: 'useCartReact.ts',
      vue: 'useCartVue.ts',
      svelte: 'useCartSvelte.svelte.ts',
    },
    notes: {
      react:
        'A "custom hook" — a function whose name starts with use that internally calls other hooks. useStore subscribes the calling component to the cart atom; useMemo recomputes items / subtotal / count only when the underlying $cart changes. Returning a frozen object keeps consumers from re-rendering on shape mutations.',
      vue:
        'A "composable" — a plain function that returns refs / computeds. The Vue analogue of a custom hook, popularized by the Composition API. Templates auto-unwrap refs, so consumers can write {{ subtotal }} or :class without .value. The composable convention is alphabetic: any file under src/composables/ that starts with use.',
      svelte:
        'Svelte 5 lets you use runes ($state, $derived, $effect) in any file ending in .svelte.js or .svelte.ts. fromStore() bridges a regular Svelte store (nanostores conform) into a reactive { current } shape. The function returns getters because $derived values are live — consuming a getter in a component or another rune-using function tracks the read.',
    },
  },
  {
    slug: 'toast-notifications',
    title: 'Toast notifications',
    concept: 'Composition (children / slot / snippet)',
    blurb:
      'A reusable Toast wrapper that takes arbitrary content. The Toaster fires one for every add-to-cart and wishlist toggle. The interesting comparison is how each framework lets a parent pass markup into a child slot.',
    files: {
      react: 'ToastReact.tsx',
      vue: 'ToastVue.vue',
      svelte: 'ToastSvelte.svelte',
    },
    notes: {
      react:
        'children is just a typed prop — ReactNode covers strings, elements, fragments, anything. The wrapper renders {children} where the slot belongs. The Toaster has no enter/leave animation — for that, you would install framer-motion (<AnimatePresence>) or react-transition-group.',
      vue:
        'A default <slot /> in the template renders whatever the parent put between <Toast>...</Toast>. The Toaster wraps its v-for in <TransitionGroup name="toast" tag="div"> and a <style scoped> defines toast-enter/leave classes for slide-in/out — built-in, no library.',
      svelte:
        'Svelte 5 replaces the old <slot /> with snippets. Children come in as a Snippet prop and are rendered with {@render children()}. The Toaster adds transition:fly={{ x: 20, duration: 200 }} as a one-liner on each toast wrapper — Svelte ships transition primitives in svelte/transition, no library, no CSS classes.',
    },
  },
];
