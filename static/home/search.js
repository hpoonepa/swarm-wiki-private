import { groups } from './nav-data.js?v=40567c283451';

const magnifier = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.7" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.4 4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
export const searchTrigger = `<button type="button" class="search-trigger" title="Search wiki (⌘/Ctrl K)" aria-label="Search the wiki" aria-haspopup="dialog" aria-expanded="false" aria-controls="search-pop" aria-keyshortcuts="Control+K Meta+K">${magnifier}</button>`;
export const searchStyles = `
  .search-trigger { pointer-events:auto; flex:0 0 auto; display:flex; align-items:center; justify-content:center; width:44px; height:40px; padding:0; border-radius:999px; background:transparent; color:inherit; transition:background .18s, color .18s; }
  .search-trigger:hover, .search-trigger[aria-expanded='true'] { background:rgba(26,50,42,.07); color:#2b4c2f; }
  :host([data-dark]) :is(.search-trigger:hover, .search-trigger[aria-expanded='true']) { background:rgba(255,244,204,.12); color:#ffda68; }
  .search-trigger svg { width:18px; height:18px; flex:none; }
  .search-pop { --muted:rgba(26,50,42,.68); position:absolute; top:calc(100% + 9px); right:0; z-index:1; display:flex; flex-direction:column; width:400px; max-height:min(420px,60vh); border-radius:21px; pointer-events:auto; transform-origin:top right; animation:search-pop .18s cubic-bezier(.23,1,.32,1); }
  .search-pop[hidden] { display:none; }
  .search-pop::before { background:rgba(255,253,246,.86); }
  :host([data-dark]) .search-pop { --muted:rgba(255,249,233,.66); color-scheme:dark; }
  :host([data-dark]) .search-pop::before { background:rgba(21,63,54,.88); }
  .search-field { display:flex; align-items:center; gap:10px; flex:none; height:46px; padding:0 16px; border-bottom:1px solid rgba(26,50,42,.09); cursor:text; }
  :host([data-dark]) .search-field { border-color:rgba(255,248,224,.14); }
  .search-field svg { width:16px; height:16px; flex:none; color:var(--muted); }
  .search-input { flex:1; min-width:0; height:100%; padding:0; border:0; outline:0; background:transparent; color:inherit; font:inherit; font-size:15px; font-weight:500; letter-spacing:-.01em; }
  .search-input::placeholder { color:var(--muted); }
  .search-results { min-height:0; padding:6px; overflow-y:auto; overscroll-behavior:contain; scrollbar-width:thin; scrollbar-color:var(--muted) transparent; }
  .search-results:empty { display:none; }
  .search-result { display:flex; flex-wrap:wrap; align-items:baseline; column-gap:12px; padding:9px 11px; border-radius:15px; scroll-margin:6px; }
  .search-result[aria-selected='true'] { background:rgba(26,50,42,.07); color:#2b4c2f; }
  :host([data-dark]) .search-result[aria-selected='true'] { background:rgba(255,244,204,.1); color:#ffda68; }
  .search-result-title, .search-result-label, .search-result-snippet { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .search-result-title { flex:1 1 0; font-size:14px; font-weight:550; line-height:1.35; }
  .search-result-label { max-width:45%; color:var(--muted); font-size:12px; line-height:1.35; }
  .search-result-snippet { flex-basis:100%; margin-top:2px; color:var(--muted); font-size:12px; line-height:1.45; }
  .search-pop mark { border-radius:3px; background:rgba(252,196,47,.42); color:inherit; }
  :host([data-dark]) .search-pop mark { background:rgba(252,196,47,.3); }
  .search-pop .search-result-snippet mark { background:none; color:#1a322a; font-weight:600; }
  :host([data-dark]) .search-pop .search-result-snippet mark { background:none; color:#fff9e9; }
  .search-status { margin:0; padding:13px 16px 15px; color:var(--muted); font-size:13px; line-height:1.4; }
  .search-status[data-quiet] { position:absolute; width:1px; height:1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
  @keyframes search-pop { from { opacity:0; transform:translateY(-6px) scale(.98); } }
  @media (max-width:1100px) { .search-trigger { height:44px; } .search-input { font-size:16px; } }
  @media (max-width:760px) { .search-pop { right:-62px; width:min(400px,calc(100vw - 32px)); } }
  @media (prefers-reduced-transparency:reduce) { .search-pop::before { background:#fffdf6; } :host([data-dark]) .search-pop::before { background:#153f36; } }
  @media (prefers-reduced-motion:reduce) { .search-pop { animation:none; } .search-trigger { transition:none; } }
`;

