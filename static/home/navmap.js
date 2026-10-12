export const mapStyles = `
  :host([data-map-open]) { z-index: 900; }
  .map { position: absolute; inset: 0; z-index: 1; display: none; overflow: auto; overscroll-behavior: contain; color: #1a322a; pointer-events: auto; --ease-out: cubic-bezier(.22, 1, .36, 1); --ease-in: cubic-bezier(.7, 0, .84, 0); }
  .map.is-open, .map.is-closing { display: block; }
  .map.is-closing { pointer-events: none; }
  .map__veil { position: absolute; inset: 0; background: #FFFDF6; }
  .map.is-open .map__veil { animation: map-fade .22s var(--ease-out) both; }
  .map.is-closing .map__veil { animation: map-fade-out .2s var(--ease-in) both; animation-delay: .42s; }
  .map__stage { position: absolute; inset: 0; display: grid; place-items: center; padding: 72px 32px 48px; }
  .comb { position: relative; width: var(--w); height: var(--h); }
  .comb svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .comb__cells { transform-origin: 100% 0; }
  .map.is-open .comb__cells { animation: map-unfold .9s var(--ease-out) both; }
  .map.is-closing .comb__cells { animation: map-fold .58s var(--ease-in) both; }
  .cell { transform-box: fill-box; transform-origin: center; }
  .map.is-open .cell { animation: map-pop .42s var(--ease-out) both; animation-delay: var(--d); }
  .map.is-closing .cell { animation: map-pop-out .3s var(--ease-in) both; animation-delay: calc(var(--dmax) - var(--d)); }
  .cell--wax.is-wall polygon { fill: none; stroke-width: 1.6; }
  .cell--page { filter: drop-shadow(0 2px 3px rgba(26, 50, 42, .10)) drop-shadow(0 14px 26px rgba(26, 50, 42, .14)); transition: transform .18s var(--ease-out), filter .18s; }
  .cell--page polygon { transition: fill .15s; }
  .cell--page text { fill: #1a322a; font-weight: 650; letter-spacing: -.01em; pointer-events: none; }
  .cell--page:hover, .cell--page:focus-visible { transform: translateY(-3px); filter: drop-shadow(0 4px 6px rgba(26, 50, 42, .10)) drop-shadow(0 22px 34px rgba(26, 50, 42, .18)); }
  .cell--page:hover polygon { fill: #FFE38F; }
  .cell--page:focus-visible { outline: none; }
  .cell--page:focus-visible polygon { stroke: #1a322a; stroke-width: 2; }
  .cell--current polygon { fill: #FFF0BF; }
  .honey { filter: drop-shadow(0 1px 1.5px rgba(120, 70, 0, .35)); }
  .honey__stream { fill: none; stroke: #F5B827; stroke-linecap: round; stroke-linejoin: round; }
  .honey__sheen { fill: none; stroke: rgba(255, 248, 214, .9); stroke-linecap: round; stroke-linejoin: round; }
  .map.is-open .honey__stream { animation: map-pour 1.6s cubic-bezier(.45, .05, .35, 1) both; animation-delay: calc(var(--d) + .35s); }
  .map.is-open .honey__sheen { animation: map-sheen 4.5s linear infinite; animation-delay: calc(var(--d) + 2.3s); }
  .title { position: absolute; z-index: 2; margin: 0; white-space: nowrap; transform: translateY(-50%); font-size: var(--ts); line-height: .95; font-weight: 800; letter-spacing: -.045em; }
  .map.is-open .title { animation: map-rise .5s var(--ease-out) both; animation-delay: .38s; }
  .map.is-closing .title { animation: map-drop .22s var(--ease-in) both; }
  .stack { display: flex; flex-direction: column; gap: 26px; }
  .stack .title { position: static; transform: none; margin: 0 0 6px; }
  @keyframes map-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes map-fade-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes map-unfold { from { transform: scale(.18); } to { transform: scale(1); } }
  @keyframes map-fold { from { transform: scale(1); } to { transform: scale(.18); } }
  @keyframes map-pop { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
  @keyframes map-pop-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(.3); } }
  @keyframes map-rise { from { opacity: 0; transform: translateY(calc(-50% + 10px)); } to { opacity: 1; transform: translateY(-50%); } }
  @keyframes map-drop { from { opacity: 1; transform: translateY(-50%); } to { opacity: 0; transform: translateY(calc(-50% + 10px)); } }
  @keyframes map-pour { to { stroke-dashoffset: 0; } }
  @keyframes map-sheen { from { stroke-dashoffset: var(--L); } to { stroke-dashoffset: calc(var(--L) * -1); } }
  @media (max-width: 760px) {
    .map__stage { display: block; padding: 84px 18px 40px; }
    .map.is-open .comb__cells { animation: none; }
    .stack .title { animation: none !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .map.is-open .comb__cells, .map.is-open .cell, .map.is-open .title { animation: map-fade .2s var(--ease-out) both; }
    .map.is-closing .comb__cells, .map.is-closing .cell, .map.is-closing .title { animation: map-fade-out .2s var(--ease-in) both; }
    .map.is-closing .map__veil { animation-delay: 0s; }
    .map.is-open .honey__stream { animation: none; stroke-dashoffset: 0; }
    .map.is-open .honey__sheen { animation: none; }
  }
`;

