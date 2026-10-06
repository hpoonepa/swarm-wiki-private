/**
 * House springs (spec §7.1), in Motion's Apple-style form. `duration` is in seconds, as animate() takes it.
 *
 * Motion 13 ignores `velocity` on duration/bounce springs (getSpringOptions zeroes it), so
 * `{ ...spring.sheet, velocity }` silently loses a gesture's release velocity. For a velocity
 * handoff, spread `physics(config)` and add `velocity` (px/s or units/s of the animated value):
 *   animate(from, to, { ...physics(spring.momentum), velocity })
 */
export const spring = {
  default: { type: 'spring', bounce: 0, duration: 0.4 },
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 },
  sheet: { type: 'spring', bounce: 0.2, duration: 0.3 },
} as const;

export interface SpringConfig { readonly type: 'spring'; readonly bounce: number; readonly duration: number }
export interface PhysicalSpring { type: 'spring'; stiffness: number; damping: number; mass: number }

const SAFE_MIN = 0.001;

/**
 * `config` as stiffness/damping/mass. At zero velocity the curve is the one Motion draws for `config`:
 * this is Motion's own duration solver (findSpring in motion-dom), run at zero velocity. Unlike the
 * duration/bounce form, Motion honors `velocity` with these parameters, including on retarget.
 */
export function physics(config: SpringConfig): PhysicalSpring {
  const zeta = Math.min(1, Math.max(0.05, 1 - config.bounce));
  const d = Math.min(10, Math.max(0.01, config.duration));
  let envelope: (w: number) => number;
  let derivative: (w: number) => number;
  if (zeta < 1) {
    const k = zeta / Math.sqrt(1 - zeta * zeta);
    envelope = (w) => SAFE_MIN - k * Math.exp(-w * zeta * d);
    derivative = (w) => k * zeta * d * Math.exp(-w * zeta * d);
  } else {
    envelope = (w) => Math.exp(-w * d) * (w * d + 1) - SAFE_MIN;
    derivative = (w) => -w * d * d * Math.exp(-w * d);
  }
  let w = 5 / d;
  for (let i = 1; i < 12; i++) w -= envelope(w) / derivative(w);
  if (Number.isNaN(w)) return { type: 'spring', stiffness: 100, damping: 10, mass: 1 };
  const stiffness = w * w;
  return { type: 'spring', stiffness, damping: zeta * 2 * Math.sqrt(stiffness), mass: 1 };
}
