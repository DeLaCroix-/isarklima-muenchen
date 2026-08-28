import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = join(root, 'assets', 'generated');
const stockSourceDir = join(root, 'assets', 'source-stock', 'originals');
const outputDir = join(root, 'public', 'images', 'site');
const imageNames = [
  'hero-installation-detail',
  'commercial-installation-detail',
  'technical-planning-workbench',
  'outdoor-unit-installation-neutral',
  'quiet-bedroom-interior',
  'installation-material-detail',
  'airflow-interior-detail',
  'apartment-interior-face-free',
  'condominium-building-detail',
];
const widths = [320, 640, 800, 960, 1440, 1920];
const stockImageNames = ['commissioning-gauges', 'split-unit-interior'];

await mkdir(outputDir, { recursive: true });

for (const imageName of imageNames) {
  const source = join(sourceDir, `${imageName}.png`);
  for (const width of widths) {
    await sharp(source)
      .rotate()
      .resize(width, Math.round(width * 2 / 3), { fit: 'cover', position: 'attention' })
      .webp({ quality: width >= 1440 ? 84 : 82, effort: 5 })
      .toFile(join(outputDir, `${imageName}-${width}.webp`));
  }
}

for (const imageName of stockImageNames) {
  const source = join(stockSourceDir, `${imageName}.jpg`);
  for (const width of widths) {
    await sharp(source)
      .rotate()
      .resize(width, Math.round(width * 2 / 3), { fit: 'cover', position: 'attention' })
      .webp({ quality: 82, effort: 5 })
      .toFile(join(outputDir, `${imageName}-${width}.webp`));
  }
}

console.log(`Generated ${(imageNames.length + stockImageNames.length) * widths.length} face-free responsive image variants.`);
