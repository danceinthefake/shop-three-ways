import { gzipSync } from 'node:zlib';

// Source files we make available to the comparison pages. Globbing four
// directories so React hooks, Vue composables, and Svelte rune-using
// functions can show up next to the framework components.
const sources: Record<string, string> = {
  ...(import.meta.glob('../components/*.{tsx,vue,svelte}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>),
  ...(import.meta.glob('../hooks/*.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>),
  ...(import.meta.glob('../composables/*.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>),
  ...(import.meta.glob('../lib/*.svelte.ts', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>),
};

export function loadSource(name: string): string {
  // Match by basename across all four configured dirs. The features.ts
  // manifest stays terse — files: { react: 'X.tsx' } — without needing
  // to know which directory the file lives in.
  const found = Object.entries(sources).find(([k]) => k.endsWith('/' + name));
  if (!found) throw new Error(`Source not found: ${name}`);
  return found[1];
}

export type SourceSize = {
  bytes: number;
  gzip: number;
  lines: number;
};

export function measureSource(src: string): SourceSize {
  return {
    bytes: Buffer.byteLength(src, 'utf8'),
    gzip: gzipSync(src).length,
    lines: src.split('\n').length,
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}
