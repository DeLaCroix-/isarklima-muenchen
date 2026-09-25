import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

// Google supports data-nosnippet on div, span and section, not on img/figure.
// Keep alt text available to assistive technology and image search.
// https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr
const supported = new Set(['div', 'span', 'section']);
/** @typedef {import('parse5').DefaultTreeAdapterMap['node']} HtmlNode */
/** @typedef {import('parse5').DefaultTreeAdapterMap['element']} HtmlElement */
/** @param {HtmlNode} node @returns {node is HtmlElement} */
const isElement = (node) => 'tagName' in node;
/** @param {HtmlElement | undefined} node @param {string} name */
const attribute = (node, name) => node?.attrs?.find((attr) => attr.name === name);
/** @param {HtmlNode} node */
const children = (node) => 'childNodes' in node ? node.childNodes : [];
/** @param {HtmlNode} node @param {(node: HtmlNode) => void} visit */
function walk(node, visit) {
  visit(node);
  for (const child of children(node)) walk(child, visit);
}
/** @param {HtmlNode} node @returns {HtmlElement[]} */
function ancestors(node) {
  const result = [];
  let parent = 'parentNode' in node ? node.parentNode : null;
  while (parent) {
    if (isElement(parent)) result.push(parent);
    parent = 'parentNode' in parent ? parent.parentNode : null;
  }
  return result;
}
/** @param {HtmlNode} node */
function isProtected(node) {
  return ancestors(node).some((parent) => supported.has(parent.tagName) && attribute(parent, 'data-nosnippet'));
}
/** @param {HtmlNode} node @returns {boolean} */
function mediaOnly(node) {
  if ('value' in node) return !node.value.trim();
  if (node.nodeName === '#comment') return true;
  if (!isElement(node)) return false;
  if (['img', 'source'].includes(node.tagName)) return true;
  if (!['div', 'span', 'picture', 'figure', 'a'].includes(node.tagName)) return false;
  return children(node).every(mediaOnly);
}

/** @param {string} html */
export function protectImageSnippets(html) {
  const document = parse(html, { sourceCodeLocationInfo: true });
  /** @type {Array<{offset: number, text: string}>} */
  const edits = [];
  const marked = new Set();
  walk(document, (image) => {
    if (!isElement(image) || image.tagName !== 'img' || !attribute(image, 'alt')?.value.trim() || isProtected(image)) return;
    const parents = ancestors(image);
    // Hydrated markup must be protected in the source component as well.
    if (parents.some((parent) => parent.tagName === 'astro-island')) {
      throw new Error('Add a span/div with data-nosnippet around the image in the hydrated component.');
    }
    const picture = parents.find((parent) => parent.tagName === 'picture');
    const target = picture ?? image;
    const parent = target.parentNode;
    if (parent && isElement(parent) && supported.has(parent.tagName) && mediaOnly(parent) && parent.sourceCodeLocation?.startTag) {
      if (!marked.has(parent)) {
        marked.add(parent);
        const offset = parent.sourceCodeLocation.startTag.startOffset + 1 + parent.tagName.length;
        edits.push({ offset, text: ' data-nosnippet' });
      }
    } else if (!marked.has(target)) {
      marked.add(target);
      const location = target.sourceCodeLocation;
      if (!location) throw new Error('Image has no source location.');
      edits.push({ offset: location.startOffset, text: '<span data-nosnippet data-image-snippet style="display:contents">' });
      edits.push({ offset: location.endOffset, text: '</span>' });
    }
  });
  // Insert only. Do not serialize the document or alter images, metadata, copy,
  // structured data, scripts, consent, links or form markup.
  for (const edit of edits.sort((a, b) => b.offset - a.offset)) {
    html = html.slice(0, edit.offset) + edit.text + html.slice(edit.offset);
  }
  const result = inspectImageSnippets(html);
  if (result.unprotected.length) throw new Error(`Unprotected image alt: ${result.unprotected[0]}`);
  return { html, images: result.images, changes: marked.size };
}

/** @param {string} html */
export function inspectImageSnippets(html) {
  let images = 0;
  /** @type {string[]} */
  const unprotected = [];
  walk(parse(html), (node) => {
    if (!isElement(node) || node.tagName !== 'img' || !attribute(node, 'alt')?.value.trim()) return;
    images++;
    if (!isProtected(node)) unprotected.push(attribute(node, 'src')?.value ?? '(no src)');
  });
  return { images, unprotected };
}

/** @param {string} directory @returns {AsyncGenerator<string>} */
async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

/** @returns {import('astro').AstroIntegration} */
export default function imageSnippets() {
  return {
    name: 'image-snippets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let pages = 0;
        let images = 0;
        for await (const path of htmlFiles(fileURLToPath(dir))) {
          const before = await readFile(path, 'utf8');
          let result;
          try { result = protectImageSnippets(before); }
          catch (error) { throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`); }
          if (result.html !== before) await writeFile(path, result.html);
          pages++;
          images += result.images;
        }
        logger.info(`Verified image snippet exclusions on ${pages} HTML files (${images} image descriptions).`);
      },
    },
  };
}
