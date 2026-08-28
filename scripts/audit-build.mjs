import { load } from 'cheerio';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const expectedSiteUrl = process.env.PUBLIC_SITE_URL ?? 'https://isarklima-deutschland.netlify.app';
const expectedSiteOrigin = new URL(expectedSiteUrl).origin;
const failures = [];
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const discouragedMarketingPhrases = [
  'münchen',
  'munich',
  'bayern',
  'bavaria',
  'munich focus',
  'fokus münchen',
  'munich and surrounding areas',
  'münchen und umgebung',
  'münchen und im umland',
  'new installations',
  'neue installationen',
  'new air conditioning systems',
  'new air-conditioning systems',
  'new split air conditioning',
  'new split-system installation',
  'neue klimaanlagen',
  'neue split-klimaanlagen',
  'our focus: new air conditioning installations',
  'unser fokus: neue klimaanlagen-installationen',
  'air conditioning installation · munich',
  'klimaanlagen-montage · münchen',
  'munich · city and district',
  'münchen · stadt und landkreis',
  'prepare a munich project',
  'projekt in münchen vorbereiten',
  'selected nearby locations',
  'ausgewählte orte in der region',
];
const retiredFaceImageFamilies = [
  'apartment-comfort',
  'hero-technician',
  'installation-team',
  'technician-outdoor-portrait',
  'outdoor-unit-site',
];
const retiredPublicGeographicImages = [
  'images/site/munich-city-',
  'images/site/outdoor-unit-installation-detail-',
  'images/og/isarklima-muenchen.jpg',
  'images/blog/klimaanlage-aussengeraet-laerm.webp',
  'images/blog/air-conditioning-outdoor-unit-noise.webp',
];
const retiredPublicGeographicPatterns = [
  /^images\/blog\/klimaanlage-aussengeraet-laerm-\d+\.webp$/,
  /^images\/blog\/air-conditioning-outdoor-unit-noise-\d+\.webp$/,
];

async function findHtml(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) files.push(...await findHtml(full));
    else if (item.name.endsWith('.html')) files.push(full);
  }
  return files;
}

async function findTextArtifacts(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) files.push(...await findTextArtifacts(full));
    else if (/\.(html|xml|txt)$/i.test(item.name)) files.push(full);
  }
  return files;
}

async function findFiles(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) files.push(...await findFiles(full));
    else files.push(full);
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

