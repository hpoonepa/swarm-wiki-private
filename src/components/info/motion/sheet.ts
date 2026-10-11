import { spring as springGenerator } from 'motion';
import { nearest, project, rubberband, VelocityTracker } from './gesture';
import { prefersReducedMotion } from './reduced';
import { physics, spring } from './springs';

/** Travel before a press becomes a drag, so taps and clicks inside the handle still work. */
const DRAG_THRESHOLD = 10;
/** The spring is sampled into WAAPI keyframes this far apart (ms), so it runs off the main thread. */
const SAMPLE_MS = 10;
const MAX_MS = 2000;
const SHEET_SPRING = physics(spring.sheet);

/** How long a cancelled press keeps swallowing its release click, in case its pointerup never arrives. */
const CANCEL_SWALLOW_MS = 500;

interface Flight { anim: Animation; gen: ReturnType<typeof springGenerator>; to: number }
interface Press { id: number; downY: number; startY: number; caught: boolean; dragging: boolean }
export interface SheetOptions {
  /** translateY values in px, e.g. [closed, open]. A function is re-read on every viewport resize. */
  detents: number[] | (() => number[]);
  initial?: number;
  onChange?: (index: number) => void;
  handle?: HTMLElement;
}

/**
 * A draggable sheet. The controller owns `el.style.transform`. Drags track 1:1 from the grab point
 * after a 10 px threshold and rubber-band past the outer detents. On release the flick velocity
 * projects the resting point and the sheet springs (spring.sheet) to the nearest detent, starting at
 * the release velocity. A press catches a moving sheet where it is. Esc snaps to detents[0] without
 * animating (keyboard-initiated), as does `snapTo(i, v, { instant: true })`; under reduced motion
 * every snap is instant. Esc, `snapTo` or `destroy()` during a press cancel it and swallow its release
 * click. When `detents` is a function it is re-read on window and visualViewport resize (a phone's
 * URL bar changes the viewport height): a resting sheet moves to its new detent without animating, a
 * flight whose detent moved is retargeted from where it is with its velocity, and a flight or press
 * whose detent did not move is left alone. `onChange` fires when the target detent changes. The handle
 * gets `touch-action: none`, so it should not contain content that scrolls.
 */
export class SheetController {
  private readonly el: HTMLElement;
  private readonly handle: HTMLElement;
  private readonly readDetents: () => number[];
  private readonly dynamic: boolean;
  private readonly onChange?: (index: number) => void;
  private readonly tracker = new VelocityTracker();
  private readonly touchAction: string;
  private detents: number[];
  private current: number;
  private y = 0;
  private flight: Flight | null = null;
  private press: Press | null = null;

  constructor(el: HTMLElement, opts: SheetOptions) {
    const { detents } = opts;
    this.el = el;
    this.handle = opts.handle ?? el;
    this.dynamic = typeof detents === 'function';
    this.readDetents = typeof detents === 'function' ? detents : () => detents;
    this.detents = this.measureDetents();
    this.onChange = opts.onChange;
    this.current = this.checkIndex(opts.initial ?? 0);
    this.touchAction = this.handle.style.touchAction;
    this.handle.style.touchAction = 'none';
    this.setY(this.detents[this.current]);
    this.handle.addEventListener('pointerdown', this.onDown);
    this.el.addEventListener('keydown', this.onKey);
    if (this.dynamic) {
      addEventListener('resize', this.onResize);
      visualViewport?.addEventListener('resize', this.onResize);
    }
  }

  get index(): number { return this.current; }

  /**
   * Springs to `detents[index]`, starting at `velocity` px/s (default: the velocity of the current
   * flight or drag). `instant` snaps without animating; pass it for keyboard-initiated opens
   * (a click with `event.detail === 0`). Ends an active drag first.
   */
  snapTo(index: number, velocity?: number, opts: { instant?: boolean } = {}): void {
    const i = this.checkIndex(index);
    const v = velocity ?? (this.press?.dragging ? this.tracker.velocity() : this.flightVelocity());
    this.cancelPress();
    this.settle(i, v, opts.instant ?? false);
  }