const layout = {
  'Team': { cells: [[0, 1], [1, 1]], pocket: [[0, 0], [1, 0]] },
  'Project': { cells: [[3, 1], [4, 1], [5, 1], [4, 2]], pocket: [[3, 0], [4, 0], [5, 0]] },
  'Drylab': { cells: [[8, 1], [9, 1], [10, 1]], pocket: [[8, 0], [9, 0], [10, 0]] },
  'Wetlab': { cells: [[0, 4], [1, 4], [2, 4], [3, 4], [0, 5], [1, 5], [2, 5]], pocket: [[0, 3], [1, 3], [2, 3]] },
  'Human Practices': { cells: [[6, 4], [7, 4], [8, 4], [6, 5], [7, 5], [8, 5]], pocket: [[6, 3], [7, 3], [8, 3], [9, 3]] },
};
const COLS = 12, ROWS = 7, SEED = [11, 0];

const WAX = ['#FEC341', '#F5B827', '#E5B144', '#EDAA22', '#D98E14'], PAGE = ['#FFD65C', '#FFCF45', '#F9C640', '#FFDA6B'];
const pick = (list, c, r, s) => list[Math.floor(noise(c, r, s) * list.length)];
const noise = (a, b, s) => { let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(s, 2246822519)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const cube = (c, r) => { const q = c - (r - (r & 1)) / 2; return [q, r, -q - r]; };
const hexDist = (a, b) => { const A = cube(...a), B = cube(...b); return Math.max(Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1]), Math.abs(A[2] - B[2])); };
const hexPoints = (cx, cy, rad) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 180 * (60 * k + 30); return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`; }).join(' ');
const wrap = (text, max) => { const lines = ['']; for (const w of text.split(' ')) { const t = lines[lines.length - 1]; if (t && (t + ' ' + w).length > max) lines.push(w); else lines[lines.length - 1] = t ? t + ' ' + w : w; } return lines; };
const delay = (c, r, seed) => (0.04 + hexDist([c, r], seed) * 0.032).toFixed(3) + 's';
const splitWords = title => title.split(' ').flatMap(w => w.length > 15 ? [w.slice(0, 8) + '-', w.slice(8)] : [w]);
const measure = (() => { let ctx; return (text, px) => { ctx ||= document.createElement('canvas').getContext('2d'); ctx.font = `650 ${px}px 'Inter Variable', Inter, sans-serif`; return ctx.measureText(text).width; }; })();
const labelSize = (sections, R) => { const widest = Math.max(...sections.flatMap(([, items]) => items.flatMap(([title]) => splitWords(title).map(w => measure(w, 100))))); return Math.min(.215 * R, 1.56 * R * 100 / widest); };

function cellSvg(c, r, R, kind, opts = {}) {
  const HW = Math.sqrt(3) * R, cx = HW * (c + (r & 1) * .5) + HW / 2, cy = 1.5 * R * r + R, d = delay(c, r, opts.seed || SEED);
  if (kind === 'wax') {
    const o = ((0.10 + 0.14 * noise(c, r, 2)) * (opts.fade ?? 1)).toFixed(3), wall = noise(c, r, 3) < 0.16;
    return `<g class="cell cell--wax${wall ? ' is-wall' : ''}" style="--d:${d}"><polygon points="${hexPoints(cx, cy, R * .92)}" ${wall ? 'stroke' : 'fill'}="${pick(WAX, c, r, 4)}" ${wall ? `stroke-opacity="${(+o + .18).toFixed(2)}"` : `fill-opacity="${o}"`}/></g>`;
  }
  const [title, slug] = opts.page, current = slug === opts.current;
  const fs = opts.fs, lines = wrap(splitWords(title).join(' '), 11).slice(0, 3);
  const text = lines.map((l, i) => `<tspan x="${cx.toFixed(1)}" dy="${i ? '1.15em' : `${(-(lines.length - 1) * .575).toFixed(2)}em`}">${l}</tspan>`).join('');
  let honey = '';
  if (current) {
    const rad = R * .92, V = a => `${(cx + rad * Math.cos(Math.PI / 180 * a)).toFixed(1)} ${(cy + rad * Math.sin(Math.PI / 180 * a)).toFixed(1)}`, L = (3 * rad).toFixed(1);
    const right = `M${V(270)}L${V(330)}L${V(30)}L${V(90)}`, left = `M${V(270)}L${V(210)}L${V(150)}L${V(90)}`, bw = (R * .14).toFixed(1), sw = (R * .045).toFixed(1), dash = `${(rad * .45).toFixed(1)} ${L}`;
    honey = `<g class="honey" style="--L:${L}px;--d:${d}">${[right, left].map(p => `<path class="honey__stream" d="${p}" stroke-width="${bw}" stroke-dasharray="${L}" stroke-dashoffset="${L}"/>`).join('')}${[right, left].map(p => `<path class="honey__sheen" d="${p}" stroke-width="${sw}" stroke-dasharray="${dash}" stroke-dashoffset="${L}"/>`).join('')}</g>`;
  }
  return `<a class="cell cell--page${current ? ' cell--current' : ''}" href="/lambert-ga/${slug}/" style="--d:${d}"${current ? ' aria-current="page"' : ''}><polygon points="${hexPoints(cx, cy, R * .92)}" fill="${pick(PAGE, c, r, 6)}"/><text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="${fs.toFixed(1)}">${text}</text>${honey}</a>`;
}

function comb(sections, current) {
  const R = Math.max(40, Math.min(60, (innerWidth - 96) / (COLS + .5) / Math.sqrt(3), (innerHeight - 120) / (1.5 * (ROWS - 1) + 2)));
  const HW = Math.sqrt(3) * R, W = HW * (COLS + .5), H = 1.5 * R * (ROWS - 1) + 2 * R;
  const taken = new Set(), pages = [];
  for (const key in layout) { layout[key].cells.forEach(cell => { taken.add(cell.join()); pages.push(cell); }); layout[key].pocket.forEach(cell => taken.add(cell.join())); }
  const fs = labelSize(sections, R);
  let cells = '', last = '';
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (taken.has([c, r].join())) continue;
    const near = Math.min(...pages.map(p => hexDist([c, r], p)));
    cells += cellSvg(c, r, R, 'wax', { fade: [1, 1, .62, .34, .16][Math.min(near, 4)] });
  }
  for (const [title, items] of sections) layout[title].cells.forEach(([c, r], i) => { if (!items[i]) return; const svg = cellSvg(c, r, R, 'page', { page: items[i], current, fs }); if (items[i][1] === current) last = svg; else cells += svg; });
  const titles = sections.map(([title]) => { const [c, r] = layout[title].pocket[0]; return `<h3 class="title" style="left:${(HW * (c + (r & 1) * .5) + HW * .12).toFixed(1)}px;top:${(1.5 * R * r + R).toFixed(1)}px;--ts:${(R * .58).toFixed(1)}px">${title}</h3>`; }).join('');
  return `<div class="comb" style="--w:${W.toFixed(1)}px;--h:${H.toFixed(1)}px;--dmax:${delay(0, ROWS - 1, SEED)}"><svg viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}"><g class="comb__cells">${cells}${last}</g></svg>${titles}</div>`;
}

