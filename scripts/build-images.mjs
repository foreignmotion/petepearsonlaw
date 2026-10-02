// Generates the optimized images in public/assets/img from the originals in source-assets/.
// Run with `npm run images` after replacing any source file.
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';

const SRC = new URL('../source-assets/', import.meta.url);
const OUT = new URL('../public/assets/img/', import.meta.url);
const src = (f) => new URL(f, SRC).pathname;
const out = (f) => new URL(f, OUT).pathname;

await mkdir(OUT, { recursive: true });

// Portrait: 1365x2048 cut-out on transparent. Rendered between ~280 and ~590 CSS px wide.
const PORTRAIT_WIDTHS = [360, 480, 640, 800, 1000, 1200];
for (const w of PORTRAIT_WIDTHS) {
  const base = sharp(src('pete-pearson-portrait.png')).resize({ width: w });
  await base.clone().avif({ quality: 55, effort: 6 }).toFile(out(`pete-pearson-portrait-${w}.avif`));
  await base.clone().webp({ quality: 78, alphaQuality: 90, effort: 6 }).toFile(out(`pete-pearson-portrait-${w}.webp`));
}
// PNG fallback for browsers without AVIF/WebP.
await sharp(src('pete-pearson-portrait.png'))
  .resize({ width: 800 })
  .png({ palette: true, quality: 85, effort: 10 })
  .toFile(out('pete-pearson-portrait-800.png'));

// Logos are tiny already; copy as-is.
for (const f of ['logo-ink.png', 'logo-white.png']) await copyFile(src(f), out(f));

// Favicons from the square mark (ink on transparent; paper ground for apple-touch).
await sharp(src('mark-ink.png')).resize(32, 32).png().toFile(out('../../favicon-32.png'));
await sharp(src('mark-ink.png')).resize(192, 192).png().toFile(out('../../icon-192.png'));
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#f5f3ee' } })
  .composite([{ input: await sharp(src('mark-ink.png')).resize(132, 132).toBuffer(), gravity: 'center' }])
  .png()
  .toFile(out('../../apple-touch-icon.png'));

// Open Graph card: slate ground, white lockup left, portrait right (bottom-cropped like the hero).
const W = 1200, H = 630;
const logo = await sharp(src('logo-white.png')).resize({ width: 600 }).toBuffer();
const portrait = await sharp(src('pete-pearson-portrait.png')).resize({ height: 760 }).toBuffer();
const pMeta = await sharp(portrait).metadata();
const portraitCropped = await sharp(portrait)
  .extract({ left: 0, top: 0, width: pMeta.width, height: H - 30 })
  .toBuffer();
await sharp({ create: { width: W, height: H, channels: 4, background: '#395165' } })
  .composite([
    { input: logo, left: 72, top: Math.round(H / 2 - (600 * 267) / 1532 / 2) },
    { input: portraitCropped, left: W - pMeta.width + 40, top: 30 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out('og-image.jpg'));

console.log('images built');