function parseArchitectureContracts(markdown) {
  const contracts = new Map();
  const routeHeading = /^###\s+`([^`]+)`\s+↔\s+`([^`]+)`\s*$/gm;
  for (const match of markdown.matchAll(routeHeading)) {
    const tail = markdown.slice(match.index + match[0].length);
    const nextHeading = tail.search(/\r?\n#{2,3}\s+/);
    const block = nextHeading === -1 ? tail : tail.slice(0, nextHeading);
    const de = [];
    const en = [];
    let pendingTag;
    for (const line of block.split(/\r?\n/)) {
      const h3 = line.match(/^\s+- H3:\s+`([^`]+)`\s+→\s+`([^`]+)`\s*$/);
      if (h3) {
        de.push({ tag: 'h3', text: h3[1] });
        en.push({ tag: 'h3', text: h3[2] });
        pendingTag = undefined;
        continue;
      }
      const primary = line.match(/^- H([12]):\s+`([^`]+)`(?:\s+→\s+`([^`]+)`)?\s*$/);
      if (primary) {
        const tag = `h${primary[1]}`;
        de.push({ tag, text: primary[2] });
        if (primary[3]) {
          en.push({ tag, text: primary[3] });
          pendingTag = undefined;
        } else {
          pendingTag = tag;
        }
        continue;
      }
      const english = line.match(/^\s+- EN:\s+`([^`]+)`\s*$/);
      if (english && pendingTag) {
        en.push({ tag: pendingTag, text: english[1] });
        pendingTag = undefined;
      }
    }
    contracts.set(match[1], de);
    contracts.set(match[2], en);
  }
  return contracts;
}

function parseArticleTitleContracts(markdown) {
  const section = markdown.match(/^### Artículos publicados\s*$([\s\S]*?)(?=^## Páginas legales\s*$)/m)?.[1] ?? '';
  return [...section.matchAll(/^\d+\.\s+`([^`]+)`\s*\r?\n\s+- EN:\s+`([^`]+)`\s*$/gm)].map((match) => ({ de: match[1], en: match[2] }));
}

const htmlFiles = await findHtml(dist);
const textArtifacts = await findTextArtifacts(dist);
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
const robotsAllowsRoot = /^Allow:\s*\/$/m.test(robots);
const robotsBlocksRoot = /^Disallow:\s*\/$/m.test(robots);
const indexSite = robotsAllowsRoot && !robotsBlocksRoot;
if (robotsAllowsRoot === robotsBlocksRoot) fail('/robots.txt', 'robots must declare exactly one root policy: Allow or Disallow');
const pages = new Map();
const titleOwners = new Map();
const descriptionOwners = new Map();
const localImageReferences = new Set();
for (const file of textArtifacts) {
  const rel = `/${relative(dist, file).split(sep).join('/')}`;
  const normalizedText = normalize(await readFile(file, 'utf8')).toLocaleLowerCase('de-DE');
  for (const phrase of discouragedMarketingPhrases) {
    if (normalizedText.includes(phrase)) fail(rel, `discouraged marketing phrase: ${phrase}`);
  }
  for (const family of retiredFaceImageFamilies) {
    if (normalizedText.includes(family)) fail(rel, `retired face-bearing image is still referenced: ${family}`);
  }
}

for (const producer of ['generate-page-data.mjs', 'split-blog-source.mjs', 'generate-brand-assets.mjs']) {
  const source = (await readFile(join(root, 'scripts', producer), 'utf8')).toLocaleLowerCase('en');
  for (const family of retiredFaceImageFamilies) {
    if (source.includes(family)) fail(`/scripts/${producer}`, `retired face-bearing source is still configured: ${family}`);
  }
}

const publicImageFiles = await findFiles(join(root, 'public', 'images'));
for (const marker of [...retiredFaceImageFamilies, 'preview-technician']) {
  const match = publicImageFiles.find((file) => file.toLocaleLowerCase('en').includes(marker));
  if (match) fail('/images/', `retired face-bearing image remains public: ${relative(join(root, 'public'), match).split(sep).join('/')}`);
}
for (const marker of retiredPublicGeographicImages) {
  const match = publicImageFiles.find((file) => relative(join(root, 'public'), file).split(sep).join('/').toLocaleLowerCase('en').includes(marker));
  if (match) fail('/images/', `retired location-specific image remains public: ${relative(join(root, 'public'), match).split(sep).join('/')}`);
}
for (const pattern of retiredPublicGeographicPatterns) {
  const match = publicImageFiles.find((file) => pattern.test(relative(join(root, 'public'), file).split(sep).join('/').toLocaleLowerCase('en')));
  if (match) fail('/images/', `retired location-specific image remains public: ${relative(join(root, 'public'), match).split(sep).join('/')}`);
}
for (const flag of ['flag-uk.svg', 'flag-de.svg']) {
  try {
    const source = await readFile(join(root, 'public', 'flags', flag), 'utf8');
    if (!/<svg\b/i.test(source)) fail('/flags/', `${flag} is not an SVG document`);
  } catch {
    fail('/flags/', `missing language flag ${flag}`);
  }
}
for (const file of htmlFiles) {
  const path = urlForFile(file);
  const html = await readFile(file, 'utf8');
  const $ = load(html);
  pages.set(path, { $, html, file });
  const expectedLang = path.startsWith('/en/') ? 'en-DE' : 'de-DE';
  const expectedLanguageSelector = expectedLang === 'de-DE'
    ? { hreflang: 'en', ariaLabel: 'English — zur englischen Version wechseln', visibleLabel: 'English', flag: '/flags/flag-uk.svg' }
    : { hreflang: 'de', ariaLabel: 'Deutsch — switch to the German version', visibleLabel: 'Deutsch', flag: '/flags/flag-de.svg' };
  if ($('html').attr('lang') !== expectedLang) fail(path, `expected lang=${expectedLang}`);
  if ($('meta[property="og:locale"]').attr('content') !== (expectedLang === 'de-DE' ? 'de_DE' : 'en_DE')) fail(path, 'Open Graph locale must match the page locale');
  const rssDiscovery = $('link[rel="alternate"][type="application/rss+xml"]');
  const expectedRssPath = expectedLang === 'de-DE' ? '/rss.xml' : '/en/rss.xml';
  if (rssDiscovery.length !== 1 || rssDiscovery.attr('href') !== expectedRssPath) fail(path, `expected one localized RSS discovery link to ${expectedRssPath}`);
  if ($('h1').length !== 1) fail(path, `expected one H1, found ${$('h1').length}`);
  const documentTitle = normalize($('title').text());
  const metaDescription = normalize($('meta[name="description"]').attr('content') ?? '');
  if (!documentTitle) fail(path, 'missing document title');
  else {
    if (documentTitle.length > 65) fail(path, `document title is ${documentTitle.length} characters; maximum is 65`);
    const previousOwner = titleOwners.get(documentTitle);
    if (previousOwner) fail(path, `duplicate document title also used by ${previousOwner}`);
    else titleOwners.set(documentTitle, path);
  }
  if (!metaDescription) fail(path, 'missing meta description');
  else {
    const previousOwner = descriptionOwners.get(metaDescription);
    if (previousOwner) fail(path, `duplicate meta description also used by ${previousOwner}`);
    else descriptionOwners.set(metaDescription, path);
  }
  const expectedRobotsMeta = path === '/404/' || !indexSite ? 'noindex, nofollow' : 'index, follow';
  if ($('meta[name="robots"]').attr('content') !== expectedRobotsMeta) {
    fail(path, `expected robots meta "${expectedRobotsMeta}" in ${indexSite ? 'indexable' : 'preview'} mode`);
  }
  const canonical = $('link[rel="canonical"]').attr('href');
  let canonicalUrl;
  try { canonicalUrl = canonical ? new URL(canonical) : undefined; } catch { canonicalUrl = undefined; }
  if (!canonicalUrl || canonicalUrl.pathname !== (path === '/404/' ? '/404/' : path)) fail(path, `incorrect canonical ${canonical ?? '(missing)'}`);
  else if (canonicalUrl.origin !== expectedSiteOrigin) fail(path, `canonical uses unexpected origin ${canonicalUrl.origin}`);
  const alternateLinks = $('link[rel="alternate"][hreflang]');
  if (path !== '/404/' && alternateLinks.length !== 3) fail(path, 'expected three hreflang entries');
  if (path === '/404/' && alternateLinks.length !== 0) fail(path, '404 must not advertise a false language alternate');
  alternateLinks.each((_, link) => {
    const href = $(link).attr('href');
    let alternateUrl;
    try { alternateUrl = href ? new URL(href) : undefined; } catch { alternateUrl = undefined; }
    if (!alternateUrl) fail(path, `invalid hreflang URL ${href ?? '(missing)'}`);
    else if (alternateUrl.origin !== expectedSiteOrigin) fail(path, `hreflang uses unexpected origin ${alternateUrl.origin}`);
  });
  const languageSelector = $('.site-header .nav-language');
  if (languageSelector.length !== 1) {
    fail(path, `expected one header language selector, found ${languageSelector.length}`);
  } else {
    if (languageSelector.attr('hreflang') !== expectedLanguageSelector.hreflang) fail(path, `language selector must use hreflang=${expectedLanguageSelector.hreflang}`);
    if (languageSelector.attr('aria-label') !== expectedLanguageSelector.ariaLabel) fail(path, `language selector has incorrect aria-label`);
    if (languageSelector.find('span').first().text().trim() !== expectedLanguageSelector.visibleLabel) fail(path, `language selector has incorrect visible label`);
    const flag = languageSelector.find('img');
    if (flag.length !== 1) {
      fail(path, `expected one language flag image, found ${flag.length}`);
    } else {
      if (flag.attr('src') !== expectedLanguageSelector.flag) fail(path, `language selector must use ${expectedLanguageSelector.flag}`);
      if (flag.attr('width') !== '24' || flag.attr('height') !== '16') fail(path, 'language flag must be 24x16');
      if (flag.attr('alt') !== '') fail(path, 'language flag must have empty alt text');
      if (flag.attr('aria-hidden') !== 'true') fail(path, 'language flag must use aria-hidden=true');
    }
  }
  const contactCta = $('.site-header .header-cta');
  const expectedContactPath = expectedLang === 'de-DE' ? '/kontakt/' : '/en/contact/';
  if (contactCta.attr('href') !== expectedContactPath) fail(path, `header contact CTA must link to ${expectedContactPath}`);
  if (path === expectedContactPath && contactCta.attr('aria-current') !== 'page') fail(path, 'contact CTA must expose the current-page state');
  if (path !== expectedContactPath && contactCta.attr('aria-current')) fail(path, 'contact CTA must not expose a false current-page state');
  $('img').each((_, image) => {
    const element = $(image);
    if (!element.attr('width') || !element.attr('height')) fail(path, `image lacks dimensions: ${element.attr('src')}`);
    if (element.attr('alt') == null) fail(path, `image lacks alt: ${element.attr('src')}`);
    const src = element.attr('src');
    if (src) localImageReferences.add(src);
  });
  $('img[srcset], source[srcset]').each((_, source) => {
    for (const candidate of ($(source).attr('srcset') ?? '').split(',')) {
      const reference = candidate.trim().split(/\s+/)[0];
      if (reference) localImageReferences.add(reference);
    }
  });
  $('.article-image img, .guide-image img').each((_, image) => {
    const element = $(image);
    if (!element.attr('srcset') || !element.attr('sizes')) fail(path, `editorial image must be responsive: ${element.attr('src') ?? '(missing src)'}`);
  });
  $('script[type="application/ld+json"]').each((_, script) => {
    try { JSON.parse($(script).html() ?? ''); } catch { fail(path, 'invalid JSON-LD'); }
  });
  if ($('article[role]').length) fail(path, 'article elements must use their native semantic role');
  $('form[data-enabled="false"]').each((_, form) => {
    if ($(form).attr('action')) fail(path, 'inactive form has an action');
    if (!$(form).find('button[type="submit"]').is('[disabled]')) fail(path, 'inactive form submit is not disabled');
  });
  if ($('form.project-form').length) {
    const privacyLinks = $('.form-consent a[href]');
    const expectedPrivacyPath = expectedLang === 'de-DE' ? '/datenschutz/' : '/en/privacy/';
    if (privacyLinks.length !== 1) fail(path, 'project form must contain exactly one privacy link');
    else if (privacyLinks.attr('href') !== expectedPrivacyPath) fail(path, `project form must link to ${expectedPrivacyPath}`);
  }
  $('a[href^="#"]').each((_, anchor) => {
    const fragment = $(anchor).attr('href')?.slice(1);
    const hasTarget = fragment && $('[id]').toArray().some((element) => $(element).attr('id') === fragment);
    if (fragment && !hasTarget) fail(path, `broken same-page fragment #${fragment}`);
  });
  const contactCopy = normalize($('.contact-panel .contact-copy').text()).toLocaleLowerCase('de-DE');
  const mentionsFiles = /\b(photo(?:graph)?s?|fotos?|plans?|grundriss)\b/.test(contactCopy);
  const explainsLaterSharing = /approved sharing method|confirmed channel|requested later|bestätigten übermittlungsweg|bestätigter übermittlungsweg|später angefordert/.test(contactCopy);
  if (mentionsFiles && !explainsLaterSharing) fail(path, 'contact copy mentions files without explaining the later sharing method');
}

