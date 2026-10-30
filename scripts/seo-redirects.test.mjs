import test from 'node:test';
import assert from 'node:assert/strict';
import { redirectRules, mergeRedirectRules } from './seo-redirects.mjs';
const entry = { articleId:'test', language:'es', from:'/noticias/old/', to:'/noticias/new/' };
test('permanent redirects work on Netlify and nested Apache while preserving manual rules', () => {
  const rules = redirectRules({version:1,redirects:[entry]});
  assert.equal(rules.netlify, '/noticias/old/ /noticias/new/ 301!');
  assert.match(rules.apache, /RewriteCond %\{REQUEST_URI\} \^\/noticias\/old\/\$/);
  const manual = 'Options -Indexes\nRewriteRule ^legacy/$ /contacto/ [R=301,L]\n';
  const merged = mergeRedirectRules(manual, rules.apache);
  assert.ok(merged.endsWith(manual));
  assert.equal(mergeRedirectRules(merged, rules.apache), merged);
});
test('rejects loops, chains, external URLs, and directive injection', () => {
  for (const to of [entry.from, '//evil.example/', '/new/\nRewriteEngine Off', 'https://evil.example']) assert.throws(() => redirectRules({version:1,redirects:[{...entry,to}]}));
  assert.throws(() => redirectRules({version:1,redirects:[entry,{...entry,from:entry.to,to:'/third/'}]}));
});