  /** Ends any press, jumps to the current detent (no half-finished flight left behind) and detaches. */
  destroy(): void {
    this.cancelPress();
    this.flight?.anim.cancel();
    this.flight = null;
    // A resize during a drag may have shortened the detents after `current` was chosen.
    this.setY(this.detents[Math.min(this.current, this.detents.length - 1)]);
    this.handle.removeEventListener('pointerdown', this.onDown);
    this.el.removeEventListener('keydown', this.onKey);
    removeEventListener('resize', this.onResize);
    visualViewport?.removeEventListener('resize', this.onResize);
    this.handle.style.touchAction = this.touchAction;
  }

  private measureDetents(): number[] {
    const detents = [...this.readDetents()];
    if (detents.length === 0) throw new RangeError('SheetController: detents is empty');
    return detents;
  }

  private checkIndex(index: number): number {
    if (!Number.isInteger(index) || index < 0 || index >= this.detents.length) {
      throw new RangeError(`SheetController: no detent ${index}`);
    }
    return index;
  }

  private setY(y: number): void {
    this.y = y;
    this.el.style.transform = `translateY(${y}px)`;
  }

  private flightVelocity(): number {
    if (!this.flight) return 0;
    return this.flight.gen.velocity?.(Number(this.flight.anim.currentTime ?? 0)) ?? 0;
  }

  /** Stops any flight where it is on screen and returns that position. */
  private stop(): number {
    if (this.flight) {
      const { anim } = this.flight;
      this.flight = null;
      const onScreen = new DOMMatrixReadOnly(getComputedStyle(this.el).transform).m42;
      this.setY(onScreen);
      anim.cancel();
    }
    return this.y;
  }

  private setIndex(index: number): void {
    if (index === this.current) return;
    this.current = index;
    this.onChange?.(index);
  }

  private settle(index: number, velocity: number, instant: boolean): void {
    const from = this.stop();
    const to = this.detents[index];
    this.setIndex(index);
    if (instant || prefersReducedMotion() || (from === to && velocity === 0)) {
      this.setY(to);
      return;
    }
    const gen = springGenerator({ keyframes: [from, to], ...SHEET_SPRING, velocity, restDelta: 0.5, restSpeed: 10 });
    const frames: Keyframe[] = [];
    let t = 0;
    for (;; t += SAMPLE_MS) {
      const { value, done } = gen.next(t);
      frames.push({ transform: `translateY(${done ? to : value}px)` });
      if (done || t >= MAX_MS) break;
    }
    frames[frames.length - 1] = { transform: `translateY(${to}px)` };
    // The inline style already holds the destination, so nothing jumps when the animation ends.
    this.setY(to);
    const anim = this.el.animate(frames, { duration: t, easing: 'linear' });
    this.flight = { anim, gen, to };
    anim.onfinish = () => {
      if (this.flight?.anim === anim) this.flight = null;
    };
  }

  private rubber(y: number): number {
    const lo = Math.min(...this.detents);
    const hi = Math.max(...this.detents);
    if (y < lo) return lo + rubberband(y - lo, innerHeight);
    if (y > hi) return hi + rubberband(y - hi, innerHeight);
    return y;
  }

  private onResize = (): void => {
    this.detents = this.measureDetents();
    const index = Math.min(this.current, this.detents.length - 1);
    const to = this.detents[index];
    const p = this.press;
    // A drag, or a press that caught a moving sheet, holds it under the pointer: only the detents
    // change, and the release settles against them.
    if (p?.dragging || p?.caught) {
      this.setIndex(index);
      return;
    }
    if (this.flight) {
      // Keep flying if the destination did not move (e.g. an open detent a URL-bar resize does not
      // affect); otherwise turn toward the new one from the on-screen position, keeping velocity.
      if (to !== this.flight.to) this.settle(index, this.flightVelocity(), false);
      else this.setIndex(index);
      return;
    }
    // At rest the sheet follows the layout without animating.
    if (to !== this.y) this.settle(index, 0, true);
    else this.setIndex(index);
    // A press not yet past the drag threshold drags from where the sheet now is, not from where it was.
    if (p) p.startY = this.y;
  };

