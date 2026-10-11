/* One scroll position drives the honey stream and the droplet at its tip. */
(() => {
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => { const t = clamp(n); return t*t*t*(t*(6*t-15)+10); };
  const layer = document.querySelector('.honey-progress');
  const track = layer.querySelector('.honey-progress__track');
  const control = layer.querySelector('.honey-progress__control');
  const drop = layer.querySelector('.honey-progress__drop');
  const together = document.getElementById('together');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let maxScroll = 1, railX = 0, railTop = 0, railHeight = 1;
  let landingStart = 0, landingDistance = 1;
  let shown = 0, frame = 0, previous = performance.now(), lastPercent = -1;
  let dragging = false, activePointer = null, grabOffset = 0;
  const progress = () => maxScroll > 0 ? clamp(scrollY / maxScroll) : 0;

  function syncVisibility() {
    const visible = dragging || scrollY > 80;
    layer.dataset.visible = String(visible);
    layer.inert = !visible;
    if (!visible && document.activeElement === control) {
      const nav = document.querySelector('swarm-nav[story]')?.shadowRoot;
      nav?.querySelector(innerWidth <= 1100 ? '.mobile-toggle' : '.bar summary')?.focus({preventScroll:true});
    }
  }

  function paint(stretch = 1) {
    const y = railTop + 1 + (railHeight - 2) * shown;
    layer.style.setProperty('--page-progress', shown.toFixed(6));
    syncVisibility();
    layer.dataset.progress = shown.toFixed(6);
    drop.style.transform = `translate3d(${railX}px,${y}px,0) translate(-50%,-70%)`;
    drop.style.setProperty('--drip-stretch', stretch.toFixed(3));
    const percent = Math.round(shown * 100);
    if (percent !== lastPercent) {
      control.setAttribute('aria-valuenow', String(percent));
      control.setAttribute('aria-valuetext', `${percent}% through the homepage`);
      lastPercent = percent;
    }
    // The flower scene has its own bee; the marker continues to the footer.
    const arrival = reduced.matches ? 1 : ease((scrollY - landingStart) / landingDistance);
    together.dataset.arrived = String(arrival > 0);
    together.style.setProperty('--bee-arrival', arrival.toFixed(4));
  }

  function tick(now) {
    frame = 0;
    if (document.hidden) return;
    const goal = progress(), delta = Math.min(.05, (now - previous) / 1000);
    previous = now;
    shown = reduced.matches || dragging ? goal : shown + (goal - shown) * (1 - Math.exp(-delta * 16));
    if (Math.abs(goal - shown) < .00001) shown = goal;
    const moving = shown !== goal;
    paint(reduced.matches ? 1 : 1 + Math.min(.14, Math.abs(goal-shown)*1.6));
    if (moving) frame = requestAnimationFrame(tick);
  }
  function kick() {
    if (frame || document.hidden) return;
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }
  function measure() {
    const width = document.documentElement.clientWidth, height = innerHeight, mobile = width <= 760;
    maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
    railX = width - (mobile ? 34 : 46);
    railTop = mobile ? 80 : 96;
    railHeight = Math.max(40, height - railTop - (mobile ? 32 : 44));
    track.style.height = `${railHeight}px`;
    track.style.transform = `translate3d(${railX}px,${railTop}px,0) translateX(-50%)`;
    control.style.height = `${railHeight + 24}px`;
    control.style.transform = `translate3d(${railX}px,${railTop - 12}px,0) translateX(-50%)`;
    const togetherTop = together.getBoundingClientRect().top + scrollY;
    landingStart = togetherTop - height * .12;
    landingDistance = height * .5;
    shown = progress();
    paint();
    kick();
  }
  function seek(value) {
    shown = clamp(value);
    scrollTo({top: shown * maxScroll, behavior: 'instant'});
    paint();
  }
  function scrub(event) {
    seek((event.clientY - grabOffset - railTop - 1) / (railHeight - 2));
  }
  control.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    dispatchEvent(new CustomEvent('swarm-scrub-start'));
    dragging = true;
    activePointer = event.pointerId;
    const tip = railTop + 1 + (railHeight - 2) * shown;
    grabOffset = Math.abs(event.clientY - tip) < 24 ? event.clientY - tip : 0;
    layer.dataset.dragging = 'true';
    document.documentElement.classList.add('honey-scrubbing');
    control.setPointerCapture(event.pointerId);
    control.focus({preventScroll:true});
    scrub(event);
  });
  control.addEventListener('pointermove', event => {
    if (dragging && event.pointerId === activePointer) scrub(event);
  });
  function release(event) {
    if (!dragging || event.pointerId !== activePointer) return;
    dragging = false;
    activePointer = null;
    layer.dataset.dragging = 'false';
    document.documentElement.classList.remove('honey-scrubbing');
    if (control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
    syncVisibility();
  }
  control.addEventListener('pointerup', release);
  control.addEventListener('pointercancel', release);
  control.addEventListener('lostpointercapture', release);
  control.addEventListener('keydown', event => {
    const steps = {ArrowDown:.02,ArrowRight:.02,ArrowUp:-.02,ArrowLeft:-.02,PageDown:.1,PageUp:-.1};
    if (!(event.key in steps) && !['Home','End'].includes(event.key)) return;
    event.preventDefault();
    dispatchEvent(new CustomEvent('swarm-scrub-start'));
    seek(event.key === 'Home' ? 0 : event.key === 'End' ? 1 : progress() + steps[event.key]);
  });
  addEventListener('swarm-nav-state', syncVisibility);
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', measure);
  addEventListener('swarm-ready', measure);
  addEventListener('load', measure);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) measure(); });
  reduced.addEventListener('change', measure);
  new ResizeObserver(measure).observe(document.body);
  measure();
})();
