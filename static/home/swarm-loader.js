/* Draw contours traced from the actual logo, then fill them with its original colors. */
(() => {
  const root = document.documentElement;
  const loader = document.getElementById('loader');
  if (!loader) return;
  const logo = loader.querySelector('.ld-original-logo');
  const art = loader.querySelector('.ld-art');
  const heroLogo = document.querySelector('#heroLogo img');
  const outlines = [...loader.querySelectorAll('[data-outline]')].map(path => ({
    path, start: Number(path.dataset.start), duration: Number(path.dataset.duration),
    colorStart: Number(path.dataset.colorStart),
  }));
  const regions = [...loader.querySelectorAll('[data-color]')].map(path => ({
    path, start: Number(path.dataset.start),
  }));
  const preview = new URLSearchParams(location.search).get('loader') === 'preview';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 180 : 1550;
  const main = document.getElementById('main-content');
  const originalInert = main?.inert ?? false;
  const asset = new Image();
  let start = null, frame = 0, done = false, heroReady = false, failSafe, repeat;
  if (main) main.inert = true;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  // Use the real image's box, including responsive styles, rather than approximating its placement.
  function alignToHero() {
    if (!heroLogo) return;
    const box = heroLogo.getBoundingClientRect();
    const overlay = loader.getBoundingClientRect();
    art.style.left = `${box.left - overlay.left}px`;
    art.style.top = `${box.top - overlay.top}px`;
    art.style.width = `${box.width}px`;
    art.style.height = `${box.height}px`;
  }
  alignToHero();
  window.addEventListener('resize', alignToHero, {passive: true});
  const sizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(alignToHero) : null;
  if (heroLogo) sizeObserver?.observe(heroLogo);
  const hero = document.querySelector('.hero > img');
  const ready = () => { heroReady = true; };
  if (!hero || hero.complete) ready();
  else { hero.addEventListener('load', ready, {once: true}); hero.addEventListener('error', ready, {once: true}); }
  const clamp = p => Math.max(0, Math.min(1, p));
  const smooth = p => p * p * (3 - 2 * p);
  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(frame);
    clearTimeout(failSafe);
    clearTimeout(repeat);
    asset.onload = asset.onerror = null;
    hero?.removeEventListener('load', ready);
    hero?.removeEventListener('error', ready);
    document.removeEventListener('keydown', onKey);
    // Finish the exact artwork before revealing the garden behind it.
    logo.removeAttribute('mask');
    for (const stroke of outlines) stroke.path.style.opacity = '0';
    alignToHero();
    loader.classList.add('ld-leaving');
    setTimeout(() => {
      // Swap to the actual hero in a single frame. Its logo never moves or cross-fades.
      root.classList.remove('loading');
      if (main) main.inert = originalInert;
      window.removeEventListener('resize', alignToHero);
      sizeObserver?.disconnect();
      loader.remove();
      window.dispatchEvent(new Event('swarm-ready'));
    }, reduced ? 170 : 440);
  }
  function draw(now) {
    if (done) return;
    if (start === null) start = now;
    const elapsed = now - start;
    const t = reduced ? 4650 : elapsed * 3;
    for (const stroke of outlines) {
      const p = clamp((t - stroke.start) / stroke.duration);
      stroke.path.style.strokeDashoffset = String(1 - p);
      stroke.path.style.opacity = String(1 - smooth(clamp((t - stroke.colorStart) / 520)));
    }
    for (const region of regions) region.path.style.opacity = String(smooth(clamp((t - region.start) / 520)));
    // Once colored, remove the traced mask to show every original antialiased pixel.
    if (t >= 4250) logo.removeAttribute('mask');
    if (elapsed >= duration) {
      if (preview) {
        if (!reduced) repeat = setTimeout(replay, 2100);
        return;
      }
      if (heroReady) return finish();
    }
    frame = requestAnimationFrame(draw);
  }
  function replay() {
    if (done) return;
    cancelAnimationFrame(frame);
    clearTimeout(repeat);
    start = null;
    logo.setAttribute('mask', 'url(#ld-painted-regions)');
    for (const stroke of outlines) {
      stroke.path.style.strokeDashoffset = '1';
      stroke.path.style.opacity = '1';
    }
    for (const region of regions) region.path.style.opacity = '0';
    frame = requestAnimationFrame(draw);
  }
  function onKey(event) {
    if (event.key === 'Escape') finish();
    else if (preview && event.key.toLowerCase() === 'r') replay();
  }
  document.addEventListener('keydown', onKey);
  failSafe = setTimeout(() => {
    if (!preview || !asset.naturalWidth) finish();
  }, 5500);
  loader.dataset.initialized = 'true';
  asset.onload = replay;
  asset.onerror = finish;
  asset.src = logo.getAttribute('href');
  if (asset.complete) {
    asset.onload = null;
    if (asset.naturalWidth) replay();
    else finish();
  }
})();
