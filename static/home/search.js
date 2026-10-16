import { groups } from './nav-data.js?v=3ae2556f1170';

const magnifier = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.7" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.4 4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
export const searchTrigger = `<button type="button" class="search-trigger" title="Search wiki (⌘/Ctrl K)" aria-label="Search the wiki" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">${magnifier}</button>`;
export const searchStyles = `
  .search-trigger { pointer-events:auto; flex:0 0 auto; display:flex; align-items:center; justify-content:center; width:44px; height:40px; padding:0; border-radius:999px; background:transparent; white-space:nowrap; color:inherit; font-size:13px; font-weight:550; transition:transform .18s, color .18s; }
  .search-trigger:hover { background:rgba(192,139,37,.12); color:#9a6410; }
  .search-trigger svg { width:18px; height:18px; flex:none; }
  :host([data-dark]) .search-trigger:hover { color:#ffd66b; }
  .search-dialog { position:fixed; inset:0; margin:clamp(28px,12vh,120px) auto auto; width:min(740px,calc(100vw - 40px)); max-width:none; max-height:min(740px,calc(100dvh - clamp(28px,12vh,120px) - 24px)); padding:0; overflow:hidden; border:1px solid #ddcda8; border-radius:24px; background:#fffdf6; color:#183f34; box-shadow:0 30px 100px #0b2b2340; pointer-events:auto; font-family:inherit; }
  .search-dialog[open] { display:flex; flex-direction:column; animation:search-enter .2s ease-out; }
  .search-dialog::backdrop { background:#142f2966; backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px); }
  .search-heading { display:flex; align-items:center; justify-content:space-between; padding:22px 26px 12px; gap:20px; }
  .search-heading h2 { margin:0; font-size:20px; line-height:1.3; letter-spacing:-.04em; font-weight:650; }
  .search-close { display:flex; align-items:center; justify-content:center; width:36px; height:36px; flex:none; border-radius:50%; background:#f1ead9; color:#35574a; font-size:23px; font-weight:400; line-height:1; }
  .search-close:hover { background:#ffe6a0; }
  .search-field { display:flex; align-items:center; gap:13px; margin:0 26px 12px; padding:0 16px; min-height:58px; border:1px solid #d0ba85; border-radius:13px; background:white; box-shadow:0 2px 4px #473b1510; }
  .search-field:focus-within { border-color:#bc861b; box-shadow:0 0 0 3px #efd28345; }
  .search-field > svg { width:21px; height:21px; flex:none; color:#a26e17; }
  .search-input { width:100%; min-width:0; padding:17px 0; border:0; outline:0; background:transparent; color:#173f34; font:inherit; font-size:17px; line-height:1.4; }
  .search-input::placeholder { color:#829087; }
  .search-input::-webkit-search-cancel-button { cursor:pointer; }
  .search-status { padding:0 28px 12px; margin:0; min-height:30px; color:#737b69; font-size:12px; line-height:1.5; }
  .search-results { overflow-y:auto; overscroll-behavior:contain; min-height:0; padding:0 12px 12px; margin:0; list-style:none; scrollbar-width:thin; scrollbar-color:#d5c59f transparent; }
  .search-result { display:block; padding:15px 16px; border-radius:12px; text-decoration:none; color:#183f34; border:1px solid transparent; transition:background .12s, border-color .12s; }
  .search-result[aria-selected='true'], .search-result:hover { background:#f9edca; border-color:#e8d6a8; }
  .search-result-meta { display:block; margin-bottom:5px; color:#8b6b35; font-size:11px; line-height:1.4; letter-spacing:.04em; }
  .search-result-title { display:flex; align-items:baseline; gap:12px; font-size:17px; font-weight:650; letter-spacing:-.02em; line-height:1.4; }
  .search-result-title::after { content:'↗'; margin-left:auto; color:#b28227; font-size:19px; opacity:0; }
  .search-result[aria-selected='true'] .search-result-title::after, .search-result:hover .search-result-title::after { opacity:1; }
  .search-result-snippet { display:block; margin-top:5px; color:#65756a; font-size:13px; line-height:1.6; }
  .search-empty { padding:24px 16px 38px; color:#617569; font-size:15px; line-height:1.7; }
  .search-footer { display:flex; justify-content:space-between; gap:15px; flex-wrap:wrap; padding:14px 27px; border-top:1px solid #e8dfca; background:#f8f3e7; color:#7a806d; font-size:11px; line-height:1.5; }
  .search-footer kbd { font:inherit; color:#38574b; }
  .search-dialog :is(button,a):focus-visible { outline:2px solid #a56f10; outline-offset:-3px; }
  @keyframes search-enter { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  @media (max-width:1100px) { .search-trigger { height:44px; } }
  @media (max-width:600px) { .search-dialog { width:calc(100vw - 20px); margin:12px auto auto; max-height:calc(100dvh - 24px); border-radius:19px; } .search-heading { padding:17px 19px 12px; } .search-field { margin-inline:18px; min-height:54px; padding-inline:13px; } .search-input { font-size:16px; } .search-status { padding-inline:20px; } .search-results { padding-inline:7px; } .search-result { padding:14px 12px; } .search-footer { padding:12px 20px; } .search-footer-keys { display:none; } }
  @media (prefers-reduced-motion:reduce) { .search-dialog[open] { animation:none; } .search-trigger,.search-result { transition:none; } .search-trigger:hover { transform:none; } }
`;

