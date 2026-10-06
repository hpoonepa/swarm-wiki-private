/**
 * Drag-to-rotate for ProteinScene (spec §9.2; apple-design §2–§6).
 * - The molecule follows the pointer 1:1 from where it was grabbed (pointer capture, grab offset kept).
 * - Pitch is limited to ±60°; past that it rubber-bands instead of stopping hard.
 * - On release, momentum is projected (current + project(velocity, 0.99)) and settled on the momentum spring,
 *   starting at the release velocity. Grabbing mid-flight stops the spring where it is.
 * - Arrow keys turn 15° per press with no animation (keyboard-initiated motion never animates).
 * Yaw and pitch are independent springs, so a diagonal flick settles on both axes without desyncing.
 * Angles are degrees; velocities degrees per second.
 */
import { animate } from 'motion';
import { project, rubberband, VelocityTracker } from '../../motion/gesture';
import { physics, spring } from '../../motion/springs';

export const PITCH_LIMIT = 60;
export const KEY_STEP = 15;
/** How far past the pitch limit the rubber band can stretch at most (degrees). */
export const RUBBER_RANGE = 30;
const RUBBER_K = 0.55;
/**
 * Deceleration rate for the throw. Apple's scroll rate (0.998) projects so far that the 0.4 s momentum spring has
 * to overtake the finger to get there: 4.8× the release speed at its peak. At 0.99 the spring peaks at 1.12× the
 * release speed and a 600°/s flick coasts 59°.
 */
export const MOMENTUM_DECELERATION = 0.99;

type Playback = { stop(): void };

export interface DragRotateOptions {
  /** Called whenever yaw or pitch changes; the scene renders on the next frame. */
  onChange: () => void;
  /** Reduced motion: dragging still works, but release settles instantly with no momentum. */
  reduced: () => boolean;
  /** Degrees of rotation per pixel of pointer travel. */
  degPerPx: () => number;
}

/**
 * Displayed pitch for a raw (finger or spring) pitch: 1:1 up to `reach`, rubber-banded past it. A drag bands past
 * the ±60° limit; a throw released beyond the limit bands only past its release point (see fly()).
 */
export function band(raw: number, reach = PITCH_LIMIT): number {
  const over = Math.abs(raw) - reach;
  return over <= 0 ? raw : Math.sign(raw) * (reach + rubberband(over, RUBBER_RANGE, RUBBER_K));
}

/** Inverse of band(), so a grab while pitch is still past the limit resumes without a jump. */
function unband(shown: number): number {
  const over = Math.abs(shown) - PITCH_LIMIT;
  if (over <= 0) return shown;
  const o = Math.min(over, RUBBER_RANGE * 0.999);
  return Math.sign(shown) * (PITCH_LIMIT + (o * RUBBER_RANGE) / (RUBBER_K * (RUBBER_RANGE - o)));
}

const clampPitch = (p: number) => Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, p));

/** Where a release at `velocity` (°/s) comes to rest; pitch targets are clamped before the spring runs. */
export function throwTarget(axis: 'yaw' | 'pitch', current: number, velocity: number): number {
  const target = current + project(velocity, MOMENTUM_DECELERATION);
  return axis === 'pitch' ? clampPitch(target) : target;
}

/**
 * The momentum spring with the release velocity kept (Motion drops `velocity` on duration/bounce springs).
 * Motion ends a spring on the first frame where it is both within restDelta of the target and slower than
 * restSpeed, and then sets it to the target. For a move of 5° or more the defaults (0.5°, 2°/s) allow a final
 * jump of up to 0.5°, a visible snap at the bottom of the first overshoot. Both thresholds are set: restDelta
 * 0.01 bounds that jump, and restSpeed 0.5 makes the spring stop only once it is nearly still, so the stop is
 * not a cut from a visible drift either. The controls never retarget a running spring: every release starts
 * a new one.
 */
export function momentumSpring(velocity: number) {
  return { ...physics(spring.momentum), velocity, restDelta: 0.01, restSpeed: 0.5 };
}

export class DragRotate {
  yaw = 0;
  pitch = 0;
  private pointerId: number | null = null;
  private start = { x: 0, y: 0, yaw: 0, pitchRaw: 0 };
  private yawVel = new VelocityTracker();
  private pitchVel = new VelocityTracker();
  private flights: Playback[] = [];

  constructor(private el: HTMLElement, private opts: DragRotateOptions) {
    el.addEventListener('pointerdown', this.onDown);
    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerup', this.onUp);
    el.addEventListener('pointercancel', this.onCancel);
    el.addEventListener('lostpointercapture', this.onCancel);
    el.addEventListener('keydown', this.onKey);
  }