const distFiles = new Set((await findFiles(dist)).map((file) => `/${relative(dist, file).split(sep).join('/')}`));
for (const reference of localImageReferences) {
  let pathname;
  try {
    const url = new URL(reference, `${expectedSiteOrigin}/`);
    if (url.origin !== expectedSiteOrigin) continue;
    pathname = decodeURIComponent(url.pathname);
  } catch {
    fail('/images/', `invalid image reference ${reference}`);
    continue;
  }
  if (!distFiles.has(pathname)) fail('/images/', `image reference does not exist in build output: ${pathname}`);
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

function frontmatterScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'));
  if (!match) return undefined;
  const value = match[1].trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try { return JSON.parse(value); } catch { return value.slice(1, -1); }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

function frontmatterTranslations(frontmatter) {
  const scalar = frontmatterScalar(frontmatter, 'translations');
  if (scalar?.startsWith('{')) {
    try { return JSON.parse(scalar); } catch { return {}; }
  }
  const block = frontmatter.match(/^translations:\s*\r?\n((?:[ \t]+[^\r\n]*(?:\r?\n|$))+)/m)?.[1] ?? '';
  const translations = {};
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^\s+(de-DE|en-DE):\s*(.*?)\s*$/);
    if (!match) continue;
    const value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try { translations[match[1]] = JSON.parse(value); } catch { translations[match[1]] = value.slice(1, -1); }
    } else if (value.startsWith("'") && value.endsWith("'")) {
      translations[match[1]] = value.slice(1, -1).replace(/''/g, "'");
    } else {
      translations[match[1]] = value;
    }
  }
  return translations;
}

