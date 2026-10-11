import { initRnaPlayer } from './vendor/rna-player.js?v=faf544f7714b';
import { initJourney, binderProgress, rnaProgress, rnaScroll } from './journey.js?v=0c1ce3da2528';

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
  ['1. Minibinders', 'Minibinders are small proteins made to attach to a specific target. Ours binds the P domain, a part of DWV’s outer shell.'],
  ['Why a minibinder?', 'We can design its shape to fit the virus. We chose the P domain because binding there could help keep DWV from entering bee cells.'],
  ['Binding to DWV', 'Here, the minibinder meets the P domain on the virus’s surface. This is the contact we designed it to make.'],
  ['What we tested', 'We made the protein and tested it against the isolated P domain, measuring how tightly the two bind.'],
  ['Our binding result', 'Our minibinder bound the P domain in both repeats of the experiment. The best repeat measured about 550 nM.']
];
// A few translucent forms and suspended particles give the scenes depth.
// Their positions are fixed; the CSS drift pauses whenever a scene is hidden.
document.querySelectorAll('[data-cell-field]').forEach(field => {
  if(field.classList.contains('cell-field--protein')){
    // Sparse, matte fragments leave the copy and binding site clear.
    [[5,27,9],[17,15,6],[36,9,11],[49,74,8],[73,13,7],[86,28,10],[92,67,6],[19,79,7],[4,68,11],[60,84,5],[80,79,9],[43,23,5]].forEach(([x,y,size],i)=>{
      const fragment=document.createElement('span');
      fragment.className='gut-fragment';
      fragment.style.cssText=`--x:${x}%;--y:${y}%;--size:${size}px;--delay:${-i*2.7}s;--duration:${28+i%4*6}s;--sway:${i%2?22:-18}px;--tilt:${i*37}deg`;
      field.append(fragment);
    });
    return;
  }
  if(field.classList.contains('cell-field--rna')){
    const accents = [
      ['glow',-9,7,440],['glow',66,-18,520],['glow',51,77,390],
      ['circle',4,34,66],['circle',14,79,38],['circle',28,9,94],
      ['circle',40,67,47],['circle',53,29,30],['circle',63,82,82],
      ['circle',77,15,54],['circle',91,46,104],['circle',84,83,35]
    ];
    accents.forEach(([kind,x,y,size],i) => {
      const accent=document.createElement('span');
      accent.className=`cell-field__${kind}`;
      accent.style.cssText=`--x:${x}%;--y:${y}%;--size:${size}px;--delay:${-i*3.7}s;--duration:${26+i%5*5}s;--sway:${i%2?58:-48}px;--rise:${i%3?42:-54}px`;
      field.append(accent);
    });
  }
  const bubbles = [[2,12,142],[20,-5,86],[43,2,28],[75,-8,176],[96,21,110],[-3,61,176],[99,67,74],[88,92,152],[57,99,94],[23,98,67],[9,89,36],[82,49,27],[65,20,18],[36,87,24]];
  bubbles.forEach(([x,y,size],i) => {
    const bubble=document.createElement('span');
    bubble.className='cell-field__bubble';
    bubble.style.cssText=`--x:${x}%;--y:${y}%;--size:${size}px;--delay:${-i*2.3}s;--duration:${19+i%5*3}s;--sway:${i%2?18:-22}px;--tilt:${i*29}deg`;
    field.append(bubble);
  });
  for(let i=0;i<36;i++){
    const mote=document.createElement('i');
    mote.className='cell-field__mote';
    mote.style.cssText=`--x:${(i*37+11)%100}%;--y:${(i*61+7)%100}%;--size:${2+i%4}px;--delay:${-i*1.7}s;--duration:${22+i%7*3}s;--sway:${i%2?12:-16}px`;
    field.append(mote);
  }
});
const smooth = n => { const t=clamp(n); return t*t*(3-2*t); };
let displayedMini = binderProgress(), miniPhase = -1;
let copyAnimations=[];
const miniHeading=mini.querySelector('h2'),miniExplanation=mini.querySelector('[data-mini-explanation]');
const miniResult=mini.querySelector('[data-mini-result]');
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
    miniResult.hidden=index!==4;
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
addEventListener('swarm-scrub-start', () => rnaPlayer.pause());
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
