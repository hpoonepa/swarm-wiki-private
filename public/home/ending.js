/* Local, scroll-linked landing; links remain usable without JavaScript. */
(() => {
  const scene = document.querySelector('.ending-story');
  if (!scene) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px), (max-height: 600px)');
  let inView = false, frame = 0;
  function paint() {
    frame = 0;
    const progress = reduced.matches || mobile.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .75 - scene.getBoundingClientRect().top) / (innerHeight * .95)));
    const eased = progress * progress * (3 - 2 * progress);
    scene.style.setProperty('--ending-arrival', eased.toFixed(4));
  }
  function update() {
    if (inView && !frame) frame = requestAnimationFrame(paint);
  }
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) update();
  }, {rootMargin: '25% 0px'}).observe(scene);
  scene.querySelectorAll('[data-ending-approach]').forEach(link => {
    const activate = () => { scene.dataset.focus = link.dataset.endingApproach; };
    const clear = () => {
      const active = scene.querySelector('[data-ending-approach]:focus-visible') || scene.querySelector('[data-ending-approach]:hover');
      if (active) scene.dataset.focus = active.dataset.endingApproach;
      else delete scene.dataset.focus;
    };
    link.addEventListener('pointerenter', activate);
    link.addEventListener('focus', activate);
    link.addEventListener('pointerleave', clear);
    link.addEventListener('blur', clear);
  });
  addEventListener('scroll', update, {passive: true});
  addEventListener('resize', update, {passive: true});
  addEventListener('swarm-ready', update);
  reduced.addEventListener('change', paint);
  paint();
})();