  private onDown = (e: PointerEvent): void => {
    if (this.press || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const caught = this.flight !== null;
    const startY = this.stop();
    this.press = { id: e.pointerId, downY: e.clientY, startY, caught, dragging: false };
    this.tracker.reset();
    this.tracker.add(e.timeStamp, startY);
    addEventListener('pointermove', this.onMove);
    addEventListener('pointerup', this.onUp);
    addEventListener('pointercancel', this.onCancel);
    // Esc cancels a press wherever focus is (Safari does not focus a button on mousedown).
    addEventListener('keydown', this.onKey, true);
  };

  private onMove = (e: PointerEvent): void => {
    const p = this.press;
    if (!p || e.pointerId !== p.id) return;
    const dy = e.clientY - p.downY;
    if (!p.dragging) {
      if (Math.abs(dy) < DRAG_THRESHOLD) return;
      p.dragging = true;
      // Capture only once dragging: capturing on press would retarget clicks on links inside the handle.
      try { this.handle.setPointerCapture(p.id); } catch { /* pointer already gone */ }
      getSelection()?.removeAllRanges();
      document.addEventListener('selectstart', preventDefault);
    }
    // Coalesced samples keep the velocity history dense when the main thread is slow.
    const coalesced = e.getCoalescedEvents?.() ?? [];
    for (const c of coalesced.length ? coalesced : [e]) this.tracker.add(c.timeStamp, this.rubber(p.startY + c.clientY - p.downY));
    this.setY(this.rubber(p.startY + dy));
  };

  private onUp = (e: PointerEvent): void => {
    const p = this.press;
    if (!p || e.pointerId !== p.id) return;
    this.endPress();
    if (!p.dragging) {
      // A tap on a moving sheet caught it; let it carry on to where it was going.
      if (p.caught) this.settle(this.current, 0, false);
      return;
    }
    // A release sample, so a pointer that stopped before letting go reports ~0 velocity.
    this.setY(this.rubber(p.startY + e.clientY - p.downY));
    this.tracker.add(e.timeStamp, this.y);
    const velocity = this.tracker.velocity();
    const target = nearest(this.detents, this.y + project(velocity));
    this.settle(this.detents.indexOf(target), velocity, false);
    // The drag ends in a click on the handle; swallow it so a click-to-toggle handler does not undo the drag.
    swallowNextClick();
  };

  private onCancel = (e: PointerEvent): void => {
    const p = this.press;
    if (!p || e.pointerId !== p.id) return;
    this.endPress();
    if (p.dragging || p.caught) this.settle(this.detents.indexOf(nearest(this.detents, this.y)), 0, false);
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    // Heard twice during a press (window capture and the sheet); the second call finds nothing to do.
    if (this.current === 0 && !this.flight && !this.press) return;
    this.cancelPress();
    this.settle(0, 0, true);
  };

  /**
   * Ends a press that something other than the pointer interrupted (Esc, snapTo, destroy), whether or
   * not it had become a drag. A drag gives up pointer capture. The click its release produces is
   * swallowed; the swallow disarms after one click, on the next pointerdown, or after
   * CANCEL_SWALLOW_MS, so a lost pointerup can never cost an unrelated later click.
   */
  private cancelPress(): void {
    const p = this.press;
    if (!p) return;
    this.endPress();
    if (p.dragging) {
      try {
        if (this.handle.hasPointerCapture(p.id)) this.handle.releasePointerCapture(p.id);
      } catch { /* pointer already gone */ }
    }
    armClickSwallow(CANCEL_SWALLOW_MS);
  }

  private endPress(): void {
    this.press = null;
    removeEventListener('pointermove', this.onMove);
    removeEventListener('pointerup', this.onUp);
    removeEventListener('pointercancel', this.onCancel);
    removeEventListener('keydown', this.onKey, true);
    document.removeEventListener('selectstart', preventDefault);
  }
}

function preventDefault(e: Event): void { e.preventDefault(); }
function stopClick(e: Event): void {
  e.preventDefault();
  e.stopPropagation();
}
/** Swallows a click dispatched in the current task (the one that follows a pointerup). */
function swallowNextClick(): void {
  addEventListener('click', stopClick, { capture: true, once: true });
  setTimeout(() => removeEventListener('click', stopClick, { capture: true }), 0);
}
/**
 * Swallows the next pointer click (detail > 0; a keyboard click is never swallowed), for at most
 * `ms`, and not past the next pointerdown, which starts an unrelated press.
 */
function armClickSwallow(ms: number): void {
  const disarm = () => {
    clearTimeout(timer);
    removeEventListener('click', onClick, true);
    removeEventListener('pointerdown', disarm, true);
  };
  const onClick = (e: MouseEvent) => {
    if (e.detail === 0) return;
    disarm();
    stopClick(e);
  };
  const timer = setTimeout(disarm, ms);
  addEventListener('click', onClick, true);
  addEventListener('pointerdown', disarm, true);
}