function stack(sections, current) {
  const R = Math.min(52, (innerWidth - 36) / 3.5 / Math.sqrt(3)), HW = Math.sqrt(3) * R, cols = 3, fs = labelSize(sections, R);
  return `<div class="stack">${sections.map(([title, items]) => {
    const rows = Math.ceil(items.length / cols), W = HW * (cols + .5), H = 1.5 * R * (rows - 1) + 2 * R;
    const cells = items.map((page, i) => cellSvg(i % cols, Math.floor(i / cols), R, 'page', { page, current, fs, seed: [cols - 1, 0] })).join('');
    return `<section><h3 class="title" style="--ts:${(R * .56).toFixed(1)}px">${title}</h3><div class="comb" style="--w:${W.toFixed(1)}px;--h:${H.toFixed(1)}px;--dmax:${delay(0, rows - 1, [cols - 1, 0])}"><svg viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}"><g class="comb__cells">${cells}</g></svg></div></section>`;
  }).join('')}</div>`;
}

export function mountMap(root, { sections, current, onToggle }) {
  const map = document.createElement('div');
  map.className = 'map'; map.setAttribute('role', 'dialog'); map.setAttribute('aria-modal', 'true'); map.setAttribute('aria-label', 'Project map');
  map.innerHTML = '<div class="map__veil"></div><div class="map__stage"></div>';
  root.append(map);
  const stage = map.querySelector('.map__stage');
  let timer = 0;
  const isOpen = () => map.classList.contains('is-open');
  const build = () => { stage.innerHTML = innerWidth <= 760 ? stack(sections, current) : comb(sections, current); };
  const open = () => {
    if (isOpen()) return;
    clearTimeout(timer); build();
    map.classList.remove('is-closing'); map.classList.add('is-open');
    root.host.removeAttribute('data-dark');
    onToggle(true);
    requestAnimationFrame(() => (map.querySelector('.cell--current') || map.querySelector('.cell--page'))?.focus({ preventScroll: true }));
  };
  const close = () => {
    if (!isOpen()) return;
    map.classList.remove('is-open'); map.classList.add('is-closing');
    onToggle(false);
    dispatchEvent(new Event('scroll'));
    timer = setTimeout(() => { map.classList.remove('is-closing'); stage.innerHTML = ''; }, 640);
  };
  map.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const cells = [...map.querySelectorAll('.cell--page')], first = cells[0], last = cells[cells.length - 1];
    if (event.shiftKey && root.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && root.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  addEventListener('resize', () => { if (isOpen()) build(); });
  return { open, close, isOpen };
}
