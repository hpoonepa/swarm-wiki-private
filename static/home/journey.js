// One scroll coordinate drives Earth → flower → bee → capsid. All of the artwork
// lives in one pinned viewport, so a change in scale never changes the screen.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
const between = (p, a, b) => smooth((p - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
export const BINDER_START = .76;
export const journeyProgress = () => {
  const root = document.getElementById('honeycomb-earth');
  return clamp(-root.getBoundingClientRect().top / Math.max(1, root.offsetHeight - innerHeight));
};
export const binderProgress = () => clamp((journeyProgress() - BINDER_START) / (1 - BINDER_START));

export function initJourney() {
  const root = document.getElementById('honeycomb-earth');
  const map = root.querySelector('.map-view');
  const stats = root.querySelector('.geo-copy');
  const garden = root.querySelector('.pollinator-scene');
  const composition = root.querySelector('.flower-composition');
  const bee = root.querySelector('.journey-bee');
  const flowerCopy = root.querySelector('.journey-copy--flower');
  const beeCopy = root.querySelector('.journey-copy--bee');
  const protein = document.getElementById('minibinders');
  const proteinView = protein.querySelector('.protein-view');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let height = 1, compositionWidth = 1, compositionHeight = 1;
  let shown = journeyProgress(), frame = 0, previous = performance.now(), visible = false;
  let current = '';

  const setLayer = (element, opacity) => {
    element.style.opacity = opacity.toFixed(4);
    const hidden = opacity < .02;
    element.style.visibility = hidden ? 'hidden' : 'visible';
    element.setAttribute('aria-hidden', String(hidden));
    element.inert = hidden;
  };
  function paint(raw) {
    let p = raw;
    if (reduced.matches) p = p < .35 ? p : p < .49 ? .45 : p < .69 ? .58 : .83;
    const arriveFlower = between(p, .33, .44);
    const focusBee = between(p, .47, .60);
    const enterVirus = between(p, .62, .75);
    const flowerText = between(p, .405, .445) * (1 - between(p, .47, .51));
    const beeText = between(p, .52, .56) * (1 - between(p, .64, .69));
    const proteinIn = between(p, .69, .735);
    const modelIn = between(p, .66, .77);
    const stage = raw < .35 ? 'earth' : raw < .49 ? 'flower' : raw < .69 ? 'bee' : 'minibinders';
    if (stage !== current) { current = stage; root.dataset.journey = stage; }
    root.dataset.journeyProgress = raw.toFixed(3);

    // The globe camera now performs the geographic zoom. The flower emerges
    // at the same screen position as Atlanta, preserving the direction of travel.
    map.style.opacity = (1 - between(p, .355, .415)).toFixed(4);
    map.style.transform = 'none';
    map.style.visibility = p > .42 ? 'hidden' : 'visible';
    stats.style.setProperty('--stats-opacity', (1 - between(p, .315, .365)).toFixed(4));
    stats.inert = p > .355;
    stats.setAttribute('aria-hidden', String(p > .355));

    const artAlpha = between(p,.335,.395) * (1 - between(p, .675, .745));
    garden.style.opacity = artAlpha.toFixed(4);
    garden.style.visibility = artAlpha < .002 ? 'hidden' : 'visible';
    const zoom = mix(.08, 1, arriveFlower) * mix(1, 2.35, focusBee) * mix(1, 2.6, enterVirus);
    // Bee centroid in the flower's original 850 × 770 illustration coordinates.
    // Pan by its scaled offset, so it remains the camera's focal point on zoom.
    const offsetX = .235 * compositionWidth;
    const offsetY = -.265 * compositionHeight;
    const tx = -offsetX * zoom * focusBee;
    const mobile=innerWidth<=760;
    const originY=height*(mobile?-.02:-.11);
    const ty = -offsetY * zoom * focusBee - height * .12 * focusBee + originY * (1 - arriveFlower);
    composition.style.transform = `translate(-50%,-50%) translate3d(${tx}px,${ty}px,0) scale(${zoom})`;
    // The bee settles onto the flower before the camera follows it inward.
    const landing = between(p, .35, .46);
    bee.style.transform = reduced.matches ? 'none' : `translate3d(${(1 - landing) * compositionWidth * .13}px,${-(1 - landing) * compositionHeight * .2}px,0) rotate(${(1 - landing) * -13}deg)`;
    setLayer(flowerCopy, flowerText);
    setLayer(beeCopy, beeText);
    setLayer(protein, Math.max(proteinIn, modelIn));
    protein.querySelector('.mechanism-copy').style.opacity = proteinIn.toFixed(4);
    proteinView.style.transform = reduced.matches ? 'none' : `translate3d(0,${height * .14 * (1 - modelIn)}px,0) scale(${mix(.18, 1, modelIn)})`;
    // Labels appear after the molecular structure has arrived.
    protein.style.setProperty('--model-labels', between(p, .75, .79).toFixed(4));
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const goal = journeyProgress(), dt = Math.min(.05, (now - previous) / 1000); previous = now;
    shown = reduced.matches ? goal : shown + (goal - shown) * (1 - Math.exp(-dt * 10));
    if (Math.abs(goal - shown) < .0001) shown = goal;
    paint(shown);
    if (shown !== goal) frame = requestAnimationFrame(tick);
  }
  function kick() { if (!frame && visible && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
  function resize() {
    height = root.querySelector('.stage').clientHeight;
    compositionWidth = composition.offsetWidth; compositionHeight = composition.offsetHeight;
    paint(shown); kick();
  }
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { shown = journeyProgress(); kick(); } });
  visibility.observe(root.querySelector('.stage'));
  new ResizeObserver(resize).observe(root.querySelector('.stage'));
  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  reduced.addEventListener('change', () => { shown = journeyProgress(); resize(); });
  resize();
}
