import { gzipSync } from 'node:zlib';

const sources = import.meta.glob('../components/*.{tsx,vue,svelte}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function loadSource(name: string): string {
  const key = `../components/${name}`;
  const src = sources[key];
  if (!src) throw new Error(`Source not found: ${key}`);
  return src;
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
