import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const src = path.join(root, 'public', 'images', 'WildMaps! Logo no fog.png');

const outHeader = path.join(root, 'public', 'images', 'wildmaps-logo-trimmed.png');
const out192 = path.join(root, 'public', 'app-icon-192.png');
const out512 = path.join(root, 'public', 'app-icon-512.png');
const outAny = path.join(root, 'public', 'app-icon.png');

if (!fs.existsSync(src)) {
  throw new Error(`Source logo not found: ${src}`);
}

const base = sharp(src).trim();

// Header icon: keep transparency, size tuned for UI (still crisp on retina)
await base
  .resize(128, 128, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(outHeader);

// PWA icons: square PNGs with transparency
await base
  .resize(192, 192, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(out192);

await base
  .resize(512, 512, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(out512);

// Convenience copy used by some tooling
fs.copyFileSync(out512, outAny);

console.log('Generated icons:');
console.log('-', path.relative(root, outHeader));
console.log('-', path.relative(root, out192));
console.log('-', path.relative(root, out512));
console.log('-', path.relative(root, outAny));

