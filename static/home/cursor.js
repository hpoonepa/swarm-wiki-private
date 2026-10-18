/* A small, section-colored glow follows the pointer without trailing behind it, and carries over between pages. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
.story-cursor { position: fixed; top: 0; left: 0; width: 23px; height: 27px; z-index: 999; pointer-events: none; visibility: hidden; color: var(--cursor-edge,#fff); will-change: transform; }
.story-cursor[data-visible="true"] { visibility: visible; }
.story-cursor span { position: absolute; left: -14px; top: -12px; width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle,var(--cursor-glow,#766b8d) 0%,transparent 68%); opacity: .29; transition: opacity .16s,transform .16s; }
.story-cursor svg { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 1px 1px #29213724); transition: transform .12s; }
.story-cursor[data-link="true"] span { opacity: .42; transform: scale(.85); }
.story-cursor[data-pressed="true"] svg { transform: scale(.87); transform-origin: 3px 4px; }
@media (hover:hover) and (pointer:fine) {
  html.has-story-cursor:not(:has(dialog:modal)), html.has-story-cursor:not(:has(dialog:modal)) * { cursor: none !important; }
  html:has(dialog:modal) .story-cursor { visibility: hidden; }
}
@media (prefers-reduced-motion:reduce) { .story-cursor span,.story-cursor svg { transition: none; } }
`;
  document.head.append(style);
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const cursor = document.createElement('div');
  cursor.className = 'story-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span></span><svg viewBox="0 0 28 32" fill="none"><path d="M4 3.5c-.9-.4-1.9.4-1.7 1.4l4.1 22c.2 1.1 1.7 1.4 2.3.4l5.1-8.5 9.4-3.4c1.1-.4 1.2-1.9.1-2.4L4 3.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  (document.body || document.documentElement).append(cursor);
  let x = 0, y = 0, inside = false, frame = 0, theme = '', home = false;
  const palettes = {
    paper: ['#766b8d', '#ffffff'],
    gut: ['#a96c26', '#fff9e6'],
    rna: ['#ffb2bd', '#fff4ed'],
    forest: ['#ffe78a', '#fff7d8'],
    flower: ['#b87553', '#fffaf0'],
    sheet: ['#ffe78a', '#1a322a']
  };
  const isHome = () => home || (home = !!document.querySelector('.hero'));
  function setTheme(next) {
    if (theme === next) return;
    theme = next;
    cursor.dataset.theme = next;
    cursor.style.setProperty('--cursor-glow', palettes[next][0]);
    cursor.style.setProperty('--cursor-edge', palettes[next][1]);
  }
  function place() { cursor.style.transform = `translate3d(${x - 3}px,${y - 4}px,0)`; }
  function show() {
    cursor.dataset.visible = 'true';
    document.documentElement.classList.add('has-story-cursor');
    const nav = document.querySelector('swarm-nav');
    if (nav && !nav.hasAttribute('data-cursor-active')) nav.setAttribute('data-cursor-active', '');
  }
  function hide() {
    cursor.dataset.visible = 'false';
    document.documentElement.classList.remove('has-story-cursor');
    document.querySelector('swarm-nav')?.removeAttribute('data-cursor-active');
  }
  function paint() {
    frame = 0;
    const target = document.elementFromPoint(x, y);
    // Modal dialogs occupy the browser's top layer, above any document z-index.
    // Use the native pointer there so it stays visible over both paper and backdrop.
    if (!fine.matches || !inside || document.hidden || document.querySelector('dialog:modal') || !target || target.closest('input,textarea,select,[contenteditable="true"],iframe') || document.documentElement.classList.contains('honey-scrubbing')) {
      hide(); return;
    }
    const nav = target.closest('swarm-nav');
    setTheme(target.closest('#rnai') ? 'rna' : target.closest('#minibinders') ? 'gut' : nav ? (nav.hasAttribute('data-dark') ? 'forest' : 'sheet') : target.closest('.hero') ? 'forest' : target.closest('#together') ? 'flower' : isHome() ? 'paper' : 'sheet');
    cursor.dataset.link = String(!!target.closest('a,button,summary,swarm-nav'));
    place();
    show();
  }
  function kick() { if (!frame) frame = requestAnimationFrame(paint); }
  new MutationObserver(records => {
    if (!records.some(record => record.target instanceof HTMLDialogElement)) return;
    if (document.querySelector('dialog:modal')) hide();
    else kick();
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['open'] });
  function move(event) {
    if (event.pointerType === 'touch') { inside = false; hide(); return; }
    x = event.clientX; y = event.clientY; inside = true;
    if (cursor.dataset.visible === 'true') place();
    kick();
  }
  addEventListener('pointermove', move, {passive: true});
  if ('onpointerrawupdate' in window) addEventListener('pointerrawupdate', move, {passive: true});
  addEventListener('scroll', kick, {passive: true});
  addEventListener('resize', kick);
  addEventListener('pointerdown', () => { cursor.dataset.pressed = 'true'; });
  addEventListener('pointerup', () => { cursor.dataset.pressed = 'false'; kick(); });
  document.documentElement.addEventListener('pointerleave', () => { inside = false; hide(); });
  addEventListener('blur', () => { inside = false; hide(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  fine.addEventListener('change', () => { if (!fine.matches) hide(); else kick(); });
  document.addEventListener('DOMContentLoaded', kick);
  addEventListener('pagehide', () => { if (inside) try { sessionStorage.setItem('swarm-cursor', JSON.stringify({ x, y, theme })); } catch {} });
  try {
    const last = JSON.parse(sessionStorage.getItem('swarm-cursor') || 'null');
    if (last && fine.matches && !document.hidden) {
      x = last.x; y = last.y; inside = true;
      setTheme(last.theme in palettes ? last.theme : 'sheet');
      place();
      show();
    }
  } catch {}
})();
