/* One scroll position drives the honey stream and the droplet at its tip. */
(() => {
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => { const t = clamp(n); return t*t*t*(t*(6*t-15)+10); };
  const layer = document.querySelector('.honey-progress');
  const track = layer.querySelector('.honey-progress__track');
  const drop = layer.querySelector('.honey-progress__drop');
  const together = document.getElementById('together');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let maxScroll = 1, railX = 0, railTop = 0, railHeight = 1;
  let landingStart = 0, landingDistance = 1;
  let shown = 0, frame = 0, previous = performance.now(), lastPercent = -1;
  const progress = () => maxScroll > 0 ? clamp(scrollY / maxScroll) : 0;

  function paint(stretch = 1) {
    const y = railTop + 1 + (railHeight - 2) * shown;
    layer.style.setProperty('--page-progress', shown.toFixed(6));
    layer.dataset.visible = 'true';
    layer.dataset.progress = shown.toFixed(6);
    drop.style.transform = `translate3d(${railX}px,${y}px,0) translate(-50%,-70%)`;
    drop.style.setProperty('--drip-stretch', stretch.toFixed(3));
    const percent = Math.round(shown * 100);
    if (percent !== lastPercent) {
      track.setAttribute('aria-valuenow', String(percent));
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
    shown = reduced.matches ? goal : shown + (goal - shown) * (1 - Math.exp(-delta * 16));
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
    const togetherTop = together.getBoundingClientRect().top + scrollY;
    landingStart = togetherTop - height * .12;
    landingDistance = height * .5;
    shown = progress();
    paint();
    kick();
  }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', measure);
  addEventListener('swarm-ready', measure);
  addEventListener('load', measure);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) measure(); });
  reduced.addEventListener('change', measure);
  new ResizeObserver(measure).observe(document.body);
  measure();
})();
