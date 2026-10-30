import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
const start = '# BEGIN NAT SEO ARTICLE REDIRECTS';
const end = '# END NAT SEO ARTICLE REDIRECTS';
const safePath = value => typeof value === 'string' && /^\/[a-zA-Z0-9/_-]+$/.test(value) && !value.includes('//') && value !== '/';
export function redirectRules(registry) {
  if (registry.version !== 1 || !Array.isArray(registry.redirects)) throw new Error('Invalid SEO redirect registry');
  const paths = new Set();
  for (const r of registry.redirects) {
    if (!safePath(r.from) || !safePath(r.to) || r.from === r.to || paths.has(r.from)) throw new Error('Invalid or duplicate SEO redirect');
    paths.add(r.from);
  }
  if (registry.redirects.some(r => paths.has(r.to))) throw new Error('SEO redirects must not chain or loop');
  const netlify = registry.redirects.map(r => `${r.from} ${r.to} 301!`).join('\n');
  // REQUEST_URI is absolute even when this .htaccess lives under /blog/.
  const apache = ['RewriteEngine On', ...registry.redirects.flatMap(r => [
    `RewriteCond %{REQUEST_URI} ^${r.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
    `RewriteRule ^ ${r.to} [R=301,L,NE]`,
  ])].join('\n');
  return { netlify, apache };
}
export function mergeRedirectRules(existing, rules) {
  const escapedStart = start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedEnd = end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rest = existing.replace(new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}\\r?\\n?`, 'g'), '');
  return `${start}\n${rules}\n${end}\n${rest}`;
}
export function applyArticleRedirects(outputDirectory = 'dist') {
  const registryPath = resolve('.nat-seo/article-redirects.json');
  if (!existsSync(registryPath)) return;
  const output = resolve(outputDirectory);
  const rel = relative(process.cwd(), output);
  if (!rel || rel.startsWith('..') || isAbsolute(rel) || !existsSync(output)) throw new Error('Invalid SEO redirect output directory');
  const rules = redirectRules(JSON.parse(readFileSync(registryPath, 'utf8')));
  for (const [filename, content] of [['_redirects', rules.netlify], ['.htaccess', rules.apache]]) {
    const path = resolve(output, filename);
    const existing = existsSync(path) ? readFileSync(path, 'utf8') : '';
    writeFileSync(path, mergeRedirectRules(existing, content));
  }
  console.log('SEO article redirects validated and added to deployment.');
}
