# shop-three-ways — Structure Brainstorm

A small e-commerce demo built with Astro, where the same features are
implemented in **React**, **Vue**, and **Svelte** side-by-side. Goal: a
developer who knows one framework can quickly read the other two.

## 1. Audience & Goal

- **Audience**: developers fluent in one of {React, Vue, Svelte} who want
  a Rosetta-stone-style intro to the others.
- **Goal**: minimize "translation friction". Reading the same feature in
  three columns should make idiomatic patterns obvious.
- **Non-goal**: a full production shop. Keep features small enough that
  the *framework code* is the focus, not domain logic.

## 2. Approach Options

Three ways to organize the comparison. We can pick one or blend.

### A. Concept-driven (Rosetta book)
One page per concept (`/state`, `/props`, `/events`, `/effects`...).
Each page shows the same tiny example in all three frameworks.
- ✅ Easiest to navigate as a reference.
- ✅ Forces minimal, focused snippets.
- ❌ Feels academic; loses the "real app" thread.

### B. Feature-driven (build a shop)
One page per shop feature (`/products`, `/cart`, `/checkout`).
Each feature is implemented thrice and rendered as Astro islands.
- ✅ More engaging — users see a working app.
- ✅ Demonstrates how concepts compose.
- ❌ Harder to isolate a single concept.

### C. Hybrid (recommended)
A working shop (B) where each feature page also has a "Concepts in this
feature" sidebar linking to concept pages (A). The home page is the live
shop; the docs section is the Rosetta reference.

**Recommendation: C** — gets the "wow, it works in all three" demo
*and* the searchable reference value.

## 3. Proposed Site Map (Hybrid)

```
/                       Home — slide banner (hero) + featured-product carousel
                        + pitch / "see the same component in 3 frameworks"
/shop                   Product listing (live demo)
/products/[slug]        Product detail
/cart                   Cart (global state showcase)
/checkout               Form + validation showcase

/compare/<feature>      Side-by-side code for that feature, all 3 frameworks
/concepts/<concept>     Rosetta reference for one concept

/about                  Why this exists, how to read it
```

The home page is itself a comparison surface: the slide banner and the
product carousel each ship in three flavors (one island per framework),
toggleable so the visitor can see them behave identically.

The `/shop`, `/cart`, etc. pages each render **three islands** of the
same component (one per framework) so the user sees them behaving
identically. A toggle picks "single framework" vs "all three" view.

## 4. Feature → Concept Matrix

Pick features that each isolate a different framework muscle.

| Feature              | Primary concept demoed                                    |
| -------------------- | --------------------------------------------------------- |
| Slide banner (hero)  | **Timers + cleanup** (`setInterval` in `useEffect` vs `onMounted`/`onUnmounted` vs `$effect` return) |
| Product carousel     | **DOM refs** (`useRef` vs template `ref`/`ref()` vs `bind:this`), scroll handlers |
| Product card         | Props, conditional rendering                              |
| Product list         | List rendering, keys                                      |
| Add-to-cart button   | Event handling, parent ↔ child communication              |
| Cart badge in header | **Cross-component / global state** (the big one)          |
| Quantity stepper     | **Two-way binding** (`v-model`, `bind:`, controlled input)|
| Search / filter      | **Derived state** (`useMemo`, `computed`, `$derived`)     |
| Product detail       | Local UI state — image gallery select index               |
| Checkout form        | **Forms + validation** — per-field state, derived errors  |
| Wishlist toggle      | Local component state, persistence                        |
| Toast notifications  | **Slots / children / snippets** (composition)             |

This list is intentionally bigger than what we'll ship in v1. v1 likely
= product list + cart badge + add-to-cart + quantity stepper + search.
Those four cover state, derived state, two-way binding, and global state.

## 5. Tech Setup Notes

- **Astro** with all three integrations: `@astrojs/react`,
  `@astrojs/vue`, `@astrojs/svelte`.
