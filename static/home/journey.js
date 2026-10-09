// Camera positions are measured in ten viewport heights. Extending the journey
// does not change the timing of the original globe or its geographic zoom.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const t = clamp(n); return t * t * t * (t * (6 * t - 15) + 10); };
const between = (p, a, b) => smooth((p - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
export const BINDER_START = .76, BINDER_END = 1.08;
export const RNA_START = 1.53, RNA_END = 2.05;
const root = () => document.getElementById('honeycomb-earth');
export const journeyUnit = () => root().querySelector('.geo-stage').clientHeight * 10;
export const journeyProgress = () => window.earthScroll ? window.earthScroll().p : Math.max(0, -root().getBoundingClientRect().top / journeyUnit());
export const journeyScroll = p => root().getBoundingClientRect().top + scrollY + (window.earthOffset ? window.earthOffset(p) : journeyUnit() * p);
export const binderProgress = () => clamp((journeyProgress() - BINDER_START) / (BINDER_END - BINDER_START));
export const rnaProgress = () => clamp((journeyProgress() - RNA_START) / (RNA_END - RNA_START));
export const rnaScroll = p => journeyScroll(RNA_START + p * (RNA_END - RNA_START));

export function initJourney() {
  const section = root(), stage = section.querySelector('.geo-stage');
  const map = section.querySelector('.map-view'), stats = section.querySelector('.geo-copy');
  const garden = section.querySelector('.pollinator-scene'), composition = section.querySelector('.hive-composition');
  const bee = section.querySelector('.journey-bee'), mite = section.querySelector('.journey-mite');
  const hiveCopy = section.querySelector('.journey-copy--hive'), beeCopy = section.querySelector('.journey-copy--bee');
  const miteCopy = section.querySelector('.journey-copy--mite'), rnaCopy = section.querySelector('.journey-copy--rna');
  const protein = document.getElementById('minibinders'), proteinView = protein.querySelector('.protein-view');
  const proteinCopy = protein.querySelector('.mechanism-copy');
  const rna = document.getElementById('rnai');
  const virus = document.getElementById('dwv'), disease = section.querySelector('.dwv-story');
  const comparison = section.querySelector('.bee-comparison');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, cw = 1, ch = 1, cx = 0, cy = 0, beeX = 0, beeY = 0, miteX = 0, miteY = 0;
  let shown = journeyProgress(), shownDisease = window.earthScroll().disease, frame = 0, previous = performance.now(), visible = false;
  function layer(element, opacity) {
    element.style.opacity = opacity.toFixed(4);
    const hidden = opacity < .025;
    element.style.visibility = hidden ? 'hidden' : 'visible';
    element.setAttribute('aria-hidden', String(hidden));
    element.inert = hidden;
  }
  function paint(raw, diseaseProgress) {
    let p = raw, d = diseaseProgress;
    if (reduced.matches) p = raw < .35 ? raw : raw < .49 ? .46 : raw < .69 ? .59 : raw < 1.105 ? .90 : raw < 1.30 ? 1.245 : raw < 1.49 ? 1.38 : 1.56;
    if (reduced.matches) d = d < .20 ? 0 : d < .60 ? .44 : .85;
    const mobile = width <= 760;
    const arrive = between(p, .345, .435), focus = between(p, .49, .615), enter = between(p, .655, .75);
    const returning = between(p, 1.13, 1.265), towardMite = between(p, 1.30, 1.43);
    const intoRNA = between(p, 1.455, 1.53);
    const modelIn = between(p, .69, .76), modelOut = between(p, 1.085, 1.17);
    const sceneName = raw < .35 ? diseaseProgress > .15 ? 'dwv' : 'earth' : raw < .49 ? 'hive' : raw < .69 ? 'bee' : raw < 1.085 ? 'minibinders' : raw < 1.285 ? 'return-hive' : raw < 1.49 ? 'mite' : 'rnai';
    section.dataset.journey = sceneName;
    section.dataset.journeyProgress = raw.toFixed(3);
    section.dataset.diseaseProgress = diseaseProgress.toFixed(3);
    const rise = between(d, .08, .38), compare = between(d, .58, .78), depart = between(p, .295, .325);
    const globeOut = between(d, .10, .34);
    map.style.opacity = ((1 - between(p, .355, .415)) * (1-globeOut)).toFixed(4);
    map.style.visibility = p > .42 || globeOut > .999 ? 'hidden' : 'visible';
    map.style.transform = reduced.matches ? 'none' : `translate3d(0,${-height*.24*globeOut}px,0) scale(${1-.15*globeOut})`;
    stats.style.setProperty('--stats-opacity', ((1 - between(p, .315, .365))*(1-between(d,.08,.23))).toFixed(4));
    stats.inert = p > .355 || d > .23;
    stats.setAttribute('aria-hidden', String(stats.inert));
    // The capsid fades at full size and stays gone after the wing comparison.
    const fadeVirus = between(d,.45,.57);
    const virusAlpha = between(p,.235,.26)*(1-fadeVirus)*(1-between(p,.295,.31));
    virus.classList.toggle('on',p > .235 && p < .31 && virusAlpha > .002);
    const base = Math.min(height*.90, width*.72);
    const centerSize = Math.min(height*.68, width*(mobile?.88:.58));
    const vx = mix(-base*.12,width*.5,rise);
    const vy = mix(height+base*.12,height*(mobile?.49:.53),rise);
    const size = mix(base,centerSize,rise);
    virus.style.width = virus.style.height = `${base}px`;
    virus.style.transform = `translate3d(${vx-base/2}px,${vy-base/2}px,0) scale(${size/base})`;
    virus.style.opacity = virusAlpha.toFixed(4);
    layer(disease, between(d,.22,.38)*(1-depart));
    comparison.style.opacity = compare.toFixed(4);
    comparison.style.setProperty('--compare',compare.toFixed(4));
    comparison.inert = compare < .02;
    comparison.setAttribute('aria-hidden',String(compare < .02));
    document.body.classList.toggle('dwv-focus',p > .225 && p < .54);

    const beeFocus = focus * (1 - returning);
    const targetX = width * (mobile ? .50 : .70) - cx;
    const targetY = height * (mobile ? .71 : .48) - cy;
    // Interpolate the subject's screen position separately from magnification.
    // Its body arrives at the same focal point in both directions, without drifting.
    const beeZoom = Math.exp(Math.log(2.9) * beeFocus + Math.log(1.16) * enter * (1-returning));
    const zoom = mix(.68, 1, arrive) * beeZoom * Math.exp(Math.log(4.5) * towardMite);
    const focusX = towardMite > 0 ? miteX : beeX;
    const focusY = towardMite > 0 ? miteY : beeY;
    const focusAmount = towardMite > 0 ? towardMite : beeFocus;
    const tx = mix(focusX, targetX, focusAmount) - focusX * zoom;
    const ty = mix(focusY, targetY, focusAmount) - focusY * zoom + height * .06 * (1-arrive);
    composition.style.transform = `translate(-50%,-50%) translate3d(${tx}px,${ty}px,0) scale(${zoom})`;
    const firstHive = between(p, .315, .355) * (1 - between(p, .725, .76));
    const returnHive = between(p, 1.085, 1.135) * (1 - between(p, 1.50, 1.53));
    const artAlpha = Math.max(firstHive,returnHive);
    garden.style.opacity = artAlpha.toFixed(4);
    garden.style.visibility = artAlpha < .002 ? 'hidden' : 'visible';
    // The bee stays on the entrance board while the camera approaches it.
    bee.style.transform = 'none';
    composition.style.setProperty('--mite-label', (1 - between(p, 1.30, 1.345)) * (1 - focus * (1-returning)));
    layer(hiveCopy, between(p, .325, .355) * (1 - between(p, .485, .535)));
    layer(beeCopy, between(p, .55, .59) * (1 - between(p, .66, .705)));
    layer(miteCopy, between(p, 1.195, 1.245) * (1 - between(p, 1.31, 1.35)));
    layer(rnaCopy, between(p, 1.355, 1.39) * (1 - between(p, 1.46, 1.50)));
    const portal = modelIn * (1-modelOut);
    const focalX = mobile ? 50 : 70, focalY = mobile ? 71 : 48;
    const radius = Math.hypot(width, height);
    layer(protein, clamp(portal * 8));
    protein.style.clipPath = reduced.matches ? 'none' : `circle(${radius * portal}px at ${focalX}% ${focalY}%)`;
    proteinCopy.style.opacity = (between(p, .73, .76) * (1-between(p, 1.085, 1.115))).toFixed(4);
    proteinView.style.transform = reduced.matches ? 'none' : `scale(${mix(.86, 1, portal)})`;
    protein.style.setProperty('--model-labels', between(p, .75, .79).toFixed(4));
    layer(rna, clamp(intoRNA * 8));
    rna.style.clipPath = reduced.matches ? 'none' : `circle(${radius * intoRNA}px at ${focalX}% ${focalY}%)`;
    rna.querySelector('.mechanism-copy').style.opacity = between(p, 1.48, 1.53).toFixed(4);
    rna.querySelector('.rna-player__copy').style.opacity = between(p, 1.49, 1.53).toFixed(4);
    rna.querySelector('.rna-player__controls').style.opacity = between(p, 1.49, 1.53).toFixed(4);
    rna.querySelector('.rna-stage').style.transform = reduced.matches ? 'none' : `translate3d(${width * (mobile ? 0 : .07) * (1-intoRNA)}px,${height * .03 * (1-intoRNA)}px,0) scale(${mix(.88, 1, intoRNA)})`;
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const goal = journeyProgress(), diseaseGoal = window.earthScroll().disease, dt = Math.min(.05, (now - previous) / 1000); previous = now;
    shown = reduced.matches ? goal : shown + (goal - shown) * (1 - Math.exp(-dt * 10));
    shownDisease = reduced.matches ? diseaseGoal : shownDisease + (diseaseGoal-shownDisease)*(1-Math.exp(-dt*10));
    if (Math.abs(goal - shown) < .0001) shown = goal;
    if (Math.abs(diseaseGoal-shownDisease)<.0001) shownDisease=diseaseGoal;
    paint(shown,shownDisease);
    if (shown !== goal || shownDisease !== diseaseGoal) frame = requestAnimationFrame(tick);
  }
  function kick() { if (!frame && visible && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
  function resize() {
    height = stage.clientHeight; width = stage.clientWidth;
    cw = composition.offsetWidth; ch = composition.offsetHeight;
    cx = composition.offsetLeft; cy = composition.offsetTop;
    beeX = bee.offsetLeft + bee.offsetWidth * .60 - cw / 2;
    beeY = bee.offsetTop + bee.offsetHeight * .51 - ch / 2;
    miteX = mite.offsetLeft + mite.offsetWidth * .50 - cw / 2;
    miteY = mite.offsetTop + mite.offsetHeight * .50 - ch / 2;
    paint(shown,shownDisease); kick();
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { shown = journeyProgress(); shownDisease=window.earthScroll().disease; kick(); } }).observe(stage);
  new ResizeObserver(resize).observe(stage);
  for (const image of [bee, mite]) image.addEventListener('load', resize);
  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  reduced.addEventListener('change', () => { shown = journeyProgress(); resize(); });
  resize();
}
