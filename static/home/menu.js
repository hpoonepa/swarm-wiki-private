(function () {
  const btn = document.querySelector('.menu-btn'), panel = document.getElementById('menu-panel'), scrim = document.querySelector('.menu-scrim');
  const hero = document.querySelector('.hero'), root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...panel.querySelectorAll('a[data-go]')];
  panel.inert = true;
  function setOpen(open) {
    root.classList.toggle('menu-open', open); panel.inert = !open;
    btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) links[0].focus({ preventScroll: true });
  }
  btn.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')));
  scrim.addEventListener('click', () => setOpen(false));
  addEventListener('keydown', e => {
    if (!root.classList.contains('menu-open')) return;
    if (e.key === 'Escape') { setOpen(false); btn.focus({ preventScroll: true }); }
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === btn) { e.preventDefault(); links[links.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === links[links.length - 1]) { e.preventDefault(); btn.focus(); }
    }
  });
  const E = p => window.earthRaw ? window.earthRaw(p) : p;          // story progress -> scroll fraction (earth section has a hold for the years)
  const at = (id, p = 0) => { const el = document.getElementById(id); return el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * p; };
  const destinations = {
    top: () => 0, statement: () => at('statement', .12), earth: () => at('honeycomb-earth', E(.04)),
    usa: () => at('honeycomb-earth', E(.16)), atlanta: () => at('honeycomb-earth', E(.29)), flower: () => at('honeycomb-earth', E(.45)),
    bee: () => at('honeycomb-earth', E(.585)), minibinders: () => at('honeycomb-earth', E(.775)), 'rna-intro': () => at('rna-intro'), rnai: () => at('rnai', .02),
    together: () => at('together', .55), explore: () => at('explore')
  };
  function followHash() {
    const hash = location.hash.slice(1), key = hash === 'honeycomb-earth' ? 'earth' : hash;
    if (destinations[key]) scrollTo({ top: destinations[key](), behavior: 'instant' });
  }
  addEventListener('swarm-ready', followHash);
  addEventListener('hashchange', followHash);
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); setOpen(false); btn.focus({ preventScroll: true });
    scrollTo({ top: destinations[a.dataset.go](), behavior: reduce.matches ? 'auto' : 'smooth' });
  }));
  function paint() {
    const show = scrollY > hero.offsetHeight * .7;
    btn.classList.toggle('show', show); btn.tabIndex = show ? 0 : -1;
    if (!show) setOpen(false);
    let current = 'top';
    Object.keys(destinations).forEach(k => { if (scrollY + innerHeight * .25 >= destinations[k]()) current = k; });
    links.forEach(a => { a.classList.toggle('current', a.dataset.go === current); if (a.dataset.go === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  }
  addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint); paint();
})();
