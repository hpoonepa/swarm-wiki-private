import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import { groups } from '../static/home/nav-data.js';

// Index the rendered site, so result anchors always match the published page.
// parse5 is already supplied by Astro's HTML/Markdown build dependencies.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'public');
const base = '/lambert-ga';
const maxTextLength = 1200;
const ignoredTags = new Set(['script', 'style', 'nav', 'footer', 'svg', 'canvas', 'template', 'dialog', 'noscript']);
const menu = new Map();
const records = [];
const documents = new Map();

function readMenu(items, group, parents = []) {
  for (const [label, destination] of items) {
    if (Array.isArray(destination)) readMenu(destination, group, [...parents, label]);
    else menu.set(destination, { group, label: [...parents, label].join(' ') });
  }
}
for (const [group, items] of groups) readMenu(items, group);

const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const clean = value => value.replace(/\s+/g, ' ').trim();
const clip = value => clean(value).slice(0, maxTextLength);
function ignored(node) {
  return ignoredTags.has(node.tagName)
    || attr(node, 'aria-hidden') === 'true'
    || attr(node, 'hidden') !== undefined
    || ['navigation', 'dialog'].includes(attr(node, 'role'))
    || /(?:^|\s)(?:katex-mathml|sr-only|bv-sr-only)(?:\s|$)/.test(attr(node, 'class') || '');
}
function text(node) {
  if (ignored(node)) return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes || []).map(text).join(' ');
}
function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
function allIds(node, ids = new Set()) {
  const id = attr(node, 'id');
  if (id) ids.add(id);
  for (const child of node.childNodes || []) allIds(child, ids);
  return ids;
}
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name === 'index.html') files.push(path);
  }
  return files.sort();
}
function fallbackGroup(slug) {
  if (slug.startsWith('model-')) return 'Drylab';
  if (/^(?:minibinder|rnai|notebook)/.test(slug)) return 'Wetlab';
  return 'Project';
}

for (const path of await htmlFiles(output)) {
  const slug = relative(output, dirname(path)).split(sep).join('/');
  if (!slug) continue; // Root is a redirect to /home/.
  const doc = parse(await readFile(path, 'utf8'));
  const main = find(doc, node => node.tagName === 'main');
  const article = find(doc, node => node.tagName === 'article' && attr(node, 'id') === 'article') || main;
  const menuItem = menu.get(slug);
  const rawTitle = clean(text(find(doc, node => node.tagName === 'title') || {}));
  const title = slug === 'home' ? 'SWARM home' : rawTitle.replace(/(?:^Lambert-GA\s*\|\s*|\s*\|\s*Lambert-GA$)/g, '') || menuItem?.label;
  if (!title) throw new Error(`Search index: no page title in ${path}`);
  const description = attr(find(doc, node => node.tagName === 'meta' && attr(node, 'name') === 'description') || {}, 'content') || '';
  const href = `${base}/${slug}/`;
  const group = slug === 'home' ? 'Home' : menuItem?.group || fallbackGroup(slug);
  const ids = allIds(doc);
  documents.set(href, ids);
  // Keep moved routes valid as menu destinations without indexing their redirect pages.
  if (/\bnoindex\b/i.test(attr(find(doc, node => node.tagName === 'meta' && attr(node, 'name') === 'robots') || {}, 'content') || '')) continue;
  const parts = [];
  const sections = [];
  let current;

  function walk(node) {
    if (ignored(node)) return;
    if (node.nodeName === '#text') {
      parts.push(node.value);
      if (current) current.parts.push(node.value);
      return;
    }
    // Keep sample text out of snippets while retaining its page and headings.
    if (node.tagName === 'p' && /lorem ipsum|additional .+ to be added|work in progress/i.test(text(node))) return;
    if (/^h[1-6]$/.test(node.tagName || '')) {
      const heading = clean(text(node));
      const id = attr(node, 'id');
      parts.push(heading);
      current = id && heading && !/^loading\b/i.test(heading) ? { heading, id, parts: [] } : undefined;
      if (current) sections.push(current);
      return;
    }
    for (const child of node.childNodes || []) walk(child);
  }
  const summary = find(doc, node => (attr(node, 'class') || '').split(/\s+/).includes('reading-summary'));
  if (summary) walk(summary);
  if (article) walk(article);
  records.push({ title, href, group, text: clip([description, menuItem?.label || '', parts.join(' ')].join(' ')) });
  // Home has scroll-controlled scenes; link to the page rather than hidden beats.
  if (slug !== 'home') {
    for (const section of sections) {
      records.push({ title, section: section.heading, href: `${href}#${encodeURIComponent(section.id)}`, group, text: clip(section.parts.join(' ')) });
    }
  }
}

if (!records.length) throw new Error('Search index: no built pages found. Run Astro build first.');
for (const slug of ['home', ...menu.keys()]) {
  if (!documents.has(`${base}/${slug}/`)) throw new Error(`Search index: missing menu destination ${slug}`);
}
const urls = new Set();
for (const record of records) {
  const [page, anchor] = record.href.split('#');
  if (!documents.has(page) || (anchor && !documents.get(page).has(decodeURIComponent(anchor)))) {
    throw new Error(`Search index: invalid destination ${record.href}`);
  }
  if (urls.has(record.href)) throw new Error(`Search index: duplicate destination ${record.href}`);
  urls.add(record.href);
  if (!record.title || !record.group || record.text.length > maxTextLength) throw new Error(`Search index: invalid record ${record.href}`);
}
await writeFile(join(output, 'search-index.json'), `${JSON.stringify(records)}\n`);
console.log(`Search index: ${documents.size} pages, ${records.length - documents.size} sections; all destinations validated.`);