function dateKeyInTimeZone(date, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date).filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

const berlinToday = dateKeyInTimeZone(new Date(), 'Europe/Berlin');
const blogEntries = [];
for (const file of await findMarkdown(contentRoot)) {
  const markdown = await readFile(file, 'utf8');
  const rel = relative(contentRoot, file).split(sep).join('/').replace(/\.mdx?$/, '');
  const frontmatterMatch = markdown.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatterMatch) {
    fail(`/content/blog/${rel}`, 'missing YAML frontmatter');
    continue;
  }
  const frontmatter = frontmatterMatch[1];
  const title = frontmatterScalar(frontmatter, 'title');
  const language = frontmatterScalar(frontmatter, 'language');
  const publishDateValue = frontmatterScalar(frontmatter, 'publishDate');
  const draftValue = frontmatterScalar(frontmatter, 'draft');
  const translations = frontmatterTranslations(frontmatter);
  let draft = false;
  if (draftValue === 'true') draft = true;
  else if (draftValue !== undefined && draftValue !== 'false') {
    fail(`/content/blog/${rel}`, `invalid draft value ${draftValue}`);
    draft = true;
  }
  if (!title) fail(`/content/blog/${rel}`, 'missing title in frontmatter');
  if (language !== 'de-DE' && language !== 'en-DE') fail(`/content/blog/${rel}`, `invalid language ${language ?? '(missing)'}`);
  const publishDate = publishDateValue === undefined ? null : new Date(publishDateValue);
  const publishDateKey = publishDate && !Number.isNaN(publishDate.valueOf()) ? publishDate.toISOString().slice(0, 10) : null;
  if (!publishDateKey) fail(`/content/blog/${rel}`, `invalid publishDate ${publishDateValue ?? '(missing)'}`);
  const slug = rel.split('/').at(-1);
  const isEnglish = language === 'en-DE' || (language !== 'de-DE' && rel.startsWith('en/'));
  const path = isEnglish ? `/en/guides/${slug}/` : `/ratgeber/${slug}/`;
  const future = publishDateKey !== null && publishDateKey > berlinToday;
  blogEntries.push({ file, markdown, rel, title, language, translations, publishDateKey, draft, future, path, publishable: !draft && !future && publishDateKey !== null });
}
const publishablePosts = blogEntries.filter((post) => post.publishable);
const excludedPosts = blogEntries.filter((post) => !post.publishable);
const publishableByLanguage = new Map([
  ['de-DE', publishablePosts.filter((post) => post.language === 'de-DE')],
  ['en-DE', publishablePosts.filter((post) => post.language === 'en-DE')],
]);

