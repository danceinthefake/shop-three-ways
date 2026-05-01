import { persistentAtom } from '@nanostores/persistent';

export type Theme = 'light' | 'dark';

// Default encoding (no JSON) so the inline FOUC script in Layout.astro
// can read the value as a plain string without needing JSON.parse.
export const theme = persistentAtom<Theme>('shop-three-ways:theme', 'light');

export function toggleTheme() {
  theme.set(theme.get() === 'light' ? 'dark' : 'light');
}
