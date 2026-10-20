import { clamp, smooth, span, mix, TAU, RAD, FOG } from './dwv-paper.js?v=2603809d7ca4';
import { buildBee, SEGMENTS, SEGMENT_SCALE } from './dwv-bee.js?v=9f771abd6143';
import { buildMite } from './dwv-mite.js?v=c2086c497fb0';
import { buildGround } from './dwv-ground.js?v=c42f92b1da04';
import { BEATS, targetBeat, createTimeline } from './dwv-clips.js?v=b3fab3b0f804';

const SHOTS = {
  wide: {
    bee: { at: [4.17, 1.75, .14], r: 10.2, az: -26, el: 15, sx: .675, sy: .58 },
    mite: { at: [.6, .75, 0], r: 8.97, az: -14, el: 19, sx: .389, sy: .528 },
    wings: { at: [0, .6, 0], r: 8.16, az: -22, el: 21, sx: .505, sy: .685 }
  },
  narrow: {
    bee: { at: [4.45, 1.7, .3], r: 19, az: -26, el: 15, sx: .538, sy: .668 },
    mite: { at: [.5, .7, 0], r: 16.93, az: -14, el: 19, sx: .607, sy: .652 },
    wings: { at: [.1, .6, 0], r: 15.68, az: -22, el: 21, sx: .52, sy: .647 }
  }
};
const SHOT_KEYS = ['x', 'y', 'z', 'r', 'az', 'el', 'sx', 'sy'], CAMERA_SPEED = 8;
const HOVER = 1.6, PERCH = [4.2, HOVER, .3], LANDING = [0, HOVER, 0], LEFT = -90 * RAD;
const offset = list => list.map(([x, y, z]) => [PERCH[0] + x, PERCH[1] + y, PERCH[2] + z]);
const ENTRY = offset([[9, -.7, -5], [5.6, -.4, -2.6], [2.6, -.1, -.6], [.9, .02, .1], [0, 0, 0]]);
const EXIT = offset([[0, 0, 0], [1.6, -.1, -.4], [4.6, -.25, -1.8], [9.5, -.35, -4]]);
const turn = (a, b, t) => a + (((b - a + Math.PI) % TAU + TAU) % TAU - Math.PI) * t;
const near = (angle, ref) => ref + (((angle - ref + Math.PI) % TAU + TAU) % TAU - Math.PI);
const flat = s => [...s.at, s.r, s.az, s.el, s.sx, s.sy];
const heading = v => Math.atan2(v.x, v.z);

