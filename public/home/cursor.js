/* A small, section-colored glow follows the pointer without trailing behind it. */
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
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
    flower: ['#b87553', '#fffaf0']
  };
  function hide() {
    cursor.dataset.visible = 'false';
    document.documentElement.classList.remove('has-story-cursor');
    document.querySelector('swarm-nav')?.removeAttribute('data-cursor-active');
  }
  function paint() {
    frame = 0;
    const target = document.elementFromPoint(x, y);
    // Keep familiar native cursors for editing, grabbing and embedded documents.
    if (!fine.matches || !inside || document.hidden || !target || target.closest('input,textarea,select,[contenteditable="true"],iframe,[role="slider"],#capsid-host') || document.documentElement.classList.contains('honey-scrubbing')) {
      hide(); return;
    }
    const theme = target.closest('#rnai') ? 'rna' : target.closest('#minibinders') ? 'gut' : target.closest('.hero,swarm-nav') ? 'forest' : target.closest('#together') ? 'flower' : 'paper';
    if (cursor.dataset.theme !== theme) {
      cursor.dataset.theme = theme;
      cursor.style.setProperty('--cursor-glow', palettes[theme][0]);
      cursor.style.setProperty('--cursor-edge', palettes[theme][1]);
    }
    cursor.dataset.link = String(!!target.closest('a,button,summary,swarm-nav'));
    cursor.style.transform = `translate3d(${x - 3}px,${y - 4}px,0)`;
    cursor.dataset.visible = 'true';
    document.documentElement.classList.add('has-story-cursor');
    document.querySelector('swarm-nav')?.setAttribute('data-cursor-active', '');
  }
  function kick() { if (!frame) frame = requestAnimationFrame(paint); }
  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') { inside = false; hide(); return; }
    x = event.clientX; y = event.clientY; inside = true; kick();
  }, {passive: true});
  addEventListener('scroll', kick, {passive: true});
  addEventListener('resize', kick);
  addEventListener('pointerdown', () => { cursor.dataset.pressed = 'true'; });
  addEventListener('pointerup', () => { cursor.dataset.pressed = 'false'; kick(); });
  document.documentElement.addEventListener('pointerleave', () => { inside = false; hide(); });
  addEventListener('blur', () => { inside = false; hide(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  fine.addEventListener('change', () => { if (!fine.matches) hide(); else kick(); });
})();
