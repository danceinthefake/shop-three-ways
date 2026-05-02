/**
 * Generate Mermaid diagrams as static SVGs for the glossary.
 *
 * Run via `pnpm diagrams`. Produces a {name}-light.svg and {name}-dark.svg
 * under public/diagrams/ for every .mmd source under diagrams/.
 *
 * mmdc --scale 8 emits SVGs with width/height multiplied by 8 — high-DPI
 * intrinsic dimensions, displayed at any CSS size with crisp text.
 *
 * Requires Chrome headless (downloaded by puppeteer's postinstall). CI does
 * not need to run this — the generated SVGs are committed.
 */
import { readdirSync, mkdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const SRC_DIR = 'diagrams';
const OUT_DIR = 'public/diagrams';
const PUPPETEER_CFG = 'diagrams/puppeteer-config.json';
const SCALE = '8';

mkdirSync(OUT_DIR, { recursive: true });

const sources = readdirSync(SRC_DIR).filter((f) => f.endsWith('.mmd'));

if (sources.length === 0) {
  console.log('No .mmd files in diagrams/ — nothing to generate.');
  process.exit(0);
}

let failures = 0;
for (const file of sources) {
  const name = basename(file, extname(file));
  for (const theme of ['default', 'dark']) {
    const themeLabel = theme === 'default' ? 'light' : 'dark';
    const out = join(OUT_DIR, `${name}-${themeLabel}.svg`);
    const args = [
      '-i', join(SRC_DIR, file),
      '-o', out,
      '--scale', SCALE,
      '--theme', theme,
      '--backgroundColor', 'transparent',
      '--puppeteerConfigFile', PUPPETEER_CFG,
    ];
    console.log(`  ${file} → ${out}`);
    const result = spawnSync('pnpm', ['exec', 'mmdc', ...args], { stdio: 'inherit' });
    if (result.status !== 0) {
      console.error(`✗ Failed: ${file} (${themeLabel})`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} diagram(s) failed.`);
  process.exit(1);
}
console.log(`\n✓ Generated ${sources.length * 2} SVG file(s) at scale ${SCALE}.`);