const fold = value => String(value || '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
const words = value => fold(value).match(/[\p{L}\p{N}]+/gu) || [];
const wordPattern = /[\p{L}\p{N}\p{M}]+/gu;
const order = new Map();
(function walk(items) { for (const [, destination] of items) Array.isArray(destination) ? walk(destination) : order.set(destination, order.size); })(groups.flatMap(([, items]) => items));
const prepared = new WeakMap();

function prepare(entries) {
  if (!prepared.has(entries)) {
    const items = entries.map((entry, index) => ({ entry, index, key: `${words(entry.section || entry.title).join(' ')}|${words(entry.title).join(' ')}`, rank: order.get(entry.href.split('#')[0].replace(/\/$/, '').split('/').pop()) ?? order.size, fields: [words(entry.section || entry.title), words(entry.section ? entry.title : ''), words(entry.group), words(entry.text)] }));
    prepared.set(entries, { items, vocabulary: [...new Set(items.flatMap(item => item.fields.flat()))] });
  }
  return prepared.get(entries);
}

function distance(token, word, limit) {
  let before = null, previous = Array.from({ length: word.length + 1 }, (_, j) => j);
  for (let i = 1; i <= token.length; i++) {
    const row = [i];
    for (let j = 1; j <= word.length; j++) {
      row[j] = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + (token[i - 1] === word[j - 1] ? 0 : 1));
      if (before && j > 1 && token[i - 1] === word[j - 2] && token[i - 2] === word[j - 1]) row[j] = Math.min(row[j], before[j - 2] + 1);
    }
    if (Math.min(...row) > limit) return null;
    before = previous;
    previous = row;
  }
  const best = Math.min(...previous);
  return best <= limit ? [best, previous.indexOf(best)] : null;
}

function nearWords(tokens, vocabulary) {
  return new Map(tokens.map(token => {
    const limit = token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0, close = new Map();
    if (limit) for (const word of vocabulary) {
      if (word.length < token.length - limit) continue;
      const found = distance(token, word, limit);
      if (found) close.set(word, [found[0] === 1 ? .35 : .2, found[1]]);
    }
    return [token, close];
  }));
}

function hit(token, word, near) {
  if (word.startsWith(token)) return [word.length === token.length ? 1 : .8, 0, token.length];
  const at = token.length > 2 ? word.indexOf(token) : -1;
  if (at > 0) return [.45, at, at + token.length];
  const close = near?.get(token)?.get(word);
  return close ? [close[0], 0, close[1]] : null;
}

function score(item, tokens, near) {
  const page = !item.entry.section, weights = [page ? 10 : 7, 3, 2, 1], body = [];
  let total = page ? .5 : 0, inPrimary = 0, inTitles = 0;
  for (const token of tokens) {
    let best = 0, field = -1;
    item.fields.forEach((list, f) => { for (const word of list) { const found = hit(token, word, near); if (found && found[0] * weights[f] > best) { best = found[0] * weights[f]; field = f; } } });
    if (!best) return null;
    total += best;
    if (field === 0) inPrimary++;
    if (field <= 1) inTitles++;
    if (field === 3) body.push(token);
  }
  const phrase = item.fields[0].join(' '), query = tokens.join(' ');
  total += phrase === query ? 4 : phrase.startsWith(query) ? 2 : 0;
  const tier = inPrimary === tokens.length ? (page ? 3 : 2) : !page && inPrimary && inTitles === tokens.length ? 2 : 1;
  return { item, body, score: tier * 1000 + total };
}