- **Data source**: the [Platzi Fake Store API](https://fakeapi.platzi.com/)
  at `https://api.escuelajs.co/api/v1/` (read-only endpoints used:
  `GET /products`, `GET /products/{id}`, `GET /categories`).
  Each framework component **fetches on mount client-side** so the
  product list itself demos async/effects in all three frameworks
  (`useEffect` vs `onMounted` vs `$effect`). This pulls what was
  originally a separate "product detail fetch" feature into the shop
  view, where it does more comparison work.
- **Shared types only** (no shared data array) in
  `src/data/products.ts`: a `Product` / `Category` TS type derived
  from the API schema, plus a `PRODUCTS_URL` constant.
- **Shared cart state across frameworks**: this is the interesting
  problem. Options:
  1. Each framework has its own cart, separate islands. Simplest but
     loses the "they share a cart" demo.
  2. A framework-agnostic store (e.g. nanostores, or a tiny
     hand-rolled pub/sub) that all three subscribe to. **Preferred** —
     it doubles as a teaching moment about reactivity bridges.
- **Code display**: render the actual source of each component next to
  the live demo. Astro can import raw with `?raw`. Syntax-highlight
  with Shiki (Astro built-in).
- **Styling**: **Tailwind CSS** (latest, via `@astrojs/tailwind` /
  Tailwind v4 Vite plugin). Utility classes inline in templates so
  the visual layer is identical across frameworks and the only
  difference between the three columns is framework syntax.

## 6. Decisions

- **Approach**: Hybrid (working shop + Rosetta reference pages).
- **Versions**: latest idiomatic syntax — **React 19**, **Vue 3.5+**
  (`<script setup>` + Composition API), **Svelte 5 (runes)**.
- **Language**: **TypeScript**, kept minimal — explicit prop contracts
  help comparison, but no over-typing.
- **Cross-framework store**: **nanostores** — framework-agnostic,
  tiny, has official `@nanostores/react`, `@nanostores/vue`, and
  Svelte interop via `$store` auto-subscriptions.
- **Styling**: **Tailwind CSS** (utility-first, applied in templates).
- **Data source**: **Platzi Fake Store API**, fetched client-side
  inside each framework component so the product list also serves as
  the async/effects demo.
- **Hosting**: deferred. Astro static output keeps options open.

## 7. v1 Scope

Seven features ship in v1:

1. ✅ **Slide banner (hero)** — timers + cleanup on the home page.
2. ✅ **Product carousel** — DOM refs + scroll handlers on the home page.
3. ✅ **Product list (with API fetch)** — list rendering + async/effects
   (`useEffect` vs `onMounted` vs `$effect`) + loading/error states.
4. ✅ **Add-to-cart button** — events, parent ↔ child communication.
5. ✅ **Cart badge in header** — global state via nanostores (centerpiece).
6. ✅ **Quantity stepper** — two-way binding idioms.
7. ✅ **Search / filter** — derived state.

## 7b. Post-v1 additions (shipped)

- ✅ **Product detail** at `/products/[slug]` — getStaticPaths from
  the API at build time, three ProductDetail panels with image
  gallery (`useState` / `ref` / `$state` for selected index).
- ✅ **Checkout form** at `/checkout` — three forms with per-field
  state, derived error map, gated submit, inline success.

## 8. Rough Build Order

1. ✅ Scaffold Astro + 3 integrations, render "hello" island in each.
2. ✅ Static product list page, one framework at a time. *(Now fetches
   live from the Platzi API instead of static data.)*
3. ✅ Add the shared store + cart badge — the moment all three frameworks
   talk to each other is the centerpiece. *(Includes add-to-cart
   buttons embedded in each ProductList card.)*
4. ✅ Quantity stepper (the two-way-binding showcase). *(Lives on a
   new `/cart` page with three CartView panels.)*
5. ✅ Search / filter (derived state). *(Added inline to each
   ProductList — local query + derived filtered list per panel.)*
6. ✅ Slide banner on home (timers + cleanup).
7. ✅ Product carousel on home (DOM refs).
8. ✅ `/compare/<feature>` pages with side-by-side source. *(Index
   at `/compare`, dynamic pages at `/compare/[feature]` highlighted
   with Astro's `<Code>` / Shiki, sources loaded via
   `import.meta.glob('?raw')`.)*
9. ✅ Polish home copy + about. *(Home rewritten with hero, explore
   cards, synced cart-badge header, footer; smoke test removed and
   Hello* components deleted. `/about` covers audience, structure,
   concept matrix, tech stack, data attribution.)*
