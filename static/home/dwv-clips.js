export const BEATS = ['virus', 'bee', 'mite', 'wings'];
export const CLIP = { a: [1.2, .8], m: [2.5, 1.4], w: [2, .6] };
export const CATCHUP = .4, CHAIN = .9, FADE_OUT = .15, FADE_IN = .2, MITE_CAPTION = .2;
const BOUNDS = [.35, .51, .75], KEYS = ['a', 'm', 'w'], EASE = .08;

export function targetBeat(d, previous) {
  let beat = 0;
  BOUNDS.forEach((at, i) => { if (d >= at + (previous > i ? -.01 : .01)) beat = i + 1; });
  return beat;
}

export function createTimeline() {
  const v = { a: 0, m: 0, w: 0 }, dir = { a: 1, m: 1, w: 1 }, rate = { a: 0, m: 0, w: 0 };
  const captions = [1, 0, 0, 0];
  let beat = 0, chain = null, catchup = null, aimed = 0;

  const goals = target => ({ a: +(target >= 1), m: +(target >= 2), w: +(target >= 3) });

  function plan(target, g) {
    const pos = v.a + v.m + v.w;
    if (target - Math.ceil(pos - 1e-9) >= 2 || Math.floor(pos + 1e-9) - target >= 2) {
      chain = { target, rate: Object.fromEntries(KEYS.map(k => [k, (g[k] - v[k]) / CHAIN])) };
    } else chain = null;
    catchup = null;
  }

  function advance(dt, target) {
    const g = goals(target);
    if (target !== aimed) { plan(target, g); aimed = target; }
    if (chain) {
      for (const k of KEYS) rate[k] = v[k] === g[k] ? 0 : chain.rate[k];
      if (KEYS.every(k => v[k] === g[k])) chain = null;
      return g;
    }
    const pos = v.a + v.m + v.w;
    for (const k of KEYS) rate[k] = k === active(g, pos < target) ? rate[k] : 0;
    const k = active(g, pos < target);
    if (!k) { catchup = null; return g; }
    let desired;
    if (pos < target) {
      const base = 1 / CLIP[k][0], toward = KEYS.indexOf(k) + 1;
      if (target > toward) {
        if (!catchup || catchup.key !== k) catchup = { key: k, rate: Math.max(base, (1 - v[k]) / (CATCHUP - EASE)) };
        desired = catchup.rate;
      } else { catchup = null; desired = base; }
    } else { catchup = null; desired = -1 / CLIP[k][1]; }
    rate[k] = rate[k] !== 0 && Math.sign(rate[k]) === Math.sign(desired) && Math.abs(desired) > Math.abs(rate[k])
      ? rate[k] + (desired - rate[k]) * (1 - Math.exp(-dt / EASE))
      : desired;
    return g;
  }

  function active(g, forward) {
    if (forward) return KEYS.find(k => v[k] < g[k]);
    return [...KEYS].reverse().find(k => v[k] > g[k]);
  }

  function fade(dt, target, reduced) {
    const hold = (target === 0 && v.a > .02) || (target === 1 && dir.m < 0 && v.m > .02) || (target === 2 && ((dir.m >= 0 && v.m < MITE_CAPTION) || (dir.w < 0 && v.w > 0))) || (target === 3 && v.m < .32);
    const wanted = !reduced && hold ? -1 : target;
    if (reduced) { captions.fill(0); captions[target] = 1; beat = target; return; }
    let others = 0;
    captions.forEach((c, i) => { if (i !== wanted) { captions[i] = Math.max(0, c - dt / FADE_OUT); others += captions[i]; } });
    if (wanted >= 0 && others === 0) { captions[wanted] = Math.min(1, captions[wanted] + dt / FADE_IN); beat = wanted; }
  }

  function tick(dt, target, reduced) {
    dt = Math.min(Math.max(dt, 0), .05);
    if (reduced) {
      const g = goals(target);
      for (const k of KEYS) { if (v[k] !== g[k]) dir[k] = Math.sign(g[k] - v[k]); v[k] = g[k]; rate[k] = 0; }
      chain = catchup = null; aimed = target;
    } else {
      const g = advance(dt, target);
      for (const k of KEYS) {
        if (!rate[k]) continue;
        const next = rate[k] > 0 ? Math.min(g[k], v[k] + rate[k] * dt) : Math.max(g[k], v[k] + rate[k] * dt);
        if (next !== v[k]) dir[k] = Math.sign(next - v[k]);
        v[k] = next;
        if (v[k] === g[k]) rate[k] = 0;
      }
    }
    fade(dt, target, reduced);
    const g = goals(target);
    return {
      a: v.a, m: v.m, w: v.w, da: dir.a, dm: dir.m, dw: dir.w,
      captions: [...captions], beat,
      settled: KEYS.every(k => v[k] === g[k]) && captions.every((c, i) => c === (i === target ? 1 : 0))
    };
  }

  return { tick };
}
