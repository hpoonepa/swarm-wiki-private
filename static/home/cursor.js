/* A small, section-colored glow follows the pointer without trailing behind it. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
.story-cursor { position: fixed; top: 0; left: 0; width: 23px; height: 27px; z-index: 999; pointer-events: none; visibility: hidden; color: var(--cursor-edge,#fff); will-change: transform; }
.story-cursor[data-visible="true"] { visibility: visible; }
.story-cursor span { position: absolute; left: -14px; top: -12px; width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle,var(--cursor-glow,#766b8d) 0%,transparent 68%); opacity: .29; transition: opacity .16s,transform .16s; }
.story-cursor svg { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 1px 1px #29213724); transition: transform .12s; }
.story-cursor[data-link="true"] span { opacity: .42; transform: scale(.85); }
.story-cursor[data-pressed="true"] svg { transform: scale(.87); transform-origin: 3px 4px; }
@media (hover:hover) and (pointer:fine) { html.has-story-cursor, html.has-story-cursor * { cursor: none !important; } }
@media (prefers-reduced-motion:reduce) { .story-cursor span,.story-cursor svg { transition: none; } }
`;
  document.head.append(style);
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const home = !!document.querySelector('.hero');
  const cursor = document.createElement('div');
  cursor.className = 'story-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span></span><svg viewBox="0 0 28 32" fill="none"><path d="M4 3.5c-.9-.4-1.9.4-1.7 1.4l4.1 22c.2 1.1 1.7 1.4 2.3.4l5.1-8.5 9.4-3.4c1.1-.4 1.2-1.9.1-2.4L4 3.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  document.body.append(cursor);
  let x = 0, y = 0, inside = false, frame = 0;
  const palettes = {
    paper: ['#766b8d', '#ffffff'],
    gut: ['#a96c26', '#fff9e6'],
    rna: ['#ffb2bd', '#fff4ed'],
    forest: ['#ffe78a', '#fff7d8'],
    flower: ['#b87553', '#fffaf0'],
    sheet: ['#ffe78a', '#1a322a']
  };
  function hide() {
    cursor.dataset.visible = 'false';
    document.documentElement.classList.remove('has-story-cursor');
    document.querySelector('swarm-nav')?.removeAttribute('data-cursor-active');
  }
  function paint() {
    frame = 0;
    const target = document.elementFromPoint(x, y);
    if (!fine.matches || !inside || document.hidden || !target || target.closest('input,textarea,select,[contenteditable="true"],iframe') || document.documentElement.classList.contains('honey-scrubbing')) {
      hide(); return;
    }
    const nav = target.closest('swarm-nav');
    const theme = target.closest('#rnai') ? 'rna' : target.closest('#minibinders') ? 'gut' : nav ? (nav.hasAttribute('data-dark') ? 'forest' : 'sheet') : target.closest('.hero') ? 'forest' : target.closest('#together') ? 'flower' : home ? 'paper' : 'sheet';
    if (cursor.dataset.theme !== theme) {
      cursor.dataset.theme = theme;
      cursor.style.setProperty('--cursor-glow', palettes[theme][0]);
      cursor.style.setProperty('--cursor-edge', palettes[theme][1]);
    }
    cursor.dataset.link = String(!!target.closest('a,button,summary,swarm-nav'));
    place();
    if (cursor.dataset.visible !== 'true') {
      cursor.dataset.visible = 'true';
      document.documentElement.classList.add('has-story-cursor');
      document.querySelector('swarm-nav')?.setAttribute('data-cursor-active', '');
    }
  }
  function place() { cursor.style.transform = `translate3d(${x - 3}px,${y - 4}px,0)`; }
  function kick() { if (!frame) frame = requestAnimationFrame(paint); }
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
})();
