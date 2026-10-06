import { onReducedMotionChange, prefersReducedMotion } from '../../motion/reduced';
import { createRnaScene } from './rna-art.js';

// The uploaded animation keeps its original timing and camera moves. Scroll owns
// the playhead; stop before the standalone version's fade-to-white loop.
const START = .8, END = 30, DURATION = END - START;
const boundaries = [3, 8.6, 13, 16, 17.8, 22.2];
const keyframes = [1.8, 5.1, 11.6, 15.2, 17.1, 21.5, 27.5];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t*t*(3-2*t); };
const phaseAt = (time: number) => {
  const i = boundaries.findIndex(boundary => time < boundary);
  return i < 0 ? boundaries.length : i;
};

export function initRnaPlayer(player: HTMLElement) {
  const canvas = player.querySelector<HTMLCanvasElement>('.rna-canvas')!;
  const scene = createRnaScene(canvas);
  const copies = [...player.querySelectorAll<HTMLElement>('[data-rna-copy]')];
  const next = player.querySelector<HTMLButtonElement>('[data-rna-next]')!;
  const play = player.querySelector<HTMLButtonElement>('[data-rna-play]')!;
  const playIcon = player.querySelector<HTMLElement>('[data-rna-play-icon]')!;
  const events = new AbortController();
  let progress = 0, step = -1, frame = 0, playing = false;
  player.dataset.animation = 'supplied-rnai';

  const render = (raw: number) => {
    progress = clamp(raw);
    player.dataset.progress = progress.toFixed(4);
    const time = START + progress * DURATION;
    const current = phaseAt(time), reduced = prefersReducedMotion();
    scene.render(reduced ? keyframes[current] : time);
    copies.forEach((copy, i) => {
      const fadeIn = i === 0 ? 1 : ease((time - boundaries[i-1] + .16)/.32);
      const fadeOut = i === copies.length-1 ? 1 : 1-ease((time - boundaries[i] + .16)/.32);
      const alpha = reduced ? Number(i === current) : fadeIn * fadeOut;
      copy.hidden = false;
      copy.style.opacity = String(alpha);
      copy.style.transform = `translateY(${(1-alpha)*8}px)`;
      copy.setAttribute('aria-hidden', String(i !== current));
    });
    if (current !== step) {
      step = current; player.dataset.step = String(step);
      const atEnd = step === copies.length-1;
      next.setAttribute('aria-label', atEnd ? 'Start again' : 'Next step');
      next.innerHTML = `<span aria-hidden="true">${atEnd ? '↻' : '→'}</span>`;
    }
  };
  const pause = () => {
    cancelAnimationFrame(frame); playing = false;
    play.setAttribute('aria-pressed', 'false');
    play.setAttribute('aria-label', 'Play sequence');
    playIcon.textContent = '▷';
  };
  const show = (index: number, instant = false) => {
    pause();
    const target = (keyframes[index] - START)/DURATION;
    const seek = new CustomEvent('rna-seek', { bubbles: true, cancelable: true,
      detail: { progress: target, instant: instant || prefersReducedMotion() } });
    if (player.dispatchEvent(seek)) render(target);
  };
  next.addEventListener('click', e => show((step+1)%keyframes.length, e.detail === 0), {signal: events.signal});
  play.addEventListener('click', () => {
    if (playing) return pause();
    if (prefersReducedMotion()) return show((step+1)%keyframes.length, true);
    if (progress >= .99) render(0);
    playing = true;
    play.setAttribute('aria-pressed', 'true');
    play.setAttribute('aria-label', 'Pause sequence');
    playIcon.textContent = 'Ⅱ';
    let last = performance.now();
    const tick = (now: number) => {
      if (!playing) return;
      // A suspended tab or dropped frame must not skip a whole molecular event.
      const delta = Math.min(.05, (now-last)/1000); last = now;
      render(progress + delta/DURATION);
      player.dispatchEvent(new CustomEvent('rna-playhead', {bubbles:true, detail:{progress}}));
      if (progress < 1) frame = requestAnimationFrame(tick); else pause();
    };
    frame = requestAnimationFrame(tick);
  }, {signal: events.signal});
  const visibility = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
  visibility.observe(player);
  const removeReducedListener = onReducedMotionChange(() => { pause(); render(progress); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); }, {signal: events.signal});
  addEventListener('pagehide', pause, {signal: events.signal});
  render(0);
  return {
    scrub: (p: number) => { pause(); render(p); },
    pause,
    isPlaying: () => playing,
    destroy: () => { pause(); events.abort(); visibility.disconnect(); removeReducedListener(); scene.destroy(); }
  };
}