const generated = JSON.parse(await readFile(join(root, 'src', 'data', 'pages.generated.json'), 'utf8'));
const architectureMarkdown = await readFile(join(root, 'docs', 'seo-heading-architecture.md'), 'utf8');
const architectureContracts = parseArchitectureContracts(architectureMarkdown);
const architecturePaths = new Set([
  ...generated.map((page) => page.path),
  '/impressum/', '/en/imprint/', '/datenschutz/', '/en/privacy/',
]);
for (const path of architecturePaths) {
  const expected = architectureContracts.get(path);
  const built = pages.get(path);
  if (!expected) {
    fail(path, 'missing from docs/seo-heading-architecture.md');
    continue;
  }
  if (!built) continue;
  const actual = built.$('h1,h2,h3').filter((_, heading) => built.$(heading).closest('.guide-card').length === 0)
    .map((_, heading) => ({ tag: heading.tagName, text: normalize(built.$(heading).text()) })).get();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(path, `rendered headings differ from docs/seo-heading-architecture.md\n  expected ${JSON.stringify(expected)}\n  actual   ${JSON.stringify(actual)}`);
  }
}
for (const path of architectureContracts.keys()) {
  if (!architecturePaths.has(path)) fail(path, 'heading architecture documents a route outside the built commercial and legal contract');
}
if (architectureContracts.size !== architecturePaths.size) {
  fail('/docs/seo-heading-architecture.md', `expected ${architecturePaths.size} route contracts, found ${architectureContracts.size}`);
}
const articleTitleContracts = parseArticleTitleContracts(architectureMarkdown);
const documentedArticleTitles = new Set(articleTitleContracts.flatMap((pair) => [pair.de, pair.en]));
const publishableArticleTitles = new Set(publishablePosts.map((post) => post.title));
if (articleTitleContracts.length * 2 !== publishablePosts.length) {
  fail('/docs/seo-heading-architecture.md', `expected ${publishablePosts.length / 2} bilingual article-title contracts, found ${articleTitleContracts.length}`);
}
for (const title of publishableArticleTitles) {
  if (!documentedArticleTitles.has(title)) fail('/docs/seo-heading-architecture.md', `missing published article H1: ${title}`);
}
for (const title of documentedArticleTitles) {
  if (!publishableArticleTitles.has(title)) fail('/docs/seo-heading-architecture.md', `documents an unpublished article H1: ${title}`);
}
const publishablePostByPath = new Map(publishablePosts.map((post) => [post.path, post]));
const germanPostByTitle = new Map(publishablePosts.filter((post) => post.language === 'de-DE').map((post) => [post.title, post]));
for (const pair of articleTitleContracts) {
  const germanPost = germanPostByTitle.get(pair.de);
  const englishPath = germanPost?.translations?.['en-DE'];
  const englishPost = englishPath ? publishablePostByPath.get(englishPath) : undefined;
  if (!germanPost || !englishPost || englishPost.language !== 'en-DE' || englishPost.title !== pair.en) {
    fail('/docs/seo-heading-architecture.md', `incorrect bilingual article-title pairing: ${pair.de} ↔ ${pair.en}`);
  }
}
const expectedAlternates = new Map(generated.map((page) => [page.path, page.alternatePath]));
for (const [dePath, enPath] of [['/impressum/', '/en/imprint/'], ['/datenschutz/', '/en/privacy/']]) {
  expectedAlternates.set(dePath, enPath);
  expectedAlternates.set(enPath, dePath);
}
for (const post of publishablePosts) {
  const selfLocale = post.language;
  const alternateLocale = selfLocale === 'de-DE' ? 'en-DE' : 'de-DE';
  const translatedSelf = post.translations?.[selfLocale];
  const alternatePath = post.translations?.[alternateLocale];
  if (translatedSelf !== post.path) fail(post.path, `translations.${selfLocale} must equal the built article path`);
  if (!alternatePath?.startsWith('/')) fail(post.path, `missing translations.${alternateLocale}`);
  else expectedAlternates.set(post.path, alternatePath);
}

