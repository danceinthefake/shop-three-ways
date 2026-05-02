// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

// Three framework integrations + Tailwind + Astro itself can attach >10
// FS-watcher listeners during dev, tripping Node's default emitter cap and
// printing a "possible memory leak" warning. Bumping the limit silences a
// false positive — there is no actual leak.
process.setMaxListeners(20);

// https://astro.build/config
export default defineConfig({
  integrations: [react(), vue(), svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});