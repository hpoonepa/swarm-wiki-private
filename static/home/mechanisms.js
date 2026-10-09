import { initRnaPlayer } from './vendor/rna-player.js?v=4f936f4baf33';
import { initJourney, binderProgress, rnaProgress, rnaScroll } from './journey.js?v=fce65d063f0a';

initJourney();

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = n => Math.max(0, Math.min(1, n));
const mini = document.getElementById('minibinders');
const journey = document.getElementById('honeycomb-earth');
const host = document.getElementById('capsid-host');
const rna = document.getElementById('rnai');
const player = rna.querySelector('[data-rna-player]');
const rnaPlayer = initRnaPlayer(player);
const modelStories = [
  ['Targeting DWV', 'DWV wraps its genetic material in a protein shell called a capsid. Our first approach focuses on a part of that shell: the P domain.'],
  ['Before it enters a cell', 'A virus cannot reproduce on its own. DWV has to enter a bee cell and use the cell’s machinery. We’re investigating whether binding its outer shell can interrupt that step.'],
  ['Minibinders', 'A minibinder is a small, designed protein that attaches to a chosen target. We design its shape to fit the P domain, then test whether it binds. This lets us target a specific part of the virus.'],
  ['From design to binding', 'One of our designed proteins bound the isolated DWV P domain in both repeats of an Adaptyv Bio binding assay. That gives us a starting point to improve the binder and investigate its effect on the virus.'],
  ['Can binding block infection?', 'Our aim is to keep DWV out of bee cells. Binding is the first step; whether it prevents infection still needs testing. We also need to address the mite that carries the virus.']
];
const smooth = n => { const t=clamp(n); return t*t*(3-2*t); };
let displayedMini = binderProgress(), miniPhase = -1;
let copyAnimations=[];
const miniHeading=mini.querySelector('h2'),miniExplanation=mini.querySelector('[data-mini-explanation]');
const siteLabel=host.querySelector('.protein-label--site'), binderLabel=host.querySelector('.protein-label--binder');
host.addEventListener('anchors', e => {
  for(const anchor of e.detail.anchors){
    const label=anchor.id==='binder'?binderLabel:anchor.id==='p-domain'?siteLabel:null;
    if(!label) continue;
    const show=anchor.visible && (anchor.id==='binder'?displayedMini>.44:displayedMini>.22 && displayedMini<.60);
    label.style.visibility=show?'visible':'hidden';
    label.style.left=`${anchor.x}px`;label.style.top=`${anchor.y-18}px`;
  }
});
let scene = null, loading = false;
let previousRNA = -1, displayedRNA = rnaProgress(), frame = 0, last = performance.now();
const inView = new Set();

async function loadProtein() {
  if (scene || loading) return;
  loading = true;
  try {
    const { mountScene } = await import('./vendor/capsid-engine.js?v=3a9b78d9a921');
    scene = await mountScene(host, { mode: 'capsid', srcBase: 'assets/protein/', reduced: reduced.matches, progress: binderProgress(), forceWebGL: true });
    host.dataset.backend = scene.backend;
    paintMini();
  } catch (error) {
    host.dataset.backend = 'poster';
    host.removeAttribute('data-ready');
    host.querySelector('.model-fallback').textContent = 'The interactive model could not load. Try refreshing the page.';
    console.error('Capsid scene:', error);
  } finally {
    loading = false;
  }
}
function paintMini(p = displayedMini) {
  const index = p < .24 ? 0 : p < .43 ? 1 : p < .60 ? 2 : p < .80 ? 3 : 4;
  mini.dataset.phase = String(index);
  if(miniPhase!==index){
    miniPhase=index;const [title,explanation]=modelStories[index];
    miniHeading.textContent=title;
    miniExplanation.textContent=explanation;
    copyAnimations.forEach(animation=>animation.cancel());
    copyAnimations=reduced.matches?[]:[miniHeading,miniExplanation].map(element=>element.animate(
      [{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:300,easing:'cubic-bezier(.2,.7,.2,1)'}));
  }
  const approach=smooth((p-.16)/.21), blocked=smooth((p-.80)/.20), cellIn=smooth((p-.12)/.20);
  host.style.transform=`translate3d(${-6+18*approach-19*blocked}%,${-3+5*blocked}%,0) scale(${1-.28*approach})`;
  mini.querySelector('.gut-cell').style.transform=`translateX(${(1-cellIn)*150}%)`;
  binderLabel.textContent=p>.78?'Bound minibinder':'Minibinder';
  scene?.setProgress(reduced.matches ? [.1,.33,.52,.72,1][index] : p, { instant: reduced.matches });
}
// Each molecule stays in the same scene throughout. Explicit playback is optional;
// scrolling resumes control and the next-step button seeks the same scroll timeline.
player.addEventListener('rna-seek', e => {
  e.preventDefault();
  const top = rnaScroll(e.detail.progress);
  scrollTo({ top, behavior: e.detail.instant || reduced.matches ? 'auto' : 'smooth' });
});
player.addEventListener('rna-playhead', e => {
  displayedRNA = previousRNA = e.detail.progress;
  const top = rnaScroll(e.detail.progress);
  scrollTo({top, behavior: 'instant'});
});
// A real scroll gesture takes over from playback at its current position.
addEventListener('wheel', () => rnaPlayer.pause(), {passive: true});
addEventListener('touchstart', () => rnaPlayer.pause(), {passive: true});
addEventListener('keydown', e => { if (['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(e.key)) rnaPlayer.pause(); });
function tick(now) {
  frame = 0;
  if (document.hidden) return;
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  let settlingMini=false;
  if (inView.has(journey)) {
    const goal=binderProgress();
    displayedMini=reduced.matches?goal:displayedMini+(goal-displayedMini)*(1-Math.exp(-dt*7));
    if(Math.abs(goal-displayedMini)<.0001)displayedMini=goal;
    paintMini();settlingMini=displayedMini!==goal;
  }
  if (inView.has(rna) && !rnaPlayer.isPlaying()) {
    const goal = rnaProgress();
    displayedRNA = reduced.matches ? goal : displayedRNA + (goal - displayedRNA) * (1 - Math.exp(-dt * 7));
    if (Math.abs(goal - displayedRNA) < .0001) displayedRNA = goal;
    if (displayedRNA !== previousRNA) {
      previousRNA = displayedRNA;
      rnaPlayer.scrub(displayedRNA);
    }
    if (displayedRNA !== goal) frame = requestAnimationFrame(tick);
  }
  if(settlingMini && !frame)frame=requestAnimationFrame(tick);
}
function kick() { if (!frame && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); } }
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { inView.add(e.target); if (e.target === journey) loadProtein(); }
    else inView.delete(e.target);
  });
  kick();
}, { rootMargin: '300px' });
observer.observe(journey); observer.observe(rna);
// Prepare the model while the visitor is still reading the globe section.
// Geometry rendering remains on demand, so this does not add an idle animation loop.
if ('requestIdleCallback' in window) requestIdleCallback(loadProtein, { timeout: 2500 });
else setTimeout(loadProtein, 1500);
addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick);
document.addEventListener('visibilitychange', kick);
reduced.addEventListener('change', () => { scene?.setReduced(reduced.matches); previousRNA = -1; kick(); });
addEventListener('pagehide', e => { if (!e.persisted) { scene?.destroy(); rnaPlayer.destroy(); observer.disconnect(); } });