export function mountDwvScene(root, onView = () => {}) {
  const T = window.THREE;
  const canvas = root.querySelector('.dwv-gl');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const timeline = createTimeline();
  let renderer = null;
  try { renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch {}
  const scene = new T.Scene();
  scene.fog = new T.Fog(FOG.color, FOG.near.value, FOG.far.value);
  const camera = new T.PerspectiveCamera(30, 1, .1, 90);
  const ground = buildGround(T, scene);
  const bee = buildBee(T);
  scene.add(bee.root);
  const mite = buildMite(T, scene, { segments: SEGMENTS, scale: SEGMENT_SCALE });
  bee.stance('dangle', 'stand', 1);
  bee.root.position.set(LANDING[0], bee.restHeight('stand'), LANDING[2]);
  bee.root.rotation.set(0, LEFT, 0, 'YXZ');
  bee.body.rotation.x = 2 * RAD;
  bee.root.updateMatrixWorld(true);
  const anchor = bee.body.matrixWorld.clone();
  const curve = list => new T.CatmullRomCurve3(list.map(p => new T.Vector3(...p)), false, 'centripetal');
  const entry = curve(ENTRY), exit = curve(EXIT);

  let width = 1, height = 1, narrow = false, d = 0, compare = 0, visible = false, inView = true, target = 0;
  let frame = 0, previous = 0, clock = 0, frameDt = 0, pointerAt = -1e9, fade = 0, cruising = 0, primed = false, ready = 1, miteBusy = false;
  let state = timeline.tick(0, 0, reduced.matches);
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  const cam = Object.fromEntries(SHOT_KEYS.map(key => [key, { v: 0, w: 0 }]));
  const follow = Object.fromEntries(['x', 'y', 'z', 'yaw', 'pitch'].map(key => [key, { v: 0, w: 0 }]));
  const v3 = new T.Vector3(), gaze = new T.Vector3(), focus = new T.Vector3(), place = new T.Vector3(), tangent = new T.Vector3(), lastCam = new T.Vector3();

  function settle(s, goal, rate, dt) {
    const x = s.v - goal, k = s.w + rate * x, e = Math.exp(-rate * dt);
    s.v = goal + (x + k * dt) * e;
    s.w = (s.w - rate * k * dt) * e;
  }
  function shotValues() {
    const s = SHOTS[narrow ? 'narrow' : 'wide'], go = state.dm < 0 ? span(state.m, .03, .3) : span(state.m, 0, .2), fall = state.dw < 0 ? span(state.w, .55, 1) : span(state.w, 0, .3);
    const a = flat(s.bee), b = flat(s.mite), c = flat(s.wings);
    const values = a.map((v, i) => mix(mix(v, b[i], go), c[i], fall));
    if (!narrow) values[3] *= Math.max(1, Math.pow(1.6 / camera.aspect, .8));
    return values;
  }
  function pose(t, still) {
    const { a, m, w, da, dm, dw } = state;
    const leaving = da < 0 && a < 1;
    const settledIn = leaving ? 1 - span(1 - a, 0, .35) : span(a, .7, 1);
    let yaw;
    if (leaving) {
      const e = 1 - a, k = e * e;
      exit.getPointAt(k, place);
      exit.getTangentAt(Math.min(.999, Math.max(.001, k)), tangent);
      yaw = turn(LEFT, heading(tangent), span(e, 0, .35));
    } else {
      const k = 1 - (1 - a) ** 2;
      entry.getPointAt(k, place);
      entry.getTangentAt(Math.min(.999, k), tangent);
      yaw = turn(heading(tangent), LEFT, settledIn);
    }
    const shift = span(m, 0, .22), arc = Math.sin(Math.PI * shift), land = span(m, .18, .32);
    if (m > 0) {
      place.x = mix(place.x, LANDING[0], shift);
      place.y = mix(place.y, LANDING[1], shift) + .4 * arc;
      place.z = mix(place.z, LANDING[2], shift) - .5 * arc;
      const back = dm < 0 ? Math.PI * (span(1 - shift, 0, .25) - span(1 - shift, .75, 1)) : 0;
      yaw = turn(yaw, LEFT + back, smooth(Math.min(1, m / .05)));
    }
    const sev = span(w, .05, .45), attempt = dw >= 0 ? Math.sin(Math.PI * span(w, .5, .78)) : 0, slump = span(w, .78, 1);
    cruising = Math.max(1 - settledIn, arc);
    const hover = (1 - land) * settledIn * (still ? 0 : 1);
    const bob = .045 * Math.sin(t * TAU * .5) * hover;
    const rest = mix(bee.restHeight('stand'), bee.restHeight('slump'), slump);
    const grounded = Math.max(land, slump);
    return {
      x: place.x, y: mix(place.y, rest, grounded) + .08 * attempt * (1 - slump), z: place.z,
      yaw: yaw + 8 * slump * RAD, pitch: (mix(mix(-4, -14, cruising), 2, land) - 4 * slump) * RAD,
      bob, hover, land, slump, sev, attempt,
      flutter: still ? 0 : Math.min(1, a * 3) * (1 - land) * (1 - sev),
      fold: clamp(Math.max(land, sev) * (1 - .3 * attempt))
    };
  }
  function placeBee(t, dt, still, snap) {
    const p = pose(t, still);
    const goals = { x: p.x, y: p.y, z: p.z, yaw: near(p.yaw, follow.yaw.v), pitch: p.pitch };
    for (const key in goals) {
      if (snap) { follow[key].v = goals[key]; follow[key].w = 0; }
      else settle(follow[key], goals[key], 10, dt);
    }
    const roll = still ? 0 : Math.max(-.6, Math.min(.6, -follow.yaw.w * .11)) * cruising;
    const sway = p.hover;
    bee.root.position.set(follow.x.v + .035 * Math.sin(t * TAU * .23) * sway, follow.y.v + p.bob, follow.z.v);
    bee.root.rotation.set(0, follow.yaw.v + 4 * Math.sin(t * TAU * .19) * sway * RAD, roll + (2.2 * Math.sin(t * TAU * .27) * sway + 15 * p.slump) * RAD, 'YXZ');
    bee.body.rotation.x = follow.pitch.v + 1.8 * Math.sin(t * TAU * .43) * sway * RAD;
    if (p.slump > 0) bee.stance('stand', 'slump', p.slump); else bee.stance('dangle', 'stand', p.land);
    bee.root.updateMatrixWorld(true);
    bee.wings({ t, pose: p.fold, flutter: p.flutter, boost: still ? 0 : p.attempt * (1 - p.sev * .6), sev: p.sev });
    bee.antennaSway(t, still ? 0 : 1);
    const lift = clamp((bee.root.position.y - .6) / 1.8);
    ground.shadow(bee.root.position.x, bee.root.position.z, bee.root.rotation.y, lift, smooth(clamp(state.a * 1.4 - .2)));
  }
  function render(dt, snap) {
    const t = clock, still = reduced.matches;
    placeBee(t, dt, still, snap);
    const goal = shotValues();
    const crossing = state.m > 0 && state.m < .4 ? 9 : 5.5;
    SHOT_KEYS.forEach((key, i) => { if (snap) { cam[key].v = goal[i]; cam[key].w = 0; } else settle(cam[key], goal[i], crossing, dt); });
    const err = Math.hypot(cam.x.v - goal[0], cam.y.v - goal[1], cam.z.v - goal[2]) + .5 * Math.abs(cam.r.v - goal[3]) + 4 * (Math.abs(cam.sx.v - goal[6]) + Math.abs(cam.sy.v - goal[7]));
    ready = snap ? 1 : 1 - span(err, .04, .3);
    const values = Object.fromEntries(SHOT_KEYS.map(key => [key, cam[key].v]));
    const az = (values.az + (still ? 0 : 1.1 * Math.sin(t * TAU * .06)) + pointer.x * 4) * RAD;
    const el = (values.el + (still ? 0 : .7 * Math.sin(t * TAU * .08 + 1)) - pointer.y * 2.2) * RAD;
    focus.set(values.x + .35 * cruising * (follow.x.v - PERCH[0]) / 9 * (1 - span(state.m, 0, .2)), values.y, values.z);
    camera.position.set(focus.x + values.r * Math.cos(el) * Math.sin(az), focus.y + values.r * Math.sin(el), focus.z + values.r * Math.cos(el) * Math.cos(az));
    if (!snap && lastCam.distanceTo(camera.position) > CAMERA_SPEED * dt) camera.position.sub(lastCam).setLength(CAMERA_SPEED * dt).add(lastCam);
    lastCam.copy(camera.position);
    camera.lookAt(focus);
    scene.fog.near = FOG.near.value = values.r + 4;
    scene.fog.far = FOG.far.value = values.r + 22;
    camera.setViewOffset(width, height, (.5 - values.sx) * width, (.5 - values.sy) * height, width, height);
    camera.updateMatrixWorld();
    if (performance.now() - pointerAt < 5000 && cruising < .1) {
      const rect = canvas.getBoundingClientRect();
      v3.set((pointer.cx - rect.left) / rect.width * 2 - 1, -((pointer.cy - rect.top) / rect.height) * 2 + 1, .5).unproject(camera).sub(camera.position).normalize();
      gaze.copy(camera.position).addScaledVector(v3, camera.position.distanceTo(bee.root.position) * .35);
    } else gaze.copy(camera.position);
    bee.look(gaze, camera, still || snap ? 1 : 1 - Math.exp(-dt * 6));
    const contact = mite.update({ t, dt, still, snap, m: clamp((state.m - .15) / .85), leaving: state.dm < 0, body: bee.body, anchor });
    ground.mite(contact);
    miteBusy = contact.busy;
    renderer.render(scene, camera);
  }
  function view() {
    onView({
      beat: BEATS[state.beat],
      captions: Object.fromEntries(BEATS.map((name, i) => [name, state.captions[i] * (i && i < 3 ? ready : 1)])),
      opacity: Math.max(compare, fade)
    });
  }
  function advance(dt) {
    state = timeline.tick(dt, target, reduced.matches);
    fade = reduced.matches ? +(target >= 1) : clamp(fade + (target >= 1 ? dt : -dt) / .3);
  }
  function shown() { return visible || fade > .002; }
  function drawable() { return renderer && shown() && inView && !document.hidden; }
  function busy() { return !state.settled || fade !== +(target >= 1); }
  function moving() {
    if (reduced.matches) return false;
    const springs = SHOT_KEYS.some(key => Math.abs(cam[key].w) > 1e-3) || Object.values(follow).some(f => Math.abs(f.w) > 1e-3);
    return (state.a > 0 && state.m < .32) || springs || miteBusy || ready < 1;
  }
  function loop(now) {
    frame = 0;
    if (document.hidden) return;
    frameDt = Math.max(0, Math.min(.05, (now - previous) / 1000));
    previous = now;
    clock += frameDt;
    advance(frameDt);
    if (drawable()) { render(frameDt, !primed || reduced.matches); primed = true; }
    else if (!shown()) primed = false;
    view();
    if (drawable() && (moving() || performance.now() - pointerAt < 600) || busy()) frame = requestAnimationFrame(loop);
  }
  function kick() {
    if (!frame && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(loop); }
  }
  function resize() {
    width = root.clientWidth || 1; height = root.clientHeight || 1;
    if (narrow !== (narrow = width <= 760)) { ready = 0; view(); }
    if (renderer) {
      renderer.setPixelRatio(Math.min(narrow ? 1.5 : 2, devicePixelRatio || 1));
      renderer.setSize(width, height, false);
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    bee.detail(narrow);
    mite.detail(narrow);
    kick();
  }
  addEventListener('pointermove', event => {
    pointer.cx = event.clientX; pointer.cy = event.clientY;
    pointer.x = clamp(event.clientX / innerWidth) * 2 - 1; pointer.y = clamp(event.clientY / innerHeight) * 2 - 1;
    pointerAt = performance.now();
    if (drawable()) kick();
  }, { passive: true });
  document.addEventListener('visibilitychange', kick);
  new ResizeObserver(resize).observe(root);
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; kick(); }).observe(root);
  reduced.addEventListener('change', () => { primed = false; kick(); });
  resize();
  if (renderer) renderer.compile(scene, camera);
  return {
    update(progress, nextCompare, nextVisible, goal = progress) {
      d = progress; compare = nextCompare; visible = nextVisible;
      target = targetBeat(goal, target);
      if (!frame) view();
      kick();
    }
  };
}
