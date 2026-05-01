# shop-three-ways

The same e-commerce shop, built three times — in **React 19**, **Vue 3.5**, and **Svelte 5** — side-by-side as Astro islands sharing one cart store. A Rosetta-stone for developers fluent in one of {React, Vue, Svelte} who want to read the other two without translating between mental models.

Click "Compare in 3 ways" on any page to see the source side-by-side, with explanatory notes per framework.

## What's inside

- A working storefront — product list, search, cart, wishlist, product detail, checkout — where every UI piece ships in three frameworks at once.
- One shared `nanostores` cart store: clicking "Add to cart" in any framework's column updates the badges in all three.
- 12 feature comparisons under `/compare`, each loading the actual component source via `?raw` imports so the side-by-side view is always in sync with the running shop.
- Inline CompareSection modals on every demo page (no page navigation needed to read the comparison).
- Per-panel **source-size badges** (gzipped bytes + line count).
- **Glossary** at `/glossary` defining the terms that appear in the notes (subscribe, store, runes, useStore, v-model, bind:value, etc.).
- **Dark mode**, Astro **View Transitions**, `prefers-reduced-motion` guard on slide-banner timers, skip-to-content link, `aria-current` on the active nav link.

## The framework wins it actually shows

The point isn't that the frameworks are the same. They aren't. The comparison surfaces the wins each one has over the others:

- **Svelte** — `{#await}` collapses async fetch + state machine to four lines; `transition:fly` and `animate:flip` ship in the language; Svelte 5 parameterized `{#snippet}`s read like inline private components; `bind:group` is the cleanest radio-group binding.
- **Vue** — `v-model` (and `v-model.lazy`) handle two-way binding for free across text inputs, radios, and writable computeds; `<TransitionGroup>` covers list animations without a library; composables read like custom hooks but with auto-tracked deps.
- **React** — explicit `dependency array` makes data flow legible at the cost of verbosity; custom hooks are the cleanest abstraction story when you compose multiple hooks together; the ecosystem story is real even if it's not in this demo.

## Stack

- **[Astro 6](https://astro.build)** as the multi-framework host, with `@astrojs/react`, `@astrojs/vue`, `@astrojs/svelte`.
- **React 19**, **Vue 3.5** (`<script setup>` + Composition API), **Svelte 5** (runes mode).
- **[nanostores](https://github.com/nanostores/nanostores)** for the framework-agnostic shared state, with `@nanostores/react`, `@nanostores/vue`, and Svelte's native `$store` auto-subscription. Persisted via `@nanostores/persistent` (cart, wishlist, theme).
- **Tailwind CSS v4** (Vite plugin) with class-based dark mode (`@custom-variant dark`).
- **TypeScript** throughout.
- Astro's built-in `<Code>` component (Shiki) for source highlighting.
- **[DummyJSON](https://dummyjson.com)** as the read-only product API.

## Run locally

```bash
pnpm install
pnpm dev      # dev server on localhost:4321
pnpm build    # static build to ./dist/
pnpm preview  # serve the built site
```

Node 22+ required (see `.nvmrc`). Uses `pnpm` — `pnpm-lock.yaml` is committed.

## Project structure

```
src/
  components/      Framework components grouped by feature.
                   Naming: <Feature><Framework>.<ext>
                   e.g. ProductListReact.tsx, ProductListVue.vue,
                        ProductListSvelte.svelte
  hooks/           React custom hooks       (useCartReact.ts)
  composables/     Vue composables          (useCartVue.ts)
  lib/             Svelte rune-using fns    (useCartSvelte.svelte.ts)
                   plus sources.ts (the ?raw glob helper used by /compare)
  data/            Static manifests: features (the comparison index),
                   products (API helpers + types), shipping, promos.
  layouts/         Layout.astro — shared shell, nav, header,
                   theme toggle, Toaster, footer.
  pages/           Astro pages, including the dynamic
                   /products/[slug] and /compare/[feature] routes.
  stores/          Nanostore atoms: cart, wishlist, theme, toasts.
  styles/          global.css (Tailwind import + dark variant + spinner reset).
```

## Deploy on Cloudflare Pages

The build is plain static (`output: "static"`, no adapter). Cloudflare Pages auto-detects Astro.

1. Push the repo to GitHub.
2. Cloudflare Dashboard → Pages → **Create a project** → connect the GitHub repo.
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
4. Environment variables:
   - `NODE_VERSION=22` (matches `.nvmrc`; Cloudflare Pages defaults to an older Node otherwise).
5. Save and deploy. Subsequent pushes to `main` trigger a redeploy automatically.

That's it — no edge functions, no SSR adapter, no `wrangler.toml` needed for static deployment.

## Browser support

Modern evergreen only. The site uses:
- Native `<dialog>` (CompareSection modal)
- View Transitions API (Astro `ClientRouter`; falls back to plain navigation in non-supporting browsers)
- `@custom-variant` Tailwind v4 + `:where()` selectors
- `prefers-reduced-motion` and `prefers-color-scheme` media queries

Tested on current Chrome, Safari, and Firefox.

## Editing the comparison

The single source of truth for `/compare` and the inline modals is `src/data/features.ts`. To add a new comparison:

1. Drop the three framework files under `src/components/` (or `src/hooks/`, `src/composables/`, `src/lib/`).
2. Append a new entry to the `features` array in `src/data/features.ts` with the slug, title, concept, blurb, file basenames, and per-framework notes.
3. Add a `<CompareSection slug="..." />` trigger wherever the live demo lives.

The notes go through `linkifyNote()` which auto-anchors known terms to `/glossary`. To add a new linkable term, edit `TERM_LINKS` at the top of `features.ts` and add the matching `<dt id="...">` entry to `src/pages/glossary.astro`.