for (const [path, alternatePath] of expectedAlternates) {
  const built = pages.get(path);
  if (!built) {
    fail(path, 'route in the bilingual contract was not built');
    continue;
  }
  if (expectedAlternates.get(alternatePath) !== path) fail(path, `alternate route is not reciprocal: ${alternatePath}`);
  if (built.$('.site-header .nav-language').attr('href') !== alternatePath) fail(path, `language selector must link to exact counterpart ${alternatePath}`);

  const selfLocale = path.startsWith('/en/') ? 'en-DE' : 'de-DE';
  const alternateLocale = selfLocale === 'de-DE' ? 'en-DE' : 'de-DE';
  const selfUrl = new URL(path, `${expectedSiteOrigin}/`).href;
  const alternateUrl = new URL(alternatePath, `${expectedSiteOrigin}/`).href;
  const expectedHreflang = new Map([
    [selfLocale, selfUrl],
    [alternateLocale, alternateUrl],
    ['x-default', selfLocale === 'de-DE' ? selfUrl : alternateUrl],
  ]);
  const actualHreflang = new Map();
  built.$('link[rel="alternate"][hreflang]').each((_, link) => {
    const language = built.$(link).attr('hreflang');
    const href = built.$(link).attr('href');
    if (language && href) {
      if (actualHreflang.has(language)) fail(path, `duplicate hreflang ${language}`);
      actualHreflang.set(language, href);
    }
  });
  for (const [language, href] of expectedHreflang) {
    if (actualHreflang.get(language) !== href) fail(path, `hreflang ${language} must be ${href}`);
  }
}

const allowedSectionLayouts = new Set([
  'service-bento',
  'comparison',
  'media-split',
  'process-rail',
  'technical-list',
  'image-statement',
]);
const generatedByPath = new Map(generated.map((page) => [page.path, page]));
const sectionPresentation = (page) => page.sections.map((section) => ({
  layout: section.layout ?? null,
  tone: section.tone ?? null,
  image: section.image ?? null,
  imagePosition: section.imagePosition ?? null,
}));

for (const page of generated) {
  for (const [index, section] of page.sections.entries()) {
    if (!allowedSectionLayouts.has(section.layout)) {
      fail(page.path, `section ${index + 1} has unsupported layout ${section.layout ?? '(missing)'}`);
    }
  }
}

for (const page of generated.filter((item) => item.lang === 'de')) {
  const alternate = generatedByPath.get(page.alternatePath);
  if (!alternate) {
    fail(page.path, `missing English counterpart ${page.alternatePath ?? '(missing alternatePath)'}`);
    continue;
  }
  if (alternate.lang !== 'en' || alternate.alternatePath !== page.path) {
    fail(page.path, `invalid reciprocal English counterpart ${alternate.path}`);
    continue;
  }
  const dePresentation = sectionPresentation(page);
  const enPresentation = sectionPresentation(alternate);
  if (JSON.stringify(dePresentation) !== JSON.stringify(enPresentation)) {
    fail(page.path, `section presentation differs from ${alternate.path}\n  de ${JSON.stringify(dePresentation)}\n  en ${JSON.stringify(enPresentation)}`);
  }
}

