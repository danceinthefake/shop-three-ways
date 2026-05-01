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
  },
];
