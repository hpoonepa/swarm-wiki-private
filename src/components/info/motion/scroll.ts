import { scrollInfo } from 'motion';
import { onReducedMotionChange, prefersReducedMotion } from './reduced';

/** CSS scroll-driven animations (Chrome 115+, Safari 26+). Firefox ships them behind a flag only. */
export const supportsScrollTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

/**
 * A scroll scene: `keyframes` on `target`, scrubbed by scroll instead of time.
 * - `source: 'view'` (default) follows `subject` (default `target`) through the viewport over
 *   `rangeStart`…`rangeEnd`, CSS timeline ranges such as `'cover 0%'`, `'contain 60%'`, `'exit 25%'`
 *   or `'entry 100px'`. Named ranges: cover, contain, entry, exit, entry-crossing, exit-crossing.
 * - `source: 'scroll'` follows the page's scroll position; a range then resolves against the whole
 *   scroll length (`'cover 20%'` is `'20%'`), as browsers resolve it on a ScrollTimeline.
 * The subject should be an HTML element that is not position: sticky and not inside an
 * `overflow: hidden | auto` ancestor (use `overflow: clip`), so the native timeline and the fallback
 * both measure it against the page scroll. The fallback measures an HTML subject's layout box
 * (padding box, transforms ignored), so give it no vertical border. SVG subjects work, but the
 * fallback measures them with getBoundingClientRect, which includes transforms: an SVG subject must
 * not be transformed by its own scene.
 */
export interface SceneSpec { target: Element; keyframes: Keyframe[]; subject?: Element; source?: 'view' | 'scroll'; rangeStart?: string; rangeEnd?: string; easing?: string }

/** Length of the paused WAAPI animation the fallback scrubs; any value works. */
const SCRUB_MS = 1000;

/**
 * Binds a scroll scene and returns its cleanup, which cancels the animation and stops tracking.
 * It runs on a native ViewTimeline/ScrollTimeline where supported (compositor thread). Otherwise the
 * same keyframes and easing run as a paused WAAPI animation whose time Motion's scroll tracking
 * (`scrollInfo`, which `scroll()` uses) sets; it also re-measures when the page's size changes.
 * Under reduced motion the target holds the FINAL keyframe and nothing animates. Do not bind a scene
 * whose end frame hides content (a fade-out, a lift out of frame): check `prefersReducedMotion()`
 * and leave it unbound instead. Follows changes to the reduced-motion preference while bound.
 */
export function bindScene(s: SceneSpec): () => void {
  const range = parseRangePair(s.rangeStart, s.rangeEnd);
  const attach = (reduced: boolean) => (reduced ? holdEnd(s) : nativeTimelines() ? nativeScene(s) : fallbackScene(s, range));
  let detach = attach(prefersReducedMotion());
  const stop = onReducedMotionChange((reduced) => {
    detach();
    detach = attach(reduced);
  });
  return () => {
    stop();
    detach();
  };
}

/**
 * Calls `cb` with the subject's progress (0…1) through the range as the page scrolls, via Motion's
 * scroll tracking; once on bind (next frame), then only when the value changes. Same ranges and
 * subject rules as `bindScene` (SVG subjects are measured with getBoundingClientRect). It re-measures
 * on scroll and resize; it does not watch the page size every frame, which would keep a frame loop
 * running in every browser. Unaffected by reduced motion. Returns a cleanup that removes `cb`.
 */
export function onProgress(subject: Element, cb: (p: number) => void, opts: { rangeStart?: string; rangeEnd?: string } = {}): () => void {
  return track(subject, parseRangePair(opts.rangeStart, opts.rangeEnd), cb, false);
}

const nativeTimelines = () => supportsScrollTimeline && typeof ViewTimeline === 'function' && typeof ScrollTimeline === 'function';
const scroller = () => document.scrollingElement ?? document.documentElement;

function nativeScene(s: SceneSpec): () => void {
  const timeline = s.source === 'scroll'
    ? new ScrollTimeline({ source: scroller(), axis: 'block' })
    // Navigation scroll-padding must not shrink the scene viewport: the fallback uses its full height too.
    : new ViewTimeline({ subject: s.subject ?? s.target, axis: 'block', inset: '0px' });
  const anim = s.target.animate(s.keyframes, {
    timeline, fill: 'both', easing: s.easing ?? 'linear',
    rangeStart: s.rangeStart ?? 'cover 0%', rangeEnd: s.rangeEnd ?? 'cover 100%',
  });
  return () => anim.cancel();
}

