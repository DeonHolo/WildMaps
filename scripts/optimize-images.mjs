import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const imagesDir = path.join(publicDir, 'images');

const targets = [
  // Onboarding / marketing panels (big)
  { in: 'WELCOME TO WILDMAPS.png', out: 'WELCOME TO WILDMAPS.webp', width: 900, quality: 88 },
  { in: 'FIND QUEST NODES.png', out: 'FIND QUEST NODES.webp', width: 900, quality: 88 },
  { in: 'Scan the Building.png', out: 'Scan the Building.webp', width: 900, quality: 88 },
  { in: 'Earn Your Badges.png', out: 'Earn Your Badges.webp', width: 900, quality: 88 },

  // Hint images (modal widths)
  { in: 'Cafe_Hint.png', out: 'Cafe_Hint.webp', width: 900, quality: 90 },
  { in: 'Cafe_Hint_Revealed.png', out: 'Cafe_Hint_Revealed.webp', width: 900, quality: 90 },
  { in: 'Library_Hint.png', out: 'Library_Hint.webp', width: 900, quality: 90 },
  { in: 'Library_Hint_Revealed.png', out: 'Library_Hint_Revealed.webp', width: 900, quality: 90 },
  { in: 'Monument_Hint.png', out: 'Monument_Hint.webp', width: 900, quality: 90 },
  { in: 'Monument_Hint_Revealed.png', out: 'Monument_Hint_Revealed.webp', width: 900, quality: 90 },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function existsOrWarn(file) {
  if (!fs.existsSync(file)) {
    console.warn('Missing:', file);
    return false;
  }
  return true;
}

ensureDir(imagesDir);

let didAny = false;

for (const t of targets) {
  const inPath = path.join(imagesDir, t.in);
  const outPath = path.join(imagesDir, t.out);
  if (!existsOrWarn(inPath)) continue;

  const pipeline = sharp(inPath, { failOn: 'none' })
    .resize({ width: t.width, withoutEnlargement: true })
    .webp({ quality: t.quality });

  await pipeline.toFile(outPath);
  didAny = true;
}

if (!didAny) {
  console.log('No images optimized (missing inputs).');
} else {
  console.log('Optimized images written to public/images/*.webp');
}

