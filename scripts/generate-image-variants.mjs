import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = join(root, 'assets', 'generated');
const outputDir = join(root, 'public', 'images', 'site');
const imageNames = [
  'hero-installation-detail',
  'commercial-installation-detail',
  'technical-planning-workbench',
  'outdoor-unit-installation-detail',
  'quiet-bedroom-interior',
  'installation-material-detail',
  'airflow-interior-detail',
];
const widths = [640, 960, 1440, 1920];

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

console.log(`Generated ${imageNames.length * widths.length} face-free responsive image variants.`);