function fallbackScene(s: SceneSpec, range: RangePair): () => void {
  const anim = s.target.animate(s.keyframes, { duration: SCRUB_MS, fill: 'both', easing: s.easing ?? 'linear' });
  anim.pause();
  // trackContentSize: a layout shift that moves the subject without scrolling still re-measures.
  const stop = track(s.source === 'scroll' ? null : s.subject ?? s.target, range, (p) => {
    anim.currentTime = p * SCRUB_MS;
  }, true);
  return () => {
    stop();
    anim.cancel();
  };
}

function holdEnd(s: SceneSpec): () => void {
  const anim = s.target.animate(s.keyframes, { duration: SCRUB_MS, fill: 'both', easing: s.easing ?? 'linear' });
  anim.finish();
  return () => anim.cancel();
}

type RangeName = 'cover' | 'contain' | 'entry' | 'exit' | 'entry-crossing' | 'exit-crossing';
/** A range edge: `pct` of the named range (the whole timeline when `name` is null) plus `px`. */
interface RangeEdge { name: RangeName | null; pct: number; px: number }
type RangePair = [RangeEdge, RangeEdge];
const RANGE_NAMES: ReadonlySet<string> = new Set(['cover', 'contain', 'entry', 'exit', 'entry-crossing', 'exit-crossing']);

function parseRangePair(start = 'cover 0%', end = 'cover 100%'): RangePair {
  return [parseEdge(start, 0), parseEdge(end, 1)];
}

/** Parses `normal`, `<name>`, `<name> <length-percentage>` or `<length-percentage>` (% or px). */
function parseEdge(value: string, defaultPct: 0 | 1): RangeEdge {
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1 && parts[0] === 'normal') return { name: null, pct: defaultPct, px: 0 };
  const name = RANGE_NAMES.has(parts[0]) ? (parts.shift() as RangeName) : null;
  if (name && parts.length === 0) return { name, pct: defaultPct, px: 0 };
  const m = parts.length === 1 ? /^(-?(?:\d+\.?\d*|\.\d+))(%|px)?$/.exec(parts[0]) : null;
  if (!m || (!m[2] && Number(m[1]) !== 0)) throw new Error(`Unsupported scroll range "${value}"`);
  return m[2] === '%' ? { name, pct: Number(m[1]) / 100, px: 0 } : { name, pct: 0, px: Number(m[1]) };
}

/**
 * A named range as [start, end] in u = −(subject top relative to the viewport top), which grows 1:1
 * with scroll. S = subject height, V = viewport height. Definitions from CSS Scroll-driven Animations:
 * contain is where the subject is fully inside the viewport (S ≤ V) or fully covers it (S > V),
 * entry runs from cover 0% to contain 0%, exit from contain 100% to cover 100%.
 */
function viewRange(name: RangeName, S: number, V: number): [number, number] {
  const lo = Math.min(0, S - V);
  const hi = Math.max(0, S - V);
  switch (name) {
    case 'cover': return [-V, S];
    case 'contain': return [lo, hi];
    case 'entry': return [-V, lo];
    case 'exit': return [hi, S];
    case 'entry-crossing': return [-V, S - V];
    case 'exit-crossing': return [0, S];
  }
}

const edgeAt = (e: RangeEdge, [a, b]: [number, number]) => a + e.pct * (b - a) + e.px;

interface AxisInfo { current: number; scrollLength: number; containerLength: number; targetOffset: number; targetLength: number }

/**
 * Progress of `subject` (or of the page scroll when null) through `range`, from Motion's `scrollInfo`.
 * HTML subjects use the offsets Motion measures in its read phase (layout boxes: transforms ignored,
 * like a native ViewTimeline). A static offset string cannot express these ranges: contain, entry
 * and exit change shape when the subject is taller than the viewport.
 */
function track(subject: Element | null, [start, end]: RangePair, cb: (p: number) => void, trackContentSize: boolean): () => void {
  let last = Number.NaN;
  const emit = (u: number, a: number, b: number) => {
    const p = b > a ? Math.min(1, Math.max(0, (u - a) / (b - a))) : u >= b ? 1 : 0;
    if (p !== last) {
      last = p;
      cb(p);
    }
  };
  if (!subject) {
    return scrollInfo((info: { y: AxisInfo }) => {
      const whole: [number, number] = [0, info.y.scrollLength];
      emit(info.y.current, edgeAt(start, whole), edgeAt(end, whole));
    }, { trackContentSize });
  }
  const layoutBox = subject instanceof HTMLElement;
  return scrollInfo((info: { y: AxisInfo }) => {
    const y = info.y;
    let top = y.targetOffset - y.current;
    let size = y.targetLength;
    if (!layoutBox) ({ top, height: size } = subject.getBoundingClientRect());
    const V = y.containerLength;
    const range = (e: RangeEdge) => edgeAt(e, viewRange(e.name ?? 'cover', size, V));
    emit(-top, range(start), range(end));
  }, layoutBox ? { target: subject, trackContentSize } : { trackContentSize });
}
