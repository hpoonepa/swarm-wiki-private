/**
 * Gesture math shared by every drag interaction (sheets, the capsid drag).
 * Pure functions, no DOM: velocity in px/s, distances in px.
 */

/**
 * Apple's momentum projection (Designing Fluid Interfaces): how far a release at `velocity`
 * travels before it comes to rest. Snap targets are chosen from `position + project(velocity)`,
 * so a short fast flick commits and a long slow drag does not.
 */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary: the further the overshoot, the less the element follows. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (dimension <= 0) return 0;
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** The point closest to `value`; the first one wins a tie. */
export function nearest(points: readonly number[], value: number): number {
  if (points.length === 0) throw new Error('nearest(): empty points');
  let best = points[0];
  for (const p of points) if (Math.abs(p - value) < Math.abs(best - value)) best = p;
  return best;
}

/**
 * Release velocity from the last `windowMs` of samples (event timestamps in ms, positions in px).
 * Add a sample at release time before reading `velocity()`: a pointer that stopped and then let go
 * produces no move events, and without that sample its old velocity would still be reported.
 */
export class VelocityTracker {
  private samples: { t: number; v: number }[] = [];
  constructor(private windowMs = 100) {}
  add(t: number, value: number): void {
    this.samples.push({ t, v: value });
    const cutoff = t - this.windowMs;
    while (this.samples.length > 2 && this.samples[0].t < cutoff) this.samples.shift();
  }
  velocity(): number {
    if (this.samples.length < 2) return 0;
    const a = this.samples[0], b = this.samples[this.samples.length - 1];
    const dt = b.t - a.t;
    return dt > 0 ? ((b.v - a.v) / dt) * 1000 : 0;
  }
  reset(): void { this.samples = []; }
}