const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Rank pages and their headings locally. No query is sent to a server. */
export function rankSearch(entries, query, limit = 12) {
  const needle = normalize(query);
  if (!needle) return entries.filter(entry => !entry.section).slice(0, limit);
  const tokens = needle.split(/\s+/);
  return entries.map((entry, order) => {
    const title = normalize(entry.title), section = normalize(entry.section), group = normalize(entry.group), body = normalize(entry.text);
    const all = `${title} ${section} ${group} ${body}`;
    if (!tokens.every(token => all.includes(token))) return null;
    let score = (title === needle ? 180 : title.startsWith(needle) ? 110 : title.includes(needle) ? 85 : 0)
      + (section === needle ? 140 : section.startsWith(needle) ? 100 : section.includes(needle) ? 65 : 0)
      + (body.includes(needle) ? 12 : 0) + (entry.section ? 0 : 6);
    for (const token of tokens) score += (title.includes(token) ? 24 : 0) + (section.includes(token) ? 18 : 0) + (group.includes(token) ? 5 : 0);
    return { entry, score, order };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.order - b.order).slice(0, limit).map(result => result.entry);
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

function snippet(text, query) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const tokens = normalize(query).split(' ').filter(Boolean);
  const lower = clean.toLowerCase();
  const matches = tokens.map(token => lower.indexOf(token)).filter(index => index >= 0);
  const start = matches.length ? Math.max(0, Math.min(...matches) - 45) : 0;
  const end = Math.min(clean.length, start + 160);
  return `${start ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`;
}

export function mountSearch(root, { beforeOpen = () => {} } = {}) {
  const trigger = root.querySelector('.search-trigger');
  const dialog = document.createElement('dialog');
  dialog.className = 'search-dialog';
  dialog.setAttribute('aria-labelledby', 'search-title');
  dialog.innerHTML = `<div class="search-heading"><h2 id="search-title">Search the wiki</h2><button type="button" class="search-close" aria-label="Close search">×</button></div><div class="search-field">${magnifier}<input class="search-input" type="search" placeholder="Find a page, topic or section…" aria-label="Search pages and sections" role="combobox" aria-autocomplete="list" aria-controls="search-results" aria-expanded="true" autocomplete="off" spellcheck="false" maxlength="160"></div><p class="search-status" role="status" aria-live="polite"></p><div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div><div class="search-footer"><span>SWARM · Lambert iGEM</span><span class="search-footer-keys"><kbd>↑ ↓</kbd> to explore &nbsp; <kbd>Enter</kbd> to open &nbsp; <kbd>Esc</kbd> to close</span></div>`;
  root.append(dialog);
  const input = dialog.querySelector('.search-input'), results = dialog.querySelector('.search-results'), status = dialog.querySelector('.search-status');
  let entries = navigationEntries(), loaded = false, loading = null, active = -1, links = [], previousFocus = null, previousOverflow = '', destroyed = false;
  const controller = new AbortController();

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
    let matches = rankSearch(entries, query);
    if (!query) {
      const featured = ['description', 'minibinder', 'rnai', 'software', 'hardware', 'human-practices'];
      matches = featured.map(slug => entries.find(entry => !entry.section && entry.href.replace(/\/$/, '').endsWith(`/${slug}`))).filter(Boolean);
      if (!matches.length) matches = rankSearch(entries, '', 6);
    }
    results.replaceChildren();
    links = [];
    status.textContent = !query ? 'Explore the writeups' : matches.length ? `${matches.length}${matches.length === 12 ? '+' : ''} ${matches.length === 1 ? 'result' : 'results'} for “${query}”` : loaded ? `No results for “${query}”` : 'Loading page content…';
    for (const [index, entry] of matches.entries()) {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.id = `search-result-${index}`;
      link.href = entry.href;
      link.setAttribute('role', 'option');
      link.setAttribute('aria-selected', 'false');
      link.tabIndex = -1;
      const meta = document.createElement('span');
      meta.className = 'search-result-meta';
      meta.textContent = [entry.group, entry.section ? entry.title : 'Page'].filter(Boolean).join(' / ');
      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.textContent = entry.section || entry.title;
      link.append(meta, title);
      const excerpt = snippet(entry.text, query);
      if (excerpt) {
        const preview = document.createElement('span');
        preview.className = 'search-result-snippet';
        preview.textContent = excerpt;
        link.append(preview);
      }
      link.addEventListener('pointermove', () => select(index, false));
      link.addEventListener('click', () => close(false));
      results.append(link);
      links.push(link);
    }
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = loaded ? 'Try a page name or a shorter term, like “RNAi”, “software” or “minibinder”.' : 'You can still search page names while the full index loads.';
      results.append(empty);
    }
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
      } catch { /* Page-name navigation remains available offline or before the first build. */ }
      finally { loaded = true; if (!destroyed && dialog.open) render(); }
    })();
    return loading;
  }
  function open() {
    if (destroyed || dialog.open) return;
    previousFocus = root.activeElement || document.activeElement;
    beforeOpen();
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    trigger?.setAttribute('aria-expanded', 'true');
    input.value = '';
    render();
    input.focus({ preventScroll: true });
    loadIndex();
  }
  function close(restoreFocus = true) {
    if (!dialog.open) return;
    dialog.close();
    document.documentElement.style.overflow = previousOverflow;
    trigger?.setAttribute('aria-expanded', 'false');
    if (restoreFocus) {
      const visible = previousFocus?.isConnected && !previousFocus.closest('[inert], .map') && !root.host?.hasAttribute('data-hidden');
      (visible ? previousFocus : root.querySelector('.honey-toggle'))?.focus({ preventScroll: true });
    }
  }
  function globalKey(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.altKey) {
      event.preventDefault();
      dialog.open ? close() : open();
    }
  }
  trigger?.addEventListener('click', open);
  dialog.querySelector('.search-close').addEventListener('click', () => close());
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    else if (event.target === input && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      if (links.length) select((active + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length);
    } else if (event.target === input && event.key === 'Enter' && links[active]) { event.preventDefault(); links[active].click(); }
  });
  input.addEventListener('input', render);
  document.addEventListener('keydown', globalKey);
  return { open, close, isOpen: () => dialog.open, destroy() { close(false); destroyed = true; controller.abort(); document.removeEventListener('keydown', globalKey); trigger?.removeEventListener('click', open); dialog.remove(); } };
}