export function rankSearch(entries, query, limit = 7) {
  const tokens = words(query), { items, vocabulary } = prepare(entries);
  const run = near => items.map(item => score(item, tokens, near)).filter(Boolean).sort((a, b) => b.score - a.score || a.item.rank - b.item.rank || a.item.index - b.item.index).filter((found, i, all) => all.findIndex(other => other.item.key === found.item.key) === i).slice(0, limit);
  let near = null, found = run(near);
  if (!found.length) found = run(near = nearWords(tokens, vocabulary));
  return { tokens, near, results: found.map(({ item, body }) => ({ entry: item.entry, body })) };
}

function navigationEntries() {
  const entries = [];
  const walk = (items, group, parents = []) => {
    for (const [title, destination] of items) {
      if (Array.isArray(destination)) walk(destination, group, [...parents, title]);
      else entries.push({ title: [...parents, title].join(' · '), group, href: `/lambert-ga/${destination}/`, text: destination === 'software' ? 'PRINCE epitope prediction software' : destination === 'hardware' ? 'VAPOR-X hardware' : '' });
    }
  };
  for (const [group, items] of groups) walk(items, group);
  return entries;
}

function offset(word, length) {
  let i = 0;
  while (i < word.length && fold(word.slice(0, i)).length < length) i++;
  while (i < word.length && /\p{M}/u.test(word[i])) i++;
  return i;
}

function highlight(text, tokens, near) {
  const nodes = [];
  let last = 0;
  for (const match of tokens.length ? text.matchAll(wordPattern) : []) {
    const word = fold(match[0]);
    let range = null;
    for (const token of tokens) { const found = hit(token, word, near); if (found && (!range || found[2] - found[1] > range[1] - range[0])) range = [found[1], found[2]]; }
    if (!range) continue;
    const from = match.index + offset(match[0], range[0]), to = match.index + offset(match[0], range[1]);
    const mark = document.createElement('mark');
    mark.textContent = text.slice(from, to);
    nodes.push(text.slice(last, from), mark);
    last = to;
  }
  nodes.push(text.slice(last));
  return nodes;
}

function excerpt(text, tokens, near) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  for (const match of clean.matchAll(wordPattern)) {
    if (!tokens.some(token => hit(token, fold(match[0]), near))) continue;
    const start = match.index > 32 ? clean.lastIndexOf(' ', match.index - 24) + 1 : 0;
    return `${start ? '…' : ''}${clean.slice(start, start + 180)}`;
  }
  return clean.slice(0, 180);
}

const featured = ['description', 'minibinder', 'rnai', 'software', 'hardware', 'human-practices'];

