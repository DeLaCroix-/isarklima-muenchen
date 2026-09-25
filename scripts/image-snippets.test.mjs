import test from 'node:test';
import assert from 'node:assert/strict';
import { protectImageSnippets, inspectImageSnippets } from './image-snippets.mjs';

test('protects image descriptions without removing useful text or alt attributes', () => {
  const input = '<html lang="en"><head><meta name="description" content="Legal advice"><script>const html = "<img alt=ignore>";</script></head><body><h1>Criminal lawyer</h1><figure><img src="/court.webp" alt="Court corridor" width="1600"><figcaption>Our office</figcaption></figure><p>We assess your case.</p></body></html>';
  const result = protectImageSnippets(input);
  assert.equal(result.images, 1);
  assert.match(result.html, /<figure><span data-nosnippet[^>]*><img src="\/court.webp" alt="Court corridor" width="1600"><\/span><figcaption>Our office/);
  assert.equal(result.html.replace('<span data-nosnippet data-image-snippet style="display:contents">', '').replace('</span>', ''), input);
  assert.equal(protectImageSnippets(result.html).html, result.html);
});

test('marks image-only containers without wrapping or excluding adjacent headings', () => {
  const input = '<div class="photo"><img alt="Photo"><span></span></div><div><img alt="Chart"><h2>Business results</h2></div>';
  const result = protectImageSnippets(input);
  assert.match(result.html, /^<div data-nosnippet class="photo"><img/);
  assert.match(result.html, /<\/span><h2>Business results/);
  assert.equal(inspectImageSnippets(result.html).unprotected.length, 0);
});

test('keeps picture sources and fallbacks together and supports escaped attributes', () => {
  const result = protectImageSnippets('<a href="/case/"><picture><source srcset="large.webp"><img alt="A &amp; B > C" src="small.webp"></picture>Read case</a>');
  assert.match(result.html, /<span[^>]*><picture><source/);
  assert.match(result.html, /<\/picture><\/span>Read case/);
  assert.equal(result.images, 1);
});

test('respects only supported data-nosnippet ancestors and leaves decorative images alone', () => {
  const result = protectImageSnippets('<section data-nosnippet><img alt="Protected"></section><figure data-nosnippet><img alt="Needs supported ancestor"></figure><img alt="">');
  assert.equal(result.changes, 1);
  assert.equal(result.images, 2);
  assert.match(result.html, /<figure data-nosnippet><span data-nosnippet/);
});

test('requires source protection for hydrated components', () => {
  assert.throws(() => protectImageSnippets('<astro-island><img alt="Photo"></astro-island>'), /hydrated/);
  const input = '<astro-island><span data-nosnippet><img alt="Photo"></span></astro-island>';
  assert.equal(protectImageSnippets(input).html, input);
});