for (const page of generated) {
  const built = pages.get(page.path);
  if (!built) { fail(page.path, 'page was not built'); continue; }
  const expected = [{ tag: 'h1', text: page.h1 }];
  if (page.key === 'guides') {
    const expectedGuideTitle = page.lang === 'de' ? 'Aktuelle Artikel' : 'Latest articles';
    const guideLanguage = page.lang === 'de' ? 'de-DE' : 'en-DE';
    const expectedGuides = publishableByLanguage.get(guideLanguage) ?? [];
    const expectedGuidesByPath = new Map(expectedGuides.map((post) => [post.path, post]));
    const guideHeading = built.$('.guide-listing > .guide-list-heading > h2');
    const guideCards = built.$('.guide-listing .guide-card');
    if (guideHeading.length !== 1 || normalize(guideHeading.text()) !== expectedGuideTitle) fail(page.path, 'guide listing must have one localized H2');
    if (guideCards.length !== expectedGuides.length) fail(page.path, `guide listing expected ${expectedGuides.length} publishable cards for ${guideLanguage}, found ${guideCards.length}`);
    expected.push({ tag: 'h2', text: expectedGuideTitle });
    const seenGuidePaths = new Set();
    guideCards.each((_, card) => {
      const element = built.$(card);
      const link = element.find('.guide-card-title a');
      const href = link.attr('href');
      const cardTitle = normalize(link.text());
      const expectedPost = expectedGuidesByPath.get(href);
      if (!href || !expectedPost) fail(page.path, `guide card links to non-publishable or unknown article ${href ?? '(missing href)'}`);
      else if (cardTitle !== expectedPost.title) fail(page.path, `guide card title mismatch for ${href}`);
      if (href && seenGuidePaths.has(href)) fail(page.path, `duplicate guide card for ${href}`);
      if (href) seenGuidePaths.add(href);
      expected.push({ tag: 'h3', text: cardTitle });
    });
    for (const expectedPost of expectedGuides) {
      if (!seenGuidePaths.has(expectedPost.path)) fail(page.path, `missing publishable guide card ${expectedPost.path}`);
    }
    const collectionSchemas = built.$('script[type="application/ld+json"]').map((_, script) => {
      try { return JSON.parse(built.$(script).html() ?? ''); } catch { return null; }
    }).get();
    const collectionPageSchema = collectionSchemas.find((schema) => schema?.['@type'] === 'CollectionPage');
    const itemListSchema = collectionSchemas.find((schema) => schema?.['@type'] === 'ItemList');
    if (!collectionPageSchema) fail(page.path, 'blog index must expose CollectionPage schema');
    const visibleGuideUrls = guideCards.map((_, card) => built.$(card).find('.guide-card-title a').attr('href')).get();
    const schemaGuideUrls = (itemListSchema?.itemListElement ?? []).map((item) => {
      try { return new URL(item?.url).pathname; } catch { return ''; }
    });
    if (!itemListSchema || JSON.stringify(schemaGuideUrls) !== JSON.stringify(visibleGuideUrls)) {
      fail(page.path, 'ItemList schema must mirror the visible article order');
    }
  }
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
  const expectedRelatedLinks = page.key === 'guides' ? 0 : 3;
  if (built.$('.related-links nav a').length !== expectedRelatedLinks) {
    fail(page.path, `page must expose ${expectedRelatedLinks} contextual related links`);
  }
  const faqSchema = built.$('script[type="application/ld+json"]').map((_, script) => {
    try { return JSON.parse(built.$(script).html() ?? ''); } catch { return null; }
  }).get().find((schema) => schema?.['@type'] === 'FAQPage');
  const visibleFaq = built.$('.faq-item').map((_, item) => ({
    question: normalize(built.$(item).find('h3').text()),
    answer: normalize(built.$(item).find('.faq-answer p').text()),
  })).get();
  const schemaFaq = (faqSchema?.mainEntity ?? []).map((item) => ({
    question: normalize(item?.name ?? ''),
    answer: normalize(item?.acceptedAnswer?.text ?? ''),
  }));
  if (!faqSchema || JSON.stringify(schemaFaq) !== JSON.stringify(visibleFaq)) fail(page.path, 'FAQPage schema must exactly mirror visible questions and answers');
  const structuredData = built.$('script[type="application/ld+json"]').map((_, script) => {
    try { return JSON.parse(built.$(script).html() ?? ''); } catch { return null; }
  }).get();
  for (const requiredType of ['Organization', 'WebSite', page.key === 'guides' ? 'CollectionPage' : 'WebPage']) {
    if (!structuredData.some((schema) => schema?.['@type'] === requiredType)) fail(page.path, `missing ${requiredType} schema`);
  }
  const serviceSchema = structuredData.find((schema) => schema?.['@type'] === 'Service');
  const shouldExposeService = ['home', 'split', 'apartment', 'house', 'commercial', 'retrofit', 'costs', 'area'].includes(page.key);
  if (shouldExposeService && !serviceSchema) fail(page.path, 'service page is missing Service schema');
  if (!shouldExposeService && serviceSchema) fail(page.path, 'non-service page must not expose Service schema');
  if (serviceSchema && normalize(serviceSchema.name ?? '') !== normalize(page.h1)) fail(page.path, 'Service schema name must match the visible H1');
  if (serviceSchema && (serviceSchema.areaServed?.['@type'] !== 'Country' || serviceSchema.areaServed?.name !== 'Germany')) {
    fail(page.path, 'Service schema areaServed must be the country Germany');
  }
}