  /** Stops any momentum flight where it is (its last rendered value stays). */
  stop(): void {
    for (const f of this.flights) f.stop();
    this.flights = [];
  }

  destroy(): void {
    this.stop();
    this.el.removeEventListener('pointerdown', this.onDown);
    this.el.removeEventListener('pointermove', this.onMove);
    this.el.removeEventListener('pointerup', this.onUp);
    this.el.removeEventListener('pointercancel', this.onCancel);
    this.el.removeEventListener('lostpointercapture', this.onCancel);
    this.el.removeEventListener('keydown', this.onKey);
  }

  private onDown = (e: PointerEvent) => {
    // One pointer at a time: a second finger must not make the molecule jump to it.
    if (this.pointerId !== null || !e.isPrimary || e.button !== 0) return;
    this.stop();
    this.pointerId = e.pointerId;
    this.el.setPointerCapture(e.pointerId);
    this.el.toggleAttribute('data-dragging', true);
    this.start = { x: e.clientX, y: e.clientY, yaw: this.yaw, pitchRaw: unband(this.pitch) };
    this.yawVel.reset();
    this.pitchVel.reset();
    this.sample(e.timeStamp);
  };

  private onMove = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) return;
    const k = this.opts.degPerPx();
    this.yaw = this.start.yaw + (e.clientX - this.start.x) * k;
    this.pitch = band(this.start.pitchRaw + (e.clientY - this.start.y) * k);
    this.sample(e.timeStamp);
    this.opts.onChange();
  };

  private onUp = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) return;
    // A pointer that stopped before letting go has no recent move events: sample the release itself.
    this.sample(e.timeStamp);
    this.end(true);
  };

  /** The browser took the gesture (a vertical pan on touch) or capture was lost: settle without a throw. */
  private onCancel = (e: PointerEvent) => {
    if (e.pointerId !== this.pointerId) return;
    this.end(false);
  };

  private end(withMomentum: boolean) {
    if (this.pointerId !== null && this.el.hasPointerCapture(this.pointerId)) this.el.releasePointerCapture(this.pointerId);
    this.pointerId = null;
    this.el.removeAttribute('data-dragging');
    const vYaw = withMomentum ? this.yawVel.velocity() : 0;
    const vPitch = withMomentum ? this.pitchVel.velocity() : 0;
    if (this.opts.reduced()) {
      this.pitch = clampPitch(this.pitch);
      this.opts.onChange();
      return;
    }
    this.fly('yaw', throwTarget('yaw', this.yaw, vYaw), vYaw);
    this.fly('pitch', throwTarget('pitch', this.pitch, vPitch), vPitch);
  }

  private fly(axis: 'yaw' | 'pitch', target: number, velocity: number) {
    const from = this[axis];
    if (Math.abs(target - from) < 0.01 && Math.abs(velocity) < 1) return;
    // Pitch springs on the displayed scale, from where it shows and at the speed it showed, so the release carries
    // over exactly. Travel past the limit is shown through the rubber band, so an overshoot stretches softly
    // instead of showing as a hard overshoot. On the release side the band starts at the release point when that
    // is already beyond 60° (the way back to it is 1:1); on the far side it starts at the limit itself. (Springing
    // on the raw finger scale instead would amplify an inward flick released deep in the band once it crosses
    // back inside 60°.)
    const reach = Math.max(PITCH_LIMIT, Math.abs(from));
    const shown = (v: number) => band(v, Math.sign(v) === Math.sign(from) ? reach : PITCH_LIMIT);
    this.flights.push(animate(from, target, {
      ...momentumSpring(velocity),
      onUpdate: (v: number) => {
        this[axis] = axis === 'pitch' ? shown(v) : v;
        this.opts.onChange();
      },
    }));
  }

  private onKey = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const turn: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0], ArrowRight: [KEY_STEP, 0], ArrowUp: [0, -KEY_STEP], ArrowDown: [0, KEY_STEP],
    };
    const step = turn[e.key];
    if (!step) return;
    e.preventDefault(); // the arrows turn the molecule instead of scrolling the page
    this.stop();
    this.yaw += step[0];
    this.pitch = clampPitch(this.pitch + step[1]);
    this.opts.onChange();
  };

  private sample(t: number) {
    this.yawVel.add(t, this.yaw);
    this.pitchVel.add(t, this.pitch);
  }
}
