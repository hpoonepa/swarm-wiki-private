import { onReducedMotionChange, prefersReducedMotion } from '../../motion/reduced';
import { createRnaScene } from './rna-art.js';

// Give each molecular event equal reading room while keeping the camera and
// artwork synchronized to the page's reversible scroll position.
const START = .8, END = 30, DURATION = END - START;
const boundaries = [3, 8.6, 13, 16, 17.8, 22.2];
const keyframes = [1.8, 5.1, 11.6, 15.2, 17.1, 21.5, 27.5];
const headings = ['Double-stranded RNA.', 'Make short guides.', 'Assemble RISC.', 'Load the siRNA.', 'Keep one strand.', 'Find the message.', 'Cut the target mRNA.'];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const edges = [START, ...boundaries, END];
const sceneTime = (progress: number) => {
  const position = clamp(progress) * keyframes.length;
  const index = Math.min(keyframes.length - 1, Math.floor(position));
  return edges[index] + (edges[index + 1] - edges[index]) * (position - index);
};
const progressAtTime = (time: number) => {
  const next = edges.findIndex(edge => edge > time);
  const index = next < 0 ? keyframes.length - 1 : Math.max(0, next - 1);
  return (index + (time - edges[index]) / (edges[index + 1] - edges[index])) / keyframes.length;
};
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
  const heading = player.querySelector<HTMLElement>('[data-rna-heading]');
  const counter = player.querySelector<HTMLElement>('[data-rna-counter]');
  const events = new AbortController();
  let progress = 0, step = -1, frame = 0, playing = false;
  player.dataset.animation = 'swarm-rnai';

  const render = (raw: number) => {
    progress = clamp(raw);
    player.dataset.progress = progress.toFixed(4);
    player.style.setProperty('--rna-progress', String(progress));
    const time = sceneTime(progress);
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
      if (heading) heading.textContent = headings[step];
      if (counter) {
        counter.textContent = `${String(step + 1).padStart(2, '0')} / 07`;
        counter.setAttribute('aria-label', `Step ${step + 1} of 7`);
      }
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
    const target = progressAtTime(keyframes[index]);
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
  const visibility = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting || player.closest('[inert]')) pause(); });
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