export function mountSearch(root, { beforeOpen = () => {} } = {}) {
  const trigger = root.querySelector('.search-trigger');
  const pop = document.createElement('div');
  pop.className = 'search-pop glass';
  pop.id = 'search-pop';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', 'Search the wiki');
  pop.innerHTML = `<label class="search-field">${magnifier}<input class="search-input" type="search" placeholder="Search pages and sections" aria-label="Search pages and sections" role="combobox" aria-autocomplete="list" aria-controls="search-results" aria-expanded="false" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" maxlength="160"></label><div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div><p class="search-status" role="status" aria-live="polite" data-quiet></p>`;
  trigger ? trigger.after(pop) : root.append(pop);
  const input = pop.querySelector('.search-input'), results = pop.querySelector('.search-results'), status = pop.querySelector('.search-status');
  let entries = navigationEntries(), loaded = false, loading = null, active = -1, links = [], previousFocus = null, destroyed = false;
  const controller = new AbortController();
  const isOpen = () => !pop.hidden;

  function select(index, scroll = true) {
    active = index;
    links.forEach((link, i) => link.setAttribute('aria-selected', String(i === active)));
    if (links[active]) {
      input.setAttribute('aria-activedescendant', links[active].id);
      if (scroll) links[active].scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  }
  function render() {
    const query = input.value.trim();
    const ranked = words(query).length ? rankSearch(entries, query) : null;
    const { tokens, near, results: matches } = ranked || { tokens: [], near: null, results: featured.map(slug => entries.find(entry => !entry.section && entry.href.replace(/\/$/, '').endsWith(`/${slug}`))).filter(Boolean).map(entry => ({ entry, body: [] })) };
    results.replaceChildren();
    links = [];
    for (const [index, { entry, body }] of matches.entries()) {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.id = `search-result-${index}`;
      link.href = entry.href;
      link.tabIndex = -1;
      link.setAttribute('role', 'option');
      link.setAttribute('aria-selected', 'false');
      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.append(...highlight(entry.section || entry.title, tokens, near));
      const label = document.createElement('span');
      label.className = 'search-result-label';
      label.textContent = entry.section ? entry.title : entry.group;
      link.append(title, label);
      if (body.length) {
        const preview = document.createElement('span');
        preview.className = 'search-result-snippet';
        preview.append(...highlight(excerpt(entry.text, body, near), tokens, near));
        link.append(preview);
      }
      link.addEventListener('pointermove', () => { if (active !== index) select(index, false); });
      link.addEventListener('click', () => close(false));
      results.append(link);
      links.push(link);
    }
    status.textContent = !ranked ? '' : matches.length ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'}` : loaded ? `No matches for “${query}”` : 'Searching…';
    status.toggleAttribute('data-quiet', !ranked || matches.length > 0);
    input.setAttribute('aria-expanded', String(links.length > 0));
    select(links.length ? 0 : -1, false);
    results.scrollTop = 0;
  }
  async function loadIndex() {
    if (loading) return loading;
    loading = (async () => {
      try {
        const response = await fetch('/lambert-ga/search-index.json', { cache: 'no-cache', signal: controller.signal });
        if (!response.ok) throw new Error('Search index unavailable');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid search index');
        const valid = data.filter(entry => {
          if (!entry || typeof entry.title !== 'string' || typeof entry.href !== 'string') return false;
          try { const url = new URL(entry.href, location.origin); return url.origin === location.origin && url.pathname.startsWith('/lambert-ga/'); } catch { return false; }
        });
        if (valid.length) entries = valid;
      } catch {}
      finally { loaded = true; if (!destroyed && isOpen()) render(); }
    })();
    return loading;
  }
  function open() {
    if (destroyed || isOpen()) return;
    previousFocus = root.activeElement || document.activeElement;
    beforeOpen();
    pop.hidden = false;
    trigger?.setAttribute('aria-expanded', 'true');
    input.value = '';
    render();
    input.focus({ preventScroll: true });
    loadIndex();
  }
  function close(restoreFocus = true) {
    if (!isOpen()) return;
    pop.hidden = true;
    trigger?.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    if (restoreFocus) {
      const back = previousFocus?.isConnected && previousFocus !== document.body && !root.contains(previousFocus) && previousFocus.checkVisibility?.() ? previousFocus : trigger;
      back?.focus({ preventScroll: true });
    }
  }
  const toggle = () => isOpen() ? close() : open();
  function globalKey(event) {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      toggle();
    }
  }
  function outside(event) {
    if (isOpen() && !event.composedPath().some(node => node === pop || node === trigger)) close(false);
  }
  trigger?.addEventListener('click', toggle);
  pop.addEventListener('focusout', event => { const next = event.relatedTarget; if (next && next !== trigger && !pop.contains(next)) close(false); });
  pop.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (links.length) select((active + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length);
    } else if (event.key === 'Enter' && links[active]) { event.preventDefault(); links[active].click(); }
  });
  input.addEventListener('input', render);
  document.addEventListener('keydown', globalKey);
  document.addEventListener('pointerdown', outside, true);
  return { open, close, isOpen, destroy() { close(false); destroyed = true; controller.abort(); document.removeEventListener('keydown', globalKey); document.removeEventListener('pointerdown', outside, true); trigger?.removeEventListener('click', toggle); pop.remove(); } };
}
