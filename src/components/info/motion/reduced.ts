const QUERY = '(prefers-reduced-motion: reduce)';

/** True when the user asked the system to reduce motion. False outside a browser. */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia(QUERY).matches;
}

/** Calls `cb` whenever the reduced-motion preference changes. Returns the unsubscribe function. */
export function onReducedMotionChange(cb: (reduced: boolean) => void): () => void {
  if (typeof matchMedia !== 'function') return () => {};
  const mql = matchMedia(QUERY);
  const listener = (e: MediaQueryListEvent) => cb(e.matches);
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}
