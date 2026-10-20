import { initRnaTransition } from './rnai-transition.js?v=e187ac17a66b';
import { mountDwvScene } from './dwv-scene.js?v=abe1eff11c6d';

// Camera positions are measured in five viewport heights. Extending the journey
// does not change the timing of the original globe or its geographic zoom.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const t = clamp(n); return t * t * t * (t * (6 * t - 15) + 10); };
const between = (p, a, b) => smooth((p - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
export const BINDER_START = .76, BINDER_END = 1.08;
export const RNA_START = 1.85, RNA_END = 2.55;
const root = () => document.getElementById('honeycomb-earth');
export const journeyUnit = () => root().querySelector('.geo-stage').clientHeight * 5;
export const journeyProgress = () => window.earthScroll ? window.earthScroll().p : Math.max(0, -root().getBoundingClientRect().top / journeyUnit());
export const journeyScroll = p => root().getBoundingClientRect().top + scrollY + (window.earthOffset ? window.earthOffset(p) : journeyUnit() * p);
export const binderProgress = () => clamp((journeyProgress() - BINDER_START) / (BINDER_END - BINDER_START));
export const rnaProgress = () => clamp((journeyProgress() - RNA_START) / (RNA_END - RNA_START));
export const rnaScroll = p => journeyScroll(RNA_START + p * (RNA_END - RNA_START));

export function initJourney() {
  const section = root(), stage = section.querySelector('.geo-stage');
  const map = section.querySelector('.map-view'), stats = section.querySelector('.geo-copy');
  const hiveCopy = section.querySelector('.journey-copy--hive'), beeCopy = section.querySelector('.journey-copy--bee');
  const miteCopy = section.querySelector('.journey-copy--mite');
  const returnCopy = section.querySelector('.journey-copy--return');
  const protein = document.getElementById('minibinders');
  const rna = document.getElementById('rnai');
  const rnaIntro = document.getElementById('rna-intro'), rnaMechanism = rna.querySelector('.rna-layout');
  const rnaIntroCopy = rnaIntro.querySelector('.rna-discovery__copy');
  const rnaStage = rna.querySelector('.rna-stage'), rnaStory = rna.querySelector('.rna-player__story');
  const rnaTransition = initRnaTransition(rna);
  const virus = document.getElementById('dwv'), disease = section.querySelector('.dwv-story');
  const captions = [...section.querySelectorAll('[data-disease-beat]')];
  const comparison = section.querySelector('.bee-comparison');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dwv = mountDwvScene(comparison, view => {
    disease.dataset.beat = view.beat;
    for (const caption of captions) layer(caption, view.captions[caption.dataset.diseaseBeat]);
    comparison.style.opacity = view.opacity.toFixed(4);
    comparison.inert = view.opacity < .02;
    comparison.setAttribute('aria-hidden', String(view.opacity < .02));
  });
  let virusBase = 0;
  let width = 1, height = 1;
  const introBee = section.querySelector('.intro-bee'), introScene = section.querySelector('.intro-scene');
  const introMite = section.querySelector('.intro-mite');
  const introHive = section.querySelector('.intro-hive');
  // Each complete scene slides as one window, including its title and artwork.
  const overview = document.createElement('div');
  overview.className = 'journey-window journey-window--overview';
  introScene.before(overview);
  overview.append(introScene, hiveCopy, returnCopy);
  protein.classList.add('journey-window');
  rna.classList.add('journey-window');
  let titleMid = 0;
  let shown = journeyProgress(), shownDisease = window.earthScroll().disease, shownIntro = window.earthScroll().intro, frame = 0, previous = performance.now(), visible = false;
  function layer(element, opacity) {
    element.style.opacity = opacity.toFixed(4);
    const hidden = opacity < .025;
    element.style.visibility = hidden ? 'hidden' : 'visible';
    element.setAttribute('aria-hidden', String(hidden));
    element.inert = hidden;
    element.dataset.active = String(!hidden);
  }
  function paint(raw, diseaseProgress, introProgress) {
    let p = raw, d = diseaseProgress, i = introProgress;
    if (reduced.matches) d = d <= 0 ? 0 : d < .28 ? .22 : d < .50 ? .42 : d < .73 ? .66 : .96;
    if (reduced.matches) i = i > .02 ? 1 : 0;
    const mobile = width <= 760;
    const slideProgress = (start, end) => {
      const t = clamp((p-start)/(end-start));
      return t*t*(3-2*t);
    };
    const toBee = slideProgress(.50, .76), toMiddle = slideProgress(1.085, 1.26);
    const toMite = slideProgress(1.31, 1.53);
    const sceneName = raw < .325 ? diseaseProgress > .15 ? 'dwv' : 'earth'
      : toMite >= .5 ? raw < 1.82 ? 'rna-intro' : 'rnai'
      : toMiddle >= .5 ? 'cross-hive' : toBee >= .5 ? 'minibinders' : 'hive';
    section.dataset.journey = sceneName;
    section.dataset.journeyProgress = raw.toFixed(3);
    section.dataset.diseaseProgress = diseaseProgress.toFixed(3);
    // Warm the page as DWV gives way to SWARM, and keep that color beneath
    // every later scene so the camera never returns to a white background.
    const warmth = reduced.matches ? Number(raw >= .325) : between(raw, .30, .325);
    stage.style.setProperty('--swarm-warmth', warmth.toFixed(4));
    // Globe to virus reads as one camera pan: the globe glides up out of frame while
    // the capsid arcs up from its corner; the heading waits until the globe is gone.
    const riseT = clamp((d-.015)/.19), rise = smooth(riseT), riseY = smooth(Math.min(1, riseT*1.3));
    const compare = between(d, .29, .40), depart = between(p, .295, .325);
    const globeOut = between(d, .01, .19), globeFade = between(d, .06, .18);
    map.style.opacity = ((1 - between(p, .355, .415)) * (1-globeFade)).toFixed(4);
    map.style.visibility = p > .42 || globeFade > .999 ? 'hidden' : 'visible';
    map.style.transform = reduced.matches ? 'none' : `translate3d(0,${-height*.8*globeOut}px,0) scale(${1-.3*globeOut})`;
    stats.style.setProperty('--stats-opacity', ((1 - between(p, .315, .365))*(1-between(d,.02,.10))).toFixed(4));
    stats.inert = p > .355 || d > .10;
    stats.setAttribute('aria-hidden', String(stats.inert));
    // The capsid and bee share one focal point. The structure recedes before
    // the healthy bee arrives; the mite attaches before the wing change starts.
    const virusAlpha = between(p,.235,.238)*(1-between(d,.27,.36))*(1-between(p,.295,.31));
    virus.classList.toggle('on',p > .235 && p < .31 && virusAlpha > .002);
    const base = Math.min(height*.90, width*.72);
    const centerSize = Math.min(height*(mobile?.47:.60), width*(mobile?.9:.55));
    const vx = mix(-base*.12,width*.5,rise);
    const vy = mix(height+base*.12,height*(mobile?.64:.62),riseY);
    const size = mix(base,centerSize,rise)*(1-.12*between(d,.27,.36));
    if (base !== virusBase) { virusBase = base; virus.style.width = virus.style.height = `${base}px`; }   // resize only when it actually changes
    virus.style.transform = `translate3d(${vx-base/2}px,${vy-base/2}px,0) scale(${size/base})`;
    virus.style.opacity = virusAlpha.toFixed(4);
    const diseaseAlpha = between(d,.12,.21)*(1-depart);
    layer(disease, diseaseAlpha);
    dwv.update(d, compare, compare > .002 && diseaseAlpha > .002, window.earthScroll().disease);
    document.body.classList.toggle('dwv-focus',p > .225 && p < .54);

    // Read the complete title first, then lift it before revealing the two approaches.
    const word = between(i, 0, .075), lift = between(i, .42, .70);
    const popT = clamp((i - .60) / .25), pop = smooth(popT);
    // The bee window enters from the left. Return to the centered hive and
    // pause there before the mite window enters from the right.
    function slide(element, offset, active) {
      const shown = reduced.matches ? active : p >= .325 && Math.abs(offset) < 1;
      layer(element, Number(shown));
      element.style.clipPath = 'none';
      element.style.transform = reduced.matches || Math.abs(offset) < .00001 ? 'none'
        : `translate3d(${(offset * width).toFixed(3)}px,0,0)`;
      element.inert = !shown || (!reduced.matches && Math.abs(offset) > .015);
    }
    const returning = toMiddle > 0;
    const overviewActive = p >= .325 && (toBee < .5 || (toMiddle >= .5 && toMite < .5));
    const binderActive = toBee >= .5 && toMiddle < .5;
    const rnaActive = toMite >= .5;
    const hiveOffset = toMite > 0 ? -toMite : toMiddle > 0 ? 1-toMiddle : toBee;
    slide(overview, hiveOffset, overviewActive);
    slide(protein, toMiddle > 0 ? -toMiddle : toBee-1, binderActive);
    slide(rna, 1-toMite, rnaActive);
    const rnaVisible = rna.dataset.active === 'true';
    introScene.style.transform = 'none';
    introScene.style.opacity = '1';
    introScene.style.setProperty('--overview-labels', (returning ? 1 : between(i,.80,.94)).toFixed(4));
    layer(hiveCopy, returning ? 0 : word);
    hiveCopy.style.setProperty('--subtitle', between(i,.07,.16).toFixed(4));
    hiveCopy.style.transform = reduced.matches ? 'none' : `translate3d(0,${((height * .47 - titleMid) * (1 - lift)).toFixed(1)}px,0)`;
    introHive.style.setProperty('--rise', returning ? '1' : pop.toFixed(4));
    introHive.style.setProperty('--leave', '0');
    introHive.style.opacity = (returning ? 1 : pop).toFixed(4);
    introHive.style.visibility = returning || popT > .001 ? 'visible' : 'hidden';
    layer(introMite, returning ? 1 : between(i, .74, .91));
    const fly = returning ? 1 : between(i, .70, .88);
    introBee.style.setProperty('--fly', fly.toFixed(4));
    introBee.style.setProperty('--leave', '0');
    introBee.style.visibility = fly < .001 ? 'hidden' : 'visible';
    layer(returnCopy, Number(returning));
    layer(beeCopy, 0);
    layer(miteCopy, 0);
    protein.querySelector('.protein-view').style.transform = 'none';
    protein.style.setProperty('--model-labels', '1');
    // The original middle helix uncoils into the first RNA strand. All movement
    // follows the same reversible scroll playhead, including the text handoff.
    const rnaHandoff = reduced.matches ? Number(p >= RNA_START) : clamp((p - 1.68) / (RNA_START - 1.68));
    rna.style.setProperty('--rna-handoff', rnaHandoff.toFixed(4));
    rna.style.setProperty('--rna-transition', rnaHandoff.toFixed(4));
    rna.style.setProperty('--rna-arrival', between(p, 1.46, 1.58).toFixed(4));
    rnaTransition.setProgress(rnaHandoff);
    layer(rnaIntro, 1-between(rnaHandoff, .90, 1));
    layer(rnaIntroCopy, 1-between(rnaHandoff, .10, .27));
    layer(rnaMechanism, between(rnaHandoff, .60, .68));
    layer(rnaStage, between(rnaHandoff, .86, 1));
    layer(rnaStory, between(rnaHandoff, .68, .91));
    rnaIntro.inert = rnaHandoff >= .5 || !rnaVisible;
    rnaIntro.setAttribute('aria-hidden', String(rnaIntro.inert));
    rnaMechanism.inert = rnaHandoff < .5 || !rnaVisible;
    rnaMechanism.setAttribute('aria-hidden', String(rnaMechanism.inert));
    rna.style.setProperty('--subject-enter', '1');
    rna.querySelector('.rna-stage').style.transform = 'none';
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const goal = journeyProgress(), diseaseGoal = window.earthScroll().disease, introGoal = window.earthScroll().intro, dt = Math.min(.05, (now - previous) / 1000); previous = now;
    const response = goal >= .325 ? 9 : 6;
    shown = reduced.matches ? goal : shown + (goal - shown) * (1 - Math.exp(-dt * response));
    shownDisease = reduced.matches ? diseaseGoal : shownDisease + (diseaseGoal-shownDisease)*(1-Math.exp(-dt*4));   // DWV section glides rather than steps
    if (Math.abs(goal - shown) < .0001) shown = goal;
    shownIntro = reduced.matches ? introGoal : shownIntro + (introGoal-shownIntro)*(1-Math.exp(-dt*7));
    if (Math.abs(diseaseGoal-shownDisease)<.0001) shownDisease=diseaseGoal;
    if (Math.abs(introGoal-shownIntro)<.0001) shownIntro=introGoal;
    paint(shown,shownDisease,shownIntro);
    if (shown !== goal || shownDisease !== diseaseGoal || shownIntro !== introGoal) frame = requestAnimationFrame(tick);
  }
  function kick() { if (!frame && visible && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
  function resize() {
    height = stage.clientHeight; width = stage.clientWidth;
    rnaTransition.resize();
    titleMid = hiveCopy.offsetTop + hiveCopy.offsetHeight / 2;
    paint(shown,shownDisease,shownIntro); kick();
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { shown = journeyProgress(); shownDisease=window.earthScroll().disease; shownIntro=window.earthScroll().intro; kick(); }
    else { protein.dataset.active = rna.dataset.active = 'false'; }
  }).observe(stage);
  new ResizeObserver(resize).observe(stage);
  introHive.addEventListener('load', resize);
  introMite.addEventListener('load', resize);
  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  reduced.addEventListener('change', () => { shown = journeyProgress(); resize(); });
  resize();
}
