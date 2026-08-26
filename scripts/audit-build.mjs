import { load } from 'cheerio';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const failures = [];
const normalize = (value) => value.replace(/\s+/g, ' ').trim();

async function findHtml(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) files.push(...await findHtml(full));
    else if (item.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function urlForFile(file) {
  const rel = relative(dist, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  return `/${rel.replace(/index\.html$/, '')}`;
}

function fail(path, message) { failures.push(`${path}: ${message}`); }
function headingList($) { return $('h1,h2,h3').map((_, el) => ({ tag: el.tagName, text: normalize($(el).text()) })).get(); }

const htmlFiles = await findHtml(dist);
const pages = new Map();
for (const file of htmlFiles) {
  const path = urlForFile(file);
  const html = await readFile(file, 'utf8');
  const $ = load(html);
  pages.set(path, { $, html, file });
  const expectedLang = path.startsWith('/en/') ? 'en-DE' : 'de-DE';
  if ($('html').attr('lang') !== expectedLang) fail(path, `expected lang=${expectedLang}`);
  if ($('h1').length !== 1) fail(path, `expected one H1, found ${$('h1').length}`);
  if (!$('meta[name="description"]').attr('content')) fail(path, 'missing meta description');
  if ($('meta[name="robots"]').attr('content') !== 'noindex, nofollow') fail(path, 'preview must remain noindex, nofollow');
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical || new URL(canonical).pathname !== (path === '/404/' ? '/404/' : path)) fail(path, `incorrect canonical ${canonical ?? '(missing)'}`);
  if (path !== '/404/' && $('link[rel="alternate"][hreflang]').length !== 3) fail(path, 'expected three hreflang entries');
  $('img').each((_, image) => {
    const element = $(image);
    if (!element.attr('width') || !element.attr('height')) fail(path, `image lacks dimensions: ${element.attr('src')}`);
    if (element.attr('alt') == null) fail(path, `image lacks alt: ${element.attr('src')}`);
  });
  $('script[type="application/ld+json"]').each((_, script) => {
    try { JSON.parse($(script).html() ?? ''); } catch { fail(path, 'invalid JSON-LD'); }
  });
  $('form[data-enabled="false"]').each((_, form) => {
    if ($(form).attr('action')) fail(path, 'inactive form has an action');
    if (!$(form).find('button[type="submit"]').is('[disabled]')) fail(path, 'inactive form submit is not disabled');
  });
}

const knownRoutes = new Set(pages.keys());
for (const [path, { $ }] of pages) {
  $('a[href]').each((_, anchor) => {
    const href = $(anchor).attr('href');
    if (!href?.startsWith('/') || href.startsWith('//')) return;
    const target = href.split('#')[0].split('?')[0] || path;
    if (/\.(xml|txt|webp|svg|ico|jpg|png|pdf)$/i.test(target)) return;
    const normalized = target.endsWith('/') ? target : `${target}/`;
    if (!knownRoutes.has(normalized) && !knownRoutes.has(target)) fail(path, `broken internal link ${href}`);
  });
}

const generated = JSON.parse(await readFile(join(root, 'src', 'data', 'pages.generated.json'), 'utf8'));
for (const page of generated) {
  const built = pages.get(page.path);
  if (!built) { fail(page.path, 'page was not built'); continue; }
  const expected = [{ tag: 'h1', text: page.h1 }];
  for (const section of page.sections) {
    expected.push({ tag: 'h2', text: section.title });
    for (const subsection of section.subsections ?? []) expected.push({ tag: 'h3', text: subsection.title });
  }
  expected.push({ tag: 'h2', text: page.faqTitle });
  for (const item of page.faq) expected.push({ tag: 'h3', text: item.question });
  expected.push({ tag: 'h2', text: page.formTitle });
  const actual = headingList(built.$);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(page.path, `heading contract mismatch\n  expected ${JSON.stringify(expected)}\n  actual   ${JSON.stringify(actual)}`);
  if (built.$('form.project-form').length !== 1) fail(page.path, 'commercial page must end with one project form');
}

const contentRoot = join(root, 'src', 'content', 'blog');
async function findMarkdown(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) files.push(...await findMarkdown(full));
    else if (/\.mdx?$/.test(item.name)) files.push(full);
  }
  return files;
}

for (const file of await findMarkdown(contentRoot)) {
  const markdown = await readFile(file, 'utf8');
  const rel = relative(contentRoot, file).split(sep).join('/').replace(/\.mdx?$/, '');
  const isEnglish = rel.startsWith('en/');
  const slug = rel.split('/').at(-1);
  const path = isEnglish ? `/en/guides/${slug}/` : `/ratgeber/${slug}/`;
  const built = pages.get(path);
  if (!built) { fail(path, 'published article was not built'); continue; }
  const title = markdown.match(/^title:\s*"([^"]+)"/m)?.[1];
  const sourceHeadings = [...markdown.matchAll(/^(##|###)\s+(.+)$/gm)].map((match) => ({ tag: match[1] === '##' ? 'h2' : 'h3', text: normalize(match[2]) }));
  const expected = [{ tag: 'h1', text: title }, ...sourceHeadings, { tag: 'h2', text: isEnglish ? 'Request a project quote' : 'Projekt anfragen' }];
  const actual = headingList(built.$);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(path, 'article heading contract mismatch');
  if (built.$('form.project-form').length !== 1) fail(path, 'article must end with one project form');
}

if (htmlFiles.length !== 39) fail('build', `expected 39 HTML pages including 404, found ${htmlFiles.length}`);
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
if (!robots.includes('Disallow: /')) fail('/robots.txt', 'preview robots must disallow crawling');

if (failures.length) {
  console.error(`Build audit failed with ${failures.length} issue(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Build audit passed: ${htmlFiles.length} HTML pages, 22 commercial heading contracts, 12 article contracts, internal links, metadata, hreflang, images and inactive forms.`);
