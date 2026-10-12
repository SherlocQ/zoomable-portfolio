/**
 * Makes display-size copies of the carousel (gallery) images.
 *
 * Gallery sources are kept at their original size (some are 8000px+), but a
 * carousel shows them at ~700px and the Lightbox at screen size; decoding the
 * originals made slide changes stutter. For every gallery image whose longest
 * side is over MAX, this writes a copy with that side at MAX into
 * public/images/resized/ (mirroring the path under public/images/) and lists
 * it in src/data/resizedImages.json; the app then shows the copy everywhere
 * (see src/utils/mediaSrc.js). Originals are never touched.
 *
 * Run after adding or replacing gallery images:  node scripts/resize-gallery-images.mjs
 * Uses macOS `sips`.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { portfolioData } from '../src/data/portfolio.js';

const MAX = 2400;
const JPEG_QUALITY = 82;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Every image src inside a `type: 'gallery'` section, anywhere in the data. */
function gallerySources(node, out = new Set()) {
  if (Array.isArray(node)) node.forEach((n) => gallerySources(n, out));
  else if (node && typeof node === 'object') {
    if (node.type === 'gallery' && Array.isArray(node.images)) node.images.forEach((im) => im.src && out.add(im.src));
    Object.values(node).forEach((v) => gallerySources(v, out));
  }
  return out;
}

const size = (file) => {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  return [+out.match(/pixelWidth: (\d+)/)[1], +out.match(/pixelHeight: (\d+)/)[1]];
};

const resized = [];
let made = 0;
for (const src of [...gallerySources(portfolioData)].sort()) {
  const file = join(root, 'public', src);
  if (!existsSync(file)) { console.warn(`missing: ${src}`); continue; }
  if (Math.max(...size(file)) <= MAX) continue;
  const target = join(root, 'public', src.replace(/^\/images\//, '/images/resized/'));
  if (!existsSync(target) || statSync(target).mtimeMs < statSync(file).mtimeMs) {
    mkdirSync(dirname(target), { recursive: true });
    const args = ['-Z', String(MAX)];
    if (/\.jpe?g$/i.test(src)) args.push('-s', 'formatOptions', String(JPEG_QUALITY));
    execFileSync('sips', [...args, file, '--out', target], { stdio: 'ignore' });
    made++;
  }
  resized.push(src);
}

writeFileSync(join(root, 'src/data/resizedImages.json'), `${JSON.stringify(resized, null, 2)}\n`);
console.log(`${resized.length} gallery images have a ${MAX}px copy (${made} written).`);
