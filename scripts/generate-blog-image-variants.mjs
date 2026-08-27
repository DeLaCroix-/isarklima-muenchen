import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const blogDir = join(root, 'public', 'images', 'blog');
const widths = [480, 640, 800, 960, 1280];
const sources = (await readdir(blogDir))
  .filter((file) => file.endsWith('.webp') && !/-\d+\.webp$/.test(file));

for (const file of sources) {
  const source = join(blogDir, file);
  const base = parse(file).name;
  for (const width of widths) {
    await sharp(source)
      .resize(width, Math.round(width * 880 / 1440), { fit: 'cover', position: 'attention' })
      .webp({ quality: width >= 1280 ? 84 : 82, effort: 5 })
      .toFile(join(blogDir, `${base}-${width}.webp`));
  }
}

console.log(`Generated ${sources.length * widths.length} responsive blog image variants.`);
