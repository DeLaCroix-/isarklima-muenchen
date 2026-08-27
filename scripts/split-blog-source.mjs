import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = await readFile(join(root, 'content-source', 'blog-bilingual.md'), 'utf8');
const marker = /<!-- FILE: ([^ ]+) -->/g;
const matches = [...source.matchAll(marker)];
const imageSources = [
  'apartment-interior-face-free-1920.webp',
  'condominium-building-detail-1920.webp',
  'split-unit-interior-1920.webp',
  'outdoor-unit-installation-detail-1920.webp',
  'technical-planning-workbench-1920.webp',
  'commercial-installation-detail-1920.webp',
];

await mkdir(join(root, 'src', 'content', 'blog', 'en'), { recursive: true });
await mkdir(join(root, 'public', 'images', 'blog'), { recursive: true });

for (let index = 0; index < matches.length; index++) {
  const path = matches[index][1];
  const start = matches[index].index + matches[index][0].length;
  const end = matches[index + 1]?.index ?? source.length;
  let block = source.slice(start, end).trim();
  const english = path.startsWith('/en/');
  const slug = path.split('/').filter(Boolean).at(-1);
  const finalHeading = english ? 'Request a project quote' : 'Projekt anfragen';
  const ctaPattern = new RegExp(`\\n## ${finalHeading}\\n\\n([\\s\\S]+)$`);
  const cta = block.match(ctaPattern)?.[1]?.trim().replace(/\s+/g, ' ') ?? '';
  block = block.replace(ctaPattern, '').trim();
  block = block.replace(/^(---[\s\S]*?draft:\s*false)\n---/, `$1\nctaIntro: ${JSON.stringify(cta)}\n---`);

  const destination = english
    ? join(root, 'src', 'content', 'blog', 'en', `${slug}.md`)
    : join(root, 'src', 'content', 'blog', `${slug}.md`);
  await writeFile(destination, `${block}\n`, 'utf8');

  const imageMatch = block.match(/^image:\s*"([^"]+)"/m);
  if (imageMatch) {
    const target = join(root, 'public', imageMatch[1].replace(/^\//, ''));
    const original = join(root, 'public', 'images', 'site', imageSources[Math.floor(index / 2) % imageSources.length]);
    await sharp(original).rotate().resize(1440, 880, { fit: 'cover', position: 'attention' }).webp({ quality: 82, effort: 5 }).toFile(target);
  }
}

console.log(`Created ${matches.length} CRM-compatible blog files and images.`);
