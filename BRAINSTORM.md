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
/                       Landing — pitch + "see the same button in 3 frameworks"
/shop                   Product listing (live demo)
/shop/[id]              Product detail
/cart                   Cart (global state showcase)
/checkout               Form + validation showcase

/compare/<feature>      Side-by-side code for that feature, all 3 frameworks
/concepts/<concept>     Rosetta reference for one concept

/about                  Why this exists, how to read it
```

The `/shop`, `/cart`, etc. pages each render **three islands** of the
same component (one per framework) so the user sees them behaving
identically. A toggle picks "single framework" vs "all three" view.

## 4. Feature → Concept Matrix

Pick features that each isolate a different framework muscle.

| Feature              | Primary concept demoed                                    |
| -------------------- | --------------------------------------------------------- |
| Product card         | Props, conditional rendering                              |
| Product list         | List rendering, keys                                      |
| Add-to-cart button   | Event handling, parent ↔ child communication              |
| Cart badge in header | **Cross-component / global state** (the big one)          |
| Quantity stepper     | **Two-way binding** (`v-model`, `bind:`, controlled input)|
| Search / filter      | **Derived state** (`useMemo`, `computed`, `$derived`)     |
| Product detail fetch | **Effects / async** (`useEffect`, `watchEffect`, `$effect`)|
| Checkout form        | Form handling, validation, refs                           |
| Wishlist toggle      | Local component state, persistence                        |
| Toast notifications  | **Slots / children / snippets** (composition)             |

This list is intentionally bigger than what we'll ship in v1. v1 likely
= product list + cart badge + add-to-cart + quantity stepper + search.
Those four cover state, derived state, two-way binding, and global state.

## 5. Tech Setup Notes

- **Astro** with all three integrations: `@astrojs/react`,
  `@astrojs/vue`, `@astrojs/svelte`.
- **Shared data**: a single `data/products.json` consumed by all three.
  No backend in v1 — keep the focus on UI code.
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
- **Styling**: Tailwind or vanilla CSS. Keep it boring so framework
  syntax stands out, not styling.

## 6. Decisions

- **Approach**: Hybrid (working shop + Rosetta reference pages).
- **Versions**: latest idiomatic syntax — **React 19**, **Vue 3.5+**
  (`<script setup>` + Composition API), **Svelte 5 (runes)**.
- **Language**: **TypeScript**, kept minimal — explicit prop contracts
  help comparison, but no over-typing.
- **Cross-framework store**: **nanostores** — framework-agnostic,
  tiny, has official `@nanostores/react`, `@nanostores/vue`, and
  Svelte interop via `$store` auto-subscriptions.
- **Hosting**: deferred. Astro static output keeps options open.

## 7. v1 Scope

Five features ship in v1:

1. **Product list** — list rendering, props.
2. **Add-to-cart button** — events, parent ↔ child communication.
3. **Cart badge in header** — global state via nanostores (centerpiece).
4. **Quantity stepper** — two-way binding idioms.
5. **Search / filter** — derived state.

## 8. Rough Build Order

1. Scaffold Astro + 3 integrations, render "hello" island in each.
2. Static product list page, one framework at a time.
3. Add the shared store + cart badge — the moment all three frameworks
   talk to each other is the centerpiece.
4. Quantity stepper (the two-way-binding showcase).
5. Search / filter (derived state).
6. `/compare/<feature>` pages with side-by-side source.
7. Polish landing + about.
