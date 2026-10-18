import { initRnaPlayer } from './vendor/rna-player.js?v=0ad76dc16e5c';
import { initJourney, rnaProgress, rnaScroll } from './journey.js?v=8fd57091299c';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = n => Math.max(0, Math.min(1, n));
const mini = document.getElementById('minibinders');
const journey = document.getElementById('honeycomb-earth');
const host = document.getElementById('capsid-host');
const rna = document.getElementById('rnai');
const player = rna.querySelector('[data-rna-player]');
const rnaPlayer = initRnaPlayer(player);
const smoothMini = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
// Broad, soft glows give the RNA scene depth without floating bubbles.
document.querySelectorAll('.cell-field--rna').forEach(field => {
  [[-9,7,440],[66,-18,520],[51,77,390]].forEach(([x,y,size],i) => {
    const glow = document.createElement('span');
    glow.className = 'cell-field__glow';
    glow.style.cssText = `--x:${x}%;--y:${y}%;--size:${size}px;--delay:${-i*3.7}s;--duration:${26+i*5}s;--sway:${i%2?58:-48}px;--rise:${i%3?42:-54}px`;
    field.append(glow);
  });
});
let displayedMini = 0;
let scene = null, loading = false;
let previousRNA = -1, displayedRNA = rnaProgress(), frame = 0, last = performance.now();
const inView = new Set();

async function loadProtein() {
  if (scene || loading) return;
  loading = true;
  try {
    const { mountBinderScene } = await import('./binder-scene.js?v=a3133bd1ea3b');
    scene = await mountBinderScene(host, { reduced: reduced.matches, progress: displayedMini });
    host.dataset.backend = scene.backend;
    paintMini();
  } catch (error) {
    host.dataset.backend = 'poster';
    host.removeAttribute('data-ready');
    host.querySelector('.model-fallback').textContent = 'The interactive model could not load. Try refreshing the page.';
    console.error('Minibinder scene:', error);
  } finally {
    loading = false;
  }
}
function paintMini(p = displayedMini) {
  const index = p < .22 ? 0 : p < .43 ? 1 : p < .62 ? 2 : p < .82 ? 3 : 4;
  mini.dataset.phase = String(index);
  const zoom = reduced.matches ? Number(index > 0) : smoothMini((p - .10) / .17);
  mini.style.setProperty('--gut-zoom', zoom.toFixed(4));
  const molecular = reduced.matches ? Number(index > 0) : smoothMini((p - .25) / .15);
  mini.style.setProperty('--molecule-in', molecular.toFixed(4));
  const board = mini.querySelector('.binder-board'), cutaway = mini.querySelector('.gut-focus');
  board.inert = molecular < .05; board.setAttribute('aria-hidden', String(molecular < .05));
  cutaway.setAttribute('aria-hidden', String(molecular > .95));
  scene?.setProgress(reduced.matches ? [.05,.33,.52,.72,1][index] : p, { instant: reduced.matches });
}
initJourney(p => { displayedMini = p; paintMini(); });
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
