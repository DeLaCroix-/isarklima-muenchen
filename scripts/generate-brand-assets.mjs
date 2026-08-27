import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mark = join(root, 'public', 'brand', 'isarklima-mark.svg');
const hero = join(root, 'public', 'images', 'site', 'hero-installation-detail-1920.webp');
const ogDir = join(root, 'public', 'images', 'og');
await mkdir(ogDir, { recursive: true });

await sharp(mark).resize(64, 64).png().toFile(join(root, 'public', 'favicon.png'));
await sharp(mark).resize(180, 180).png().toFile(join(root, 'public', 'apple-touch-icon.png'));

const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#071a22" stop-opacity=".98"/><stop offset=".68" stop-color="#071a22" stop-opacity=".82"/><stop offset="1" stop-color="#071a22" stop-opacity=".15"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="72" y="235" fill="#56d8d0" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4">ISARKLIMA · MÜNCHEN</text>
  <text x="72" y="330" fill="#ffffff" font-family="Arial, sans-serif" font-size="64" font-weight="800">Klimaanlage installieren</text>
  <text x="72" y="405" fill="#ffffff" font-family="Arial, sans-serif" font-size="64" font-weight="800">lassen in München</text>
  <text x="72" y="488" fill="#d9ff65" font-family="Arial, sans-serif" font-size="24" font-weight="700">Planung · Montage · Übergabe</text>
</svg>`);

await sharp(hero)
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([{ input: overlay }, { input: await sharp(mark).resize(86, 86).png().toBuffer(), left: 72, top: 74 }])
  .jpeg({ quality: 86, progressive: true })
  .toFile(join(ogDir, 'isarklima-muenchen.jpg'));

console.log('Generated favicon, Apple touch icon and Open Graph image.');