for (const post of publishablePosts) {
  const built = pages.get(post.path);
  if (!built) { fail(post.path, `publishable article was not built (publishDate ${post.publishDateKey}, Berlin today ${berlinToday})`); continue; }
  const sourceHeadings = [...post.markdown.matchAll(/^(##|###)\s+(.+)$/gm)].map((match) => ({ tag: match[1] === '##' ? 'h2' : 'h3', text: normalize(match[2]) }));
  const expected = [{ tag: 'h1', text: post.title }, ...sourceHeadings, { tag: 'h2', text: post.language === 'en-DE' ? 'Request a project quote' : 'Projekt anfragen' }];
  const actual = headingList(built.$);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(post.path, 'article heading contract mismatch');
  if (built.$('form.project-form').length !== 1) fail(post.path, 'article must end with one project form');
  if (built.$('.related-links nav a').length !== 3) fail(post.path, 'article must expose three contextual related links');
  const articleSchema = built.$('script[type="application/ld+json"]').map((_, script) => {
    try { return JSON.parse(built.$(script).html() ?? ''); } catch { return null; }
  }).get().find((schema) => schema?.['@type'] === 'BlogPosting');
  if (!articleSchema || normalize(articleSchema.headline ?? '') !== normalize(post.title)) fail(post.path, 'BlogPosting schema headline must match the visible H1');
  const visibleAuthor = normalize(built.$('.article-author').text());
  const schemaAuthor = normalize(articleSchema?.author?.name ?? '');
  if (!schemaAuthor || !visibleAuthor.includes(schemaAuthor)) fail(post.path, 'BlogPosting schema author must be visible in the article header');
  if (articleSchema?.author?.['@id'] === `${expectedSiteOrigin}/#organization`) fail(post.path, 'editorial author must not reuse the publisher Organization @id');
  if (articleSchema?.publisher?.['@id'] !== `${expectedSiteOrigin}/#organization`) fail(post.path, 'BlogPosting publisher must reference the site Organization');
}

for (const post of excludedPosts) {
  if (!pages.has(post.path)) continue;
  const reason = post.draft ? 'draft' : post.future ? `future-dated (${post.publishDateKey} > ${berlinToday} Europe/Berlin)` : 'invalid publication metadata';
  fail(post.path, `${reason} article must not be built`);
}

const expectedArticlePaths = new Set(publishablePosts.map((post) => post.path));
for (const path of pages.keys()) {
  const articleRoute = /^\/ratgeber\/[^/]+\/$/.test(path) || /^\/en\/guides\/[^/]+\/$/.test(path);
  if (articleRoute && !expectedArticlePaths.has(path)) fail(path, 'built article has no publishable frontmatter source');
}

const sitemapText = (await Promise.all(
  textArtifacts.filter((file) => /sitemap[^\\/]*\.xml$/i.test(file)).map((file) => readFile(file, 'utf8')),
)).join('\n');
const germanRss = await readFile(join(dist, 'rss.xml'), 'utf8');
const englishRss = await readFile(join(dist, 'en', 'rss.xml'), 'utf8');
const germanRssXml = load(germanRss, { xmlMode: true });
const englishRssXml = load(englishRss, { xmlMode: true });
if (germanRssXml('channel > title').first().text() !== 'IsarKlima Blog') fail('/rss.xml', 'German RSS title must use the public Blog label');
if (englishRssXml('channel > title').first().text() !== 'IsarKlima Blog') fail('/en/rss.xml', 'English RSS title must use the public Blog label');
if (germanRssXml('channel > link').first().text() !== `${expectedSiteOrigin}/`) fail('/rss.xml', 'German RSS channel must link to the German home');
if (englishRssXml('channel > link').first().text() !== `${expectedSiteOrigin}/en/`) fail('/en/rss.xml', 'English RSS channel must link to the English home');
for (const post of publishablePosts) {
  const absoluteUrl = new URL(post.path, `${expectedSiteOrigin}/`).href;
  if (!sitemapText.includes(absoluteUrl)) fail(post.path, 'publishable article is missing from the sitemap');
  const expectedRss = post.language === 'en-DE' ? englishRss : germanRss;
  const otherRss = post.language === 'en-DE' ? germanRss : englishRss;
  if (!expectedRss.includes(absoluteUrl)) fail(post.path, 'publishable article is missing from its localized RSS feed');
  if (otherRss.includes(absoluteUrl)) fail(post.path, 'article leaked into the wrong localized RSS feed');
}
const publicationArtifacts = `${sitemapText}\n${germanRss}\n${englishRss}`;
for (const post of excludedPosts) {
  if (publicationArtifacts.includes(post.path)) fail(post.path, 'draft or future article leaked into sitemap or RSS');
}

const legalPageCount = 4;
const expectedHtmlCount = generated.length + legalPageCount + 1 + publishablePosts.length;
if (htmlFiles.length !== expectedHtmlCount) fail('build', `expected ${expectedHtmlCount} HTML pages (${generated.length} generated + ${legalPageCount} legal + 1 error + ${publishablePosts.length} publishable articles), found ${htmlFiles.length}`);
const llms = await readFile(join(dist, 'llms.txt'), 'utf8');
if ([...llms.matchAll(/\[[^\]]+\]\(https?:\/\/[^)]+\)/g)].length < 4) fail('/llms.txt', 'llms.txt must expose at least four absolute Markdown links');
if (indexSite) {
  if (!/^Allow:\s*\/$/m.test(robots)) fail('/robots.txt', 'indexable mode must allow crawling');
  if (/^Disallow:\s*\/$/m.test(robots)) fail('/robots.txt', 'indexable mode must not disallow the whole site');
  if (!/^Sitemap:\s*https?:\/\//m.test(robots)) fail('/robots.txt', 'indexable mode must publish the sitemap URL');
  if (!llms.includes('This deployment is intended to be indexable.')) fail('/llms.txt', 'indexable mode must describe the deployment as indexable');
  if (llms.includes('not intended for indexing')) fail('/llms.txt', 'indexable mode must not retain the preview indexing notice');
} else if (!/^Disallow:\s*\/$/m.test(robots)) {
  fail('/robots.txt', 'preview mode must disallow crawling');
} else if (!llms.includes('This deployment is a project preview and is not intended for indexing.')) {
  fail('/llms.txt', 'preview mode must disclose that the deployment is not intended for indexing');
}

if (failures.length) {
  console.error(`Build audit failed with ${failures.length} issue(s):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Build audit passed in ${indexSite ? 'indexable' : 'preview'} mode: ${htmlFiles.length} HTML pages and ${textArtifacts.length - htmlFiles.length} XML/TXT artifacts, ${generated.length} commercial heading contracts, bilingual section-layout parity, ${publishablePosts.length} publishable article contracts as of ${berlinToday} Europe/Berlin, dynamic guide cards, internal links, metadata, hreflang, images and inactive forms.`);
