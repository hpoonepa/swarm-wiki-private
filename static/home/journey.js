// Camera positions are measured in ten viewport heights. Extending the journey
// does not change the timing of the original globe or its geographic zoom.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const t = clamp(n); return t * t * t * (t * (6 * t - 15) + 10); };
const between = (p, a, b) => smooth((p - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
export const BINDER_START = .76, BINDER_END = 1.08;
export const RNA_START = 1.85, RNA_END = 2.37;
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
  const artwork = section.querySelector('.journey-art');
  const hiveCopy = section.querySelector('.journey-copy--hive'), beeCopy = section.querySelector('.journey-copy--bee');
  const miteCopy = section.querySelector('.journey-copy--mite');
  const protein = document.getElementById('minibinders'), proteinView = protein.querySelector('.protein-view');
  const proteinCopy = protein.querySelector('.mechanism-copy');
  const rna = document.getElementById('rnai');
  const rnaIntro = document.getElementById('rna-intro'), rnaMechanism = rna.querySelector('.rna-layout');
  const virus = document.getElementById('dwv'), disease = section.querySelector('.dwv-story');
  const comparison = section.querySelector('.bee-comparison');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // DWV wings: each outline is sampled once, then shrunk toward its hinge,
  // curled down and creased as the infection gets more severe.
  const stageText = ['Healthy wings', 'Wings start to crumple', 'Deformed wings'];
  const stageTitle = comparison.querySelector('.dwv-bee__stage');
  const wings = [...comparison.querySelectorAll('.dwv-wing')].map(path => {
    const [hx, hy] = path.dataset.hinge.split(',').map(Number), total = path.getTotalLength(), n = 180;
    const pts = Array.from({length: n}, (_, i) => { const q = path.getPointAtLength(total * i / n); return [q.x - hx, q.y - hy]; });
    const reach = Math.max(...pts.map(([x, y]) => Math.hypot(x, y)));
    return { path, hx, hy, pts, reach, side: hx > 343 ? 1 : -1 };
  });
  let shownSev = -1, shownStage = -1;
  let virusBase = 0;
  function shrivel(sev) {
    if (Math.abs(sev - shownSev) < .0005) return;
    shownSev = sev;
    for (const w of wings) {
      let d = '';
      w.pts.forEach(([x, y], i) => {
        const u = i / w.pts.length, r = Math.hypot(x, y) / w.reach;
        const crease = sev * r * (.13 * Math.sin(u * 6.283 * 4 + 1.3 * w.side) + .07 * Math.sin(u * 6.283 * 9 + .4));
        const k = (1 - .62 * sev * Math.pow(r, .7)) * (1 + crease);
        const a = w.side * sev * .55 * r;                                   // the tip curls down toward the body
        const sx = x * k, sy = y * k * (1 - .25 * sev);
        d += (i ? 'L' : 'M') + (w.hx + sx * Math.cos(a) - sy * Math.sin(a)).toFixed(1) + ' ' + (w.hy + sx * Math.sin(a) + sy * Math.cos(a)).toFixed(1);
      });
      w.path.setAttribute('d', d + 'Z');
    }
    comparison.style.setProperty('--sev', sev.toFixed(4));
    const stage = sev < .3 ? 0 : sev < .72 ? 1 : 2;
    if (stage !== shownStage) {
      shownStage = stage; stageTitle.textContent = stageText[stage];
      if (!reduced.matches) stageTitle.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }
  let width = 1, height = 1, cw = 1, ch = 1, cx = 0, cy = 0, beeX = 0, beeY = 0, miteX = 0, miteY = 0;
  const introBee = section.querySelector('.intro-bee'), introScene = section.querySelector('.intro-scene');
  let beeAnchorX = 0, beeAnchorY = 0;
  const introHive = section.querySelector('.intro-hive'), introTitle = hiveCopy.querySelector('h2');
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
    if (reduced.matches) p = raw < .35 ? raw : raw < .49 ? .46 : raw < .69 ? .59 : raw < 1.105 ? .90 : raw < 1.30 ? 1.245 : raw < 1.49 ? 1.38 : raw < 1.82 ? 1.67 : 1.86;
    if (reduced.matches) d = d < .20 ? 0 : d < .60 ? .44 : .85;
    if (reduced.matches) i = i > .02 ? 1 : 0;
    const mobile = width <= 760;
    const arrive = between(p, .345, .435), focus = between(p, .49, .615), enter = between(p, .655, .75);
    const returning = between(p, 1.13, 1.265), towardMite = between(p, 1.30, 1.43);
    const intoRNA = between(p, 1.455, 1.53);
    const modelIn = between(p, .69, .76), modelOut = between(p, 1.085, 1.17);
    const sceneName = raw < .325 ? diseaseProgress > .15 ? 'dwv' : 'earth' : raw < .49 ? 'hive' : raw < .69 ? 'bee' : raw < 1.085 ? 'minibinders' : raw < 1.285 ? 'return-hive' : raw < 1.49 ? 'mite' : raw < 1.82 ? 'rna-intro' : 'rnai';
    section.dataset.journey = sceneName;
    section.dataset.journeyProgress = raw.toFixed(3);
    section.dataset.diseaseProgress = diseaseProgress.toFixed(3);
    // Globe to virus reads as one camera pan: the globe glides up out of frame while
    // the capsid arcs up from its corner; the heading waits until the globe is gone.
    const riseT = clamp((d-.04)/.38), rise = smooth(riseT), riseY = smooth(Math.min(1, riseT*1.3));
    const compare = between(d, .46, .58), depart = between(p, .295, .325);
    const globeOut = between(d, .04, .40), globeFade = between(d, .16, .38);
    map.style.opacity = ((1 - between(p, .355, .415)) * (1-globeFade)).toFixed(4);
    map.style.visibility = p > .42 || globeFade > .999 ? 'hidden' : 'visible';
    map.style.transform = reduced.matches ? 'none' : `translate3d(0,${-height*.8*globeOut}px,0) scale(${1-.3*globeOut})`;
    stats.style.setProperty('--stats-opacity', ((1 - between(p, .315, .365))*(1-between(d,.02,.10))).toFixed(4));
    stats.inert = p > .355 || d > .10;
    stats.setAttribute('aria-hidden', String(stats.inert));
    // The capsid steps aside to the right while the bee shows what it does.
    const aside = between(d,.44,.58);
    const virusAlpha = between(p,.235,.238)*(1-between(p,.295,.31));
    virus.classList.toggle('on',p > .235 && p < .31 && virusAlpha > .002);
    const base = Math.min(height*.90, width*.72);
    const centerSize = Math.min(height*.68, width*(mobile?.88:.58));
    const sideSize = mobile ? width*.5 : centerSize;                        // same size as in the centre
    comparison.style.setProperty('--bee', `${Math.round(sideSize*.79)}px`);  // bee wingspan matches the capsid's drawn width
    const vx = mix(mix(-base*.12,width*.5,rise), width*(mobile?.8:.72), aside);
    const vy = mix(mix(height+base*.12,height*(mobile?.49:.53),riseY), height*(mobile?.6:.53), aside);
    const size = mix(mix(base,centerSize,rise), sideSize, aside);
    if (base !== virusBase) { virusBase = base; virus.style.width = virus.style.height = `${base}px`; }   // resize only when it actually changes
    virus.style.transform = `translate3d(${vx-base/2}px,${vy-base/2}px,0) scale(${size/base})`;
    virus.style.opacity = virusAlpha.toFixed(4);
    layer(disease, between(d,.33,.46)*(1-depart));
    comparison.style.opacity = compare.toFixed(4);
    shrivel(between(d,.6,.95));
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
    const zoom = mix(.94, 1, arrive) * beeZoom * Math.exp(Math.log(4.5) * towardMite);
    const focusX = towardMite > 0 ? miteX : beeX;
    const focusY = towardMite > 0 ? miteY : beeY;
    const focusAmount = towardMite > 0 ? towardMite : beeFocus;
    const tx = mix(focusX, targetX, focusAmount) - focusX * zoom;
    const ty = mix(focusY, targetY, focusAmount) - focusY * zoom + height * .015 * (1-arrive);
    composition.style.transform = `translate(-50%,-50%) translate3d(${tx}px,${ty}px,0) scale(${zoom})`;
    const returnHive = between(p, 1.085, 1.135) * (1 - between(p, 1.50, 1.53));
    const artAlpha = returnHive;                                             // the first visit now zooms into the team's bee instead
    garden.style.opacity = artAlpha.toFixed(4);
    garden.style.visibility = artAlpha < .002 ? 'hidden' : 'visible';
    garden.style.setProperty('--subject-focus', Math.max(beeFocus, towardMite).toFixed(4));
    // SWARM introduction (its own scroll pause): the word alone in the middle, the logo
    // grows in beside it, then the hive pops up from below and lifts the title to the top.
    const word = between(i, 0, .1), logo = between(i, .2, .45), lift = between(i, .55, .85);
    const popT = clamp((i - .55) / .32), pop = smooth(popT);
    // After the pause the camera pushes in on the bee: the hive and title fall away and the
    // bee ends on the focal point, where the Minibinders scene opens out of it.
    const zoomIn = between(p, .345, .61), sceneOut = between(p, .725, .76), leave = between(p, .36, .5);
    const beeZ = reduced.matches ? 1 : Math.exp(Math.log(mobile ? 3.2 : 4.2) * zoomIn + Math.log(1.25) * enter);
    const beeTX = mix(beeAnchorX, width * (mobile ? .5 : .7), zoomIn) - beeAnchorX * beeZ;
    const beeTY = mix(beeAnchorY, height * (mobile ? .71 : .48), zoomIn) - beeAnchorY * beeZ;
    introScene.style.transform = reduced.matches ? 'none' : `translate3d(${beeTX.toFixed(1)}px,${beeTY.toFixed(1)}px,0) scale(${beeZ.toFixed(4)})`;
    layer(hiveCopy, word * (1 - between(p, .335, .38)));
    hiveCopy.style.setProperty('--logo', logo.toFixed(4));
    introTitle.style.transform = reduced.matches ? 'none' : `translate3d(0,${((height / 2 - titleMid) * (1 - lift)).toFixed(1)}px,0) scale(${mix(mix(mobile ? 1.9 : 2.3, mobile ? 1.12 : 1.6, logo), 1, lift).toFixed(4)})`;
    introHive.style.setProperty('--rise', pop.toFixed(4));
    introHive.style.setProperty('--leave', leave.toFixed(4));
    introHive.style.visibility = popT < .001 || leave > .999 ? 'hidden' : 'visible';
    const fly = between(i, .8, .97);
    introBee.style.setProperty('--fly', fly.toFixed(4));
    introBee.style.setProperty('--leave', sceneOut.toFixed(4));
    introBee.style.visibility = fly < .001 || sceneOut > .999 ? 'hidden' : 'visible';
    layer(beeCopy, between(p, .515, .555) * (1 - between(p, .69, .735)));
    layer(miteCopy, between(p, 1.285, 1.325) * (1 - between(p, 1.46, 1.515)));
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
    layer(rnaIntro, between(p, 1.54, 1.59) * (1-between(p, 1.77, 1.83)));
    layer(rnaMechanism, between(p, 1.81, 1.85));
    rna.querySelector('.rna-stage').style.transform = reduced.matches ? 'none' : `translate3d(${width * (mobile ? 0 : .07) * (1-intoRNA)}px,${height * .03 * (1-intoRNA)}px,0) scale(${mix(.88, 1, intoRNA)})`;
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const goal = journeyProgress(), diseaseGoal = window.earthScroll().disease, introGoal = window.earthScroll().intro, dt = Math.min(.05, (now - previous) / 1000); previous = now;
    shown = reduced.matches ? goal : shown + (goal - shown) * (1 - Math.exp(-dt * 6));
    shownDisease = reduced.matches ? diseaseGoal : shownDisease + (diseaseGoal-shownDisease)*(1-Math.exp(-dt*4));   // DWV section glides rather than steps
    if (Math.abs(goal - shown) < .0001) shown = goal;
    shownIntro = reduced.matches ? introGoal : shownIntro + (introGoal-shownIntro)*(1-Math.exp(-dt*4.5));
    if (Math.abs(diseaseGoal-shownDisease)<.0001) shownDisease=diseaseGoal;
    if (Math.abs(introGoal-shownIntro)<.0001) shownIntro=introGoal;
    paint(shown,shownDisease,shownIntro);
    if (shown !== goal || shownDisease !== diseaseGoal || shownIntro !== introGoal) frame = requestAnimationFrame(tick);
  }
  function kick() { if (!frame && visible && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
  function resize() {
    height = stage.clientHeight; width = stage.clientWidth;
    cw = composition.offsetWidth; ch = composition.offsetHeight;
    cx = composition.offsetLeft; cy = composition.offsetTop;
    // Focal points stay attached to the organisms in the supplied composition.
    beeX = cw * (.245 - .5);
    beeY = ch * (.56 - .5);
    miteX = cw * (.795 - .5);
    miteY = ch * (.49 - .5);
    titleMid = hiveCopy.offsetTop + introTitle.offsetTop + introTitle.offsetHeight / 2;
    // how far "Introducing" sits from the centre once the logo is beside it
    const wordmark = introTitle.querySelector('.swarm-wordmark');
    hiveCopy.style.setProperty('--shift', `${((wordmark.offsetWidth + parseFloat(getComputedStyle(introTitle).columnGap || 0)) / 2).toFixed(1)}px`);
    beeAnchorX = introBee.offsetLeft + introBee.offsetWidth * .66;   // the bee's thorax, where the zoom lands
    beeAnchorY = introBee.offsetTop + introBee.offsetHeight * .52;
    paint(shown,shownDisease,shownIntro); kick();
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { shown = journeyProgress(); shownDisease=window.earthScroll().disease; shownIntro=window.earthScroll().intro; kick(); }
    else { protein.dataset.active = rna.dataset.active = 'false'; }
  }).observe(stage);
  new ResizeObserver(resize).observe(stage);
  artwork.addEventListener('load', resize);
  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  reduced.addEventListener('change', () => { shown = journeyProgress(); resize(); });
  resize();
}
