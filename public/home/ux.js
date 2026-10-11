/* Keep native scrolling; no automatic snapping or step bars. */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const go = y => scrollTo({ top: y, behavior: reduce.matches ? 'auto' : 'smooth' });
  const bar = document.querySelector('.progress'), cue = document.querySelector('.scroll-cue'), top = document.querySelector('.to-top');
  cue?.addEventListener('click', () => {
    const section = document.getElementById('statement');
    go(section.offsetTop + (section.offsetHeight - innerHeight) * .12);
  });
  top?.addEventListener('click', () => go(0));
  function paint() {
    const p = scrollY / Math.max(1, root.scrollHeight - innerHeight);
    if (bar) bar.style.transform = `scaleX(${p})`;
    cue?.classList.toggle('gone', scrollY > 40);
    top?.classList.toggle('show', p > .98);
  }
  addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint); paint();
})();
