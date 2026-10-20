import { clamp, smooth, span, mix, TAU, RAD, paper } from './dwv-paper.js?v=2603809d7ca4';

const L = .38, W = .54, H = .105, SCALE = .74, RX = .47 / SCALE, RZ = .62 / SCALE, LIFT = .066, BASE = LIFT + .016, PAD = .01;
const SHELL = ['#603A33', '#4D2E27', '#3A211C', '#81544B'];
const COXA = [[.05, .12], [.08, .095], [.1, .06], [.11, .025]];
const REST = [[.2, .3], [.31, .15], [.34, .03], [.3, -.09]];
const TARSUS = [[.05, -25], [.04, -60], [.04, -60], [.044, -60]];
const OFFSET = [.25, 0, .5, 0], HAND = [0, .15, .3, .45];
const RADII = [.017, .016, .014, .012, .01];
const PATH = [[4.2, -6], [2.9, -4.34], [1.3, -2.3], [.95, -1.97], [.68, -1.66], [.43, -1.42]];
const STRIDE = .2, DUTY = .6, STEPS = 8, SITE = 105 * RAD, MARK = [.085, .036], SLOW = 1.1, PACE = [.05, .2, .3, .78], CA = .3, REAR = 55 * RAD, ARC = 48;
const WALK = [0, .42], TAP = [.38, .45], CLIMB = [.44, .92], PRESS = [.92, .955], FEED = [.955, .99], SIDES = [1, -1];
const arch = (x, z) => x * x / (2 * RX) + z * z / (2 * RZ);
const ease = c => { const v = 1 / (1 - CA), k = clamp(c); return k < CA ? v * k * k / (2 * CA) : k < 1 - CA ? v * (k - CA / 2) : 1 - v * (1 - k) ** 2 / (2 * CA); };

function outline(th) {
  const s = Math.sin(th);
  return [W / 2 * Math.cos(th), L / 2 * s * (s > 0 ? .9 : 1) + .012 * Math.cos(2 * th)];
}
function dome(r) {
  const y = k => .022 + H * Math.pow(Math.max(0, 1 - k * k), .62);
  if (r <= .93) return y(r);
  const k = (r - .93) / .07;
  return mix(y(.93), .016, k * k * (3 - 2 * k));
}
const shell = (r, th) => { const [ox, oz] = outline(th), x = r * ox, z = r * oz - .015 * (1 - r * r); return [x, LIFT + dome(r) - arch(x, z), z]; };
const belly = (r, th) => { const [ox, oz] = outline(th), x = .97 * r * ox, z = .97 * r * oz - .015 * (1 - r * r); return [x, BASE - arch(x, z), z]; };

function geometry(T, pos, index) {
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

function grid(T, r0, r1, rings, segs, at, down) {
  const pos = [], index = [], pole = r0 === 0, first = pole ? 1 : 0;
  if (pole) pos.push(...at(0, 0));
  for (let j = first; j <= rings; j++) for (let i = 0; i < segs; i++) pos.push(...at(mix(r0, r1, j / rings), TAU * i / segs));
  const ring = j => pole ? 1 + (j - 1) * segs : j * segs;
  for (let i = 0; i < segs; i++) {
    const n = (i + 1) % segs;
    if (pole) down ? index.push(0, ring(1) + i, ring(1) + n) : index.push(0, ring(1) + n, ring(1) + i);
    for (let j = first; j < rings; j++) {
      const a = ring(j) + i, b = ring(j) + n, c = ring(j + 1) + i, d = ring(j + 1) + n;
      down ? index.push(a, c, b, b, c, d) : index.push(a, b, c, b, d, c);
    }
  }
  return geometry(T, pos, index);
}

function fans(T, list, y) {
  const pos = [], index = [];
  for (const [cx, cz, rx, rz, n, a0] of list) {
    const c = pos.length / 3;
    pos.push(cx, y - arch(cx, cz), cz);
    for (let i = 0; i < n; i++) { const a = a0 + TAU * i / n, x = cx + rx * Math.cos(a), z = cz + rz * Math.sin(a); pos.push(x, y - arch(x, z), z); }
    for (let i = 0; i < n; i++) index.push(c, c + 1 + i, c + 1 + (i + 1) % n);
  }
  return geometry(T, pos, index);
}

function frame(T, r, th) {
  const p = new T.Vector3(...shell(r, th));
  const du = new T.Vector3(...shell(Math.min(1, r + .01), th)).sub(new T.Vector3(...shell(Math.max(0, r - .01), th))).normalize();
  const dv = new T.Vector3(...shell(r, th + .01)).sub(new T.Vector3(...shell(r, th - .01))).normalize();
  return { p, n: new T.Vector3().crossVectors(dv, du).normalize(), du };
}

function spots(T) {
  const pos = [], index = [];
  for (const [r, th, size] of [[.42, 118, .028], [.3, 95, .022], [.48, 80, .02]]) {
    const { p, n, du } = frame(T, r, th * RAD), t2 = new T.Vector3().crossVectors(n, du), c = pos.length / 3;
    p.addScaledVector(n, .002);
    pos.push(p.x, p.y, p.z);
    for (let i = 0; i < 20; i++) {
      const a = TAU * i / 20, q = p.clone().addScaledVector(du, size * 1.25 * Math.cos(a)).addScaledVector(t2, size * .8 * Math.sin(a));
      pos.push(q.x, q.y, q.z);
      index.push(c, c + 1 + i, c + 1 + (i + 1) % 20);
    }
  }
  return geometry(T, pos, index);
}

export function buildMite(T, scene, { segments, scale }) {
  const root = new T.Group();
  root.matrixAutoUpdate = false;
  root.visible = false;
  scene.add(root);
  const rim = paper(T, ['#4D2E27', '#3A211C', '#2A1712', '#603A33']);
  rim.polygonOffset = true; rim.polygonOffsetFactor = -2; rim.polygonOffsetUnits = -2;
  root.add(
    new T.Mesh(grid(T, 0, 1, 20, 112, shell), paper(T, SHELL)),
    new T.Mesh(grid(T, .86, 1, 4, 112, shell), rim),
    new T.Mesh(grid(T, 0, 1, 6, 56, belly, true), paper(T, ['#3A211C', '#2A1712', '#1E100C', '#4D2E27'])),
    new T.Mesh(fans(T, [[0, -.02, .055, .08, 18, 0], [0, .075, .075, .032, 16, 0], [0, -.135, .036, .036, 3, Math.PI / 2], [.13, -.07, .028, .045, 10, 0], [-.13, -.07, .028, .045, 10, 0]], BASE - .0015), new T.MeshBasicMaterial({ color: '#4D2E27', fog: true })),
    new T.Mesh(spots(T), new T.MeshBasicMaterial({ color: '#81544B', fog: true }))
  );

  const ell = segments.map(([z, y, r]) => ({ y, z, a: r * scale[0], b: r * scale[1], c: r * scale[2] }));
  const axisY = z => {
    for (let i = 1; i < ell.length; i++) if (z >= ell[i].z || i === ell.length - 1) return mix(ell[i].y, ell[i - 1].y, clamp((z - ell[i].z) / (ell[i - 1].z - ell[i].z)));
    return ell[0].y;
  };
  const grad = (e, P, out) => out.set(P.x / (e.a * e.a), (P.y - e.y) / (e.b * e.b), (P.z - e.z) / (e.c * e.c)).normalize();
  const n2 = new T.Vector3();
  function hit(th, z, P, N, soft = false) {
    const sn = Math.sin(th), cs = Math.cos(th), oy = axisY(z);
    let best = 0, w = 0, next = 0, w2 = -1;
    for (let i = 0; i < ell.length; i++) {
      const e = ell[i], dy = oy - e.y, dz = (z - e.z) / e.c;
      const A = (sn / e.a) ** 2 + (cs / e.b) ** 2, Bq = 2 * dy * cs / (e.b * e.b), C = (dy / e.b) ** 2 + dz * dz - 1, D = Bq * Bq - 4 * A * C;
      if (D < 0) continue;
      const t = (-Bq + Math.sqrt(D)) / (2 * A);
      if (t > best) { next = best; w2 = w; best = t; w = i; } else if (t > next) { next = t; w2 = i; }
    }
    P.set(sn * best, oy + cs * best, z);
    grad(ell[w], P, N);
    if (soft && w2 >= 0 && w2 !== w && best - next < .03) N.multiplyScalar(.5 + .5 * (best - next) / .03).addScaledVector(grad(ell[w2], P, n2), .5 - .5 * (best - next) / .03).normalize();
    return w;
  }
  const sp = new T.Vector3(), sn = new T.Vector3(), tp = new T.Vector3(), tn = new T.Vector3();
  const project = (p, P, N) => hit(Math.atan2(p.x, p.y - axisY(p.z)), p.z, P, N);
  const depth = p => { const oy = axisY(p.z); hit(Math.atan2(p.x, p.y - oy), p.z, tp, tn); return Math.hypot(tp.x, tp.y - oy) - Math.hypot(p.x, p.y - oy); };

  let seam = ell[2].z;
  for (let z = ell[2].z; z > ell[3].z - .2; z -= .002) if (hit(SITE, z, sp, sn) === 3) { seam = z; break; }

  const X = new T.Vector3(1, 0, 0), Y = new T.Vector3(0, 1, 0), Z = new T.Vector3(0, 0, 1);
  const m4 = new T.Matrix4(), rt = new T.Vector3(), fw = new T.Vector3(), qa = new T.Quaternion(), v = new T.Vector3();
  function basis(fwd, upv, out) {
    rt.crossVectors(upv, fwd).normalize();
    fw.crossVectors(rt, upv);
    m4.makeBasis(rt, upv, fw);
    return out.setFromRotationMatrix(m4);
  }
  const PROBES = [];
  for (const r of [0, .5, .8, 1]) for (let i = 0; i < (r ? 16 : 1); i++) PROBES.push(new T.Vector3(...belly(r, TAU * i / 16)));
  for (const r of [.6, .9, 1]) for (let i = 0; i < 16; i++) PROBES.push(new T.Vector3(...shell(r, TAU * i / 16)));
  PROBES.push(new T.Vector3(0, BASE - .02, .2));
  const RIM = PROBES.filter((_, i) => i >= 49);
  function sink(P, Q) {
    let d = -1;
    for (const p of PROBES) d = Math.max(d, depth(v.copy(p).multiplyScalar(SCALE).applyQuaternion(Q).add(P)));
    return d;
  }
  const sites = [0, 1].map(k => {
    const z = seam - .15 + .012 * k, n = new T.Vector3(), P = new T.Vector3(), Q = new T.Quaternion();
    for (const [dt, dz] of [[0, 0], [.2, 0], [-.2, 0], [0, .09], [0, -.09]]) { hit(SITE + dt, z + dz, tp, tn); n.add(tn); }
    n.normalize();
    hit(SITE, z, P, tn);
    basis(v.copy(Z).addScaledVector(n, -n.z).normalize(), n, Q);
    Q.multiply(qa.setFromAxisAngle(X, 2.5 * RAD * k));
    for (let i = 0; i < 6; i++) P.addScaledVector(n, sink(P, Q));
    P.addScaledVector(n, .002);
    return { P, Q, n };
  });
  const wound = new T.Vector3(), scar = new T.Vector3(), scarN = new T.Vector3();
  hit(SITE - 3 * RAD, seam + .03, wound, tn);
  hit(SITE - 5 * RAD, seam + .056, scar, scarN);
  const s1 = Z.clone().addScaledVector(scarN, -scarN.z).normalize(), s2 = new T.Vector3().crossVectors(s1, scarN);
  const mark = new T.Group();
  [['#E0412F', '#C7372A', '#A82D24', '#F2705C'], ['#9E1620', '#82111A', '#650C14', '#B8262D']].forEach((tones, i) => {
    const material = paper(T, tones);
    material.side = T.DoubleSide; material.polygonOffset = true; material.polygonOffsetFactor = material.polygonOffsetUnits = -2 - 2 * i;
    mark.add(new T.Mesh(grid(T, 0, 1, 6, 40, (r, th) => {
      const k = MARK[i] * r * (1 + .07 * Math.sin(3 * th + .7 + i) + .04 * Math.sin(5 * th + 2));
      project(v.copy(scar).addScaledVector(s1, Math.cos(th) * k * .9).addScaledVector(s2, Math.sin(th) * k * 1.12), tp, tn);
      return tp.addScaledVector(tn, .0015 * (i + 1)).sub(scar).toArray();
    }), material));
  });
  mark.matrixAutoUpdate = false;
  mark.visible = false;
  scene.add(mark);

  const curve = new T.CatmullRomCurve3(PATH.map(([x, z]) => new T.Vector3(x, 0, z)), false, 'centripetal');
  const N = 600, track = curve.getSpacedPoints(N), trackLen = curve.getLength();
  const [P1, P2, P3, P4] = PACE, head = P1 / 2 + P2 - P1 + (P3 - P2) / 2, tail = (P3 - P2) / 2 + P4 - P3 + (1 - P4) / 2, f = 1 - SLOW / trackLen;
  const fast = (f * tail - (P3 - P2) / 2) / (head * (1 - f)), total = head * fast + tail;
  const pace = w => w < P1 ? fast * smooth(w / P1) : w < P2 ? fast : w < P3 ? mix(fast, 1, smooth((w - P2) / (P3 - P2))) : w < P4 ? 1 : 1 - smooth((w - P4) / (1 - P4));
  const prof = new Float32Array(513);
  for (let i = 1; i <= 512; i++) prof[i] = prof[i - 1] + (pace((i - .5) / 512) / 512) / total;
  const travel = w => { const x = clamp(w) * 512, i = Math.min(511, Math.floor(x)); return mix(prof[i], prof[i + 1], x - i) / prof[512]; };
  const heading = track.map((_, i) => new T.Vector3().subVectors(track[Math.min(N, i + 1)], track[Math.max(0, i - 1)]).normalize());

  const legMat = paper(T, ['#4D2E27', '#3A211C', '#2A1712', '#603A33']);
  const legs = new T.InstancedMesh(new T.CylinderGeometry(.8, 1, 1, 8, 1), legMat, 8 * 6 + 2);
  const knees = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), legMat, 8 * 6 + 2);
  knees.instanceMatrix.setUsage(T.DynamicDrawUsage);
  knees.frustumCulled = false;
  root.add(knees);
  legs.instanceMatrix.setUsage(T.DynamicDrawUsage);
  legs.frustumCulled = false;
  root.add(legs);
  const limbs = [];
  for (let row = 0; row < 4; row++) for (const side of SIDES) {
    const [cx, cz] = COXA[row], [t, pitch] = TARSUS[row], tp = pitch * RAD;
    const C = new T.Vector3(side * cx, BASE + .006 - arch(cx, cz), cz), rest = new T.Vector3(side * REST[row][0], 0, REST[row][1]);
    const h = new T.Vector3(rest.x - C.x, 0, rest.z - C.z).normalize();
    const ankle = rest.clone().addScaledVector(h, -t * Math.cos(tp)).setY(-t * Math.sin(tp)), reach = ankle.distanceTo(C);
    limbs.push({ row, side, C, rest, t, ct: Math.cos(tp), st: Math.sin(tp), a: .62 * reach, b: .56 * reach, lim: (.92 * 1.18 * reach + .6 * t) * SCALE, grip: new T.Vector3(side * REST[row][0] * .9, 0, REST[row][1] * .9), off: (OFFSET[row] + (side > 0 ? 0 : .5)) % 1, foot: new T.Vector3(), n: new T.Vector3(0, 1, 0) });
  }

  const PIVOT = new T.Vector3(0, 0, -.18);
  const B = new T.Matrix4(), G = new T.Matrix4(), Binv = new T.Matrix4(), inv = new T.Matrix4(), bp = new T.Vector3(), bq = new T.Quaternion(), bs = new T.Vector3();
  const P = new T.Vector3(), Q = new T.Quaternion(), P0 = new T.Vector3(), Q0 = new T.Quaternion(), PS = new T.Vector3(), QS = new T.Quaternion(), QM = new T.Quaternion(), q1 = new T.Quaternion(), q2 = new T.Quaternion();
  const A0 = new T.Vector3(), nOut = new T.Vector3(), cp = new T.Vector3(), cq = new T.Quaternion(), pa = new T.Vector3();
  const w3 = new T.Vector3(), fa = new T.Vector3(), fb = new T.Vector3(), up = new T.Vector3(), lift = new T.Vector3(), gp = new T.Vector3(), gn = new T.Vector3();
  const cw = new T.Vector3(), fl = new T.Vector3(), tb = new T.Vector3(), nb = new T.Vector3(), nt = new T.Vector3(), up2 = new T.Vector3();
  const A = new T.Vector3(), K = new T.Vector3(), F = new T.Vector3(), hd = new T.Vector3(), j0 = new T.Vector3(), j1 = new T.Vector3();
  const dir = new T.Vector3(), ya = new T.Vector3(), za = new T.Vector3(), gf = new T.Vector3(), gN = new T.Vector3(), mk = new T.Matrix4();
  const sm = { v: 0, w: 0 }, arc = new Float32Array(ARC + 1), wl = new T.Vector3(), wd = new T.Vector3(), rx = new T.Vector3();
  const hook = { x: 0, z: 0, ground: 0, busy: false };
  let slot = 0;

  function settle(s, goal, rate, dt) {
    const x = s.v - goal, k = s.w + rate * x, e = Math.exp(-rate * dt);
    s.v = goal + (x + k * dt) * e;
    s.w = (s.w - rate * k * dt) * e;
  }
  const place = (local, p, q, out) => out.copy(local).multiplyScalar(SCALE).applyQuaternion(q).add(p);
  function walkPose(s, outP, outQ) {
    const f = clamp(s / trackLen) * N, i = Math.min(N - 1, Math.floor(f)), k = f - i;
    outP.lerpVectors(track[i], track[i + 1], k).applyMatrix4(G).setY(0);
    v.lerpVectors(heading[i], heading[i + 1], k).transformDirection(G).setY(0).normalize();
    basis(v, Y, outQ);
  }
  function sitePose(k, outP, outQ) {
    outP.lerpVectors(sites[0].P, sites[1].P, k).applyMatrix4(B);
    outQ.slerpQuaternions(sites[0].Q, sites[1].Q, k).premultiply(bq);
  }
  function turn(e, out) {
    q1.slerpQuaternions(Q0, QM, e);
    q2.slerpQuaternions(QM, QS, e);
    return out.slerpQuaternions(q1, q2, e);
  }
  function measureArc() {
    turn(0, cq);
    arc[0] = 0;
    for (let i = 1; i <= ARC; i++) { turn(i / ARC, qa); arc[i] = arc[i - 1] + qa.angleTo(cq); cq.copy(qa); }
  }
  function along(f) {
    const goal = f * arc[ARC];
    let lo = 0, hi = ARC;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (arc[mid] < goal) lo = mid; else hi = mid; }
    return (lo + (goal - arc[lo]) / Math.max(1e-9, arc[hi] - arc[lo])) / ARC;
  }
  function climbPose(c, outP, outQ) {
    const e = along(ease(c)), b = span(c, .22, 1);
    turn(e, outQ);
    pa.lerpVectors(A0, PS, b).addScaledVector(nOut, .05 * Math.sin(Math.PI * b));
    outP.copy(PIVOT).multiplyScalar(SCALE * (1 - b)).applyQuaternion(outQ).negate().add(pa);
    let lo = 1;
    for (const r of RIM) lo = Math.min(lo, outP.y + v.copy(r).multiplyScalar(SCALE).applyQuaternion(outQ).y);
    const x = .006 - lo;
    outP.y += x > .005 ? x : x > -.005 ? (x + .005) ** 2 / .02 : 0;
  }
  function onBee(p, outP, outN, pad = PAD) {
    tb.copy(p).applyMatrix4(Binv);
    hit(Math.atan2(tb.x, tb.y - axisY(tb.z)), tb.z, outP, outN, true);
    outP.addScaledVector(outN, pad).applyMatrix4(B);
    outN.transformDirection(B);
  }
  function grip(leg, at, out, nrm, soft = false) {
    const lim = leg.lim;
    climbPose(clamp(at + DUTY / (2 * STEPS)), cp, cq);
    place(leg.C, cp, cq, A);
    climbPose(at, cp, cq);
    place(leg.grip, cp, cq, out);
    place(leg.C, cp, cq, cw);
    onBee(out, gp, gn, 0);
    let db = gp.distanceTo(cw);
    if (db > lim) { w3.lerpVectors(cw, gp, lim / db); onBee(w3, gp, gn, 0); }
    gp.addScaledVector(gn, PAD);
    db = gp.distanceTo(cw);
    place(leg.rest, cp, cq, fl).setY(PAD);
    let df = fl.distanceTo(cw);
    if (df > lim) {
      const hy = cw.y - PAD, hmax = Math.sqrt(Math.max(0, lim * lim - hy * hy)), hx = fl.x - cw.x, hz = fl.z - cw.z, hl = Math.hypot(hx, hz) || 1;
      if (hl > hmax) fl.set(cw.x + hx * hmax / hl, PAD, cw.z + hz * hmax / hl);
      df = fl.distanceTo(cw);
    }
    const nb2 = gp.distanceTo(out), nf2 = fl.distanceTo(out);
    up2.copy(Y).applyQuaternion(cq);
    out.addScaledVector(up2, .04 * SCALE);
    if (soft) {
      const k = span(at, HAND[leg.row] - .08, HAND[leg.row] + .08), wb = k * (1 - span(nb2, .09, .14)), wf = (1 - k) * (1 - span(nf2, .09, .14)), wh = 1 - wb - wf;
      out.multiplyScalar(wh).addScaledVector(gp, wb).addScaledVector(fl, wf);
      nrm.copy(up2).multiplyScalar(wh).addScaledVector(gn, wb).addScaledVector(Y, wf).normalize();
      return true;
    }
    const floorOk = df <= lim && fl.distanceTo(A) <= lim && nf2 < .12, beeOk = db <= lim && nb2 < .12;
    if (!floorOk && !beeOk) return false;
    const bee = at >= HAND[leg.row] ? beeOk || !floorOk : !floorOk && beeOk;
    if (bee) { out.copy(gp); nrm.copy(gn); } else { out.copy(fl); nrm.copy(Y); }
    return true;
  }
  function floorFoot(leg, s, u, still, out) {
    const x = s / STRIDE + leg.off, k = Math.floor(x), ph = x - k, s0 = STRIDE * (k - leg.off + DUTY / 2);
    walkPose(still ? s : s0, cp, cq);
    place(leg.rest, cp, cq, out).setY(PAD);
    if (!still && ph >= DUTY) {
      walkPose(s0 + STRIDE, cp, cq);
      place(leg.rest, cp, cq, w3).setY(PAD);
      const q = smooth((ph - DUTY) / (1 - DUTY)), d = out.distanceTo(w3);
      out.lerp(w3, q);
      out.y += Math.min(.03, d * .4) * Math.sin(Math.PI * q);
    }
    const e = span(u, WALK[1] - .05, WALK[1] + .005);
    if (e > 0) {
      place(leg.rest, P0, Q0, w3).setY(PAD);
      const d = out.distanceTo(w3);
      out.lerp(w3, e);
      out.y += Math.min(.025, d) * Math.sin(Math.PI * e);
    }
    return out;
  }
  const stance = j => clamp(j / STEPS + (j > 0 ? DUTY / (2 * STEPS) : 0));
  function climbFoot(leg, c, out, nrm) {
    const x = c * STEPS + leg.off, k = Math.floor(x), ph = x - k;
    if (!grip(leg, stance(k - leg.off), out, nrm)) grip(leg, c, out, nrm, true);
    if (ph >= DUTY) {
      if (!grip(leg, stance(k + 1 - leg.off), fb, nb)) grip(leg, c, fb, nb, true);
      const q = smooth((ph - DUTY) / (1 - DUTY));
      out.lerp(fb, q);
      nrm.lerp(nb, q).normalize();
      out.addScaledVector(nrm, .03 * Math.sin(Math.PI * q));
    }
    return out;
  }
  function bead(a, b, r, flat = 1) {
    dir.subVectors(b, a);
    const len = dir.length() || 1e-4;
    dir.divideScalar(len);
    za.crossVectors(dir, Math.abs(dir.y) < .95 ? Y : X).normalize();
    ya.crossVectors(za, dir);
    m4.makeBasis(za.multiplyScalar(r), dir.multiplyScalar(len), ya.multiplyScalar(r * flat));
    m4.setPosition(v.addVectors(a, b).multiplyScalar(.5));
    legs.setMatrixAt(slot, m4);
    m4.makeScale(r, r * flat, r).setPosition(a);
    knees.setMatrixAt(slot++, m4);
  }
  function ik(leg) {
    F.copy(leg.foot).applyMatrix4(inv);
    hd.set(F.x - leg.C.x, 0, F.z - leg.C.z);
    if (hd.lengthSq() < 1e-8) hd.set(leg.side, 0, 0);
    hd.normalize();
    nt.copy(leg.n).transformDirection(inv);
    nb.copy(hd).multiplyScalar(leg.ct).addScaledVector(nt, leg.st).normalize();
    A.copy(F).addScaledVector(nb, -leg.t);
    v.subVectors(A, leg.C);
    let dist = v.length();
    const maxd = .98 * (leg.a + leg.b);
    if (dist > maxd) { A.copy(leg.C).addScaledVector(v, maxd / dist); dist = maxd; }
    const dh = Math.hypot(A.x - leg.C.x, A.z - leg.C.z), dv = A.y - leg.C.y;
    const hp = Math.atan2(dv, dh) + Math.acos(Math.max(-1, Math.min(1, (leg.a * leg.a + dist * dist - leg.b * leg.b) / (2 * leg.a * dist))));
    K.copy(leg.C).addScaledVector(hd, leg.a * Math.cos(hp));
    K.y += leg.a * Math.sin(hp);
    F.copy(A).addScaledVector(nb, leg.t);
    j0.lerpVectors(leg.C, K, .26);
    bead(leg.C, j0, RADII[0]);
    bead(j0, K, RADII[1]);
    j1.lerpVectors(K, A, .45);
    bead(K, j1, RADII[2]);
    bead(j1, A, RADII[3]);
    bead(A, F, RADII[4]);
    j0.copy(F).addScaledVector(hd, -.012);
    j1.copy(F).addScaledVector(hd, .012);
    bead(j0, j1, .01, .6);
  }

  const walkQ = new T.Quaternion(), climbQ = new T.Quaternion();
  let walkHeld = false, climbHeld = false, shown = false, prog = 0;
  const lastQ = new T.Quaternion();
  const exit = { on: false, back: false, k: 0, bee: true, blend: 1, bitten: 0, s: 0, s0: 0, yaw: 0, q: new T.Quaternion(), held: false, lag: 0, flip: 0, w0: 0 };
  const snapP = new T.Vector3(), snapQ = new T.Quaternion(), snapFeet = limbs.map(() => new T.Vector3()), snapN = limbs.map(() => new T.Vector3());
  const eP = new T.Vector3(), eQ = new T.Quaternion(), eN = new T.Vector3(), eF = new T.Vector3(), eM = new T.Vector3(), siteFwd = new T.Vector3(0, 0, 1).applyQuaternion(sites[0].Q);
  function snapshot() {
    snapP.copy(root.position); snapQ.copy(root.quaternion);
    limbs.forEach((leg, i) => { snapFeet[i].copy(leg.foot); snapN[i].copy(leg.n); });
    exit.blend = 0;
  }
  function trackPose(u, still, tt) {
    const w = clamp((u - WALK[0]) / (WALK[1] - WALK[0])), s = trackLen * travel(w), speed = w > 0 && w < 1 ? pace(w) / total : 0;
    const c = clamp((u - CLIMB[0]) / (CLIMB[1] - CLIMB[0])), pk = span(u, PRESS[0], PRESS[1]);
    walkPose(trackLen, P0, Q0);
    QM.copy(Q0).multiply(qa.setFromAxisAngle(X, -REAR));
    place(PIVOT, P0, Q0, A0);
    sitePose(0, PS, QS);
    if (c > 0) measureArc();
    nOut.copy(Y).applyQuaternion(QS);
    if (pk > 0) sitePose(pk, P, Q);
    else if (c > 0) {
      climbPose(c, P, Q);
      if (!still && climbHeld) { qa.copy(climbQ).premultiply(bq); qa.rotateTowards(Q, 2.8 * RAD); Q.copy(qa); }
      climbQ.copy(bq).invert().multiply(Q);
      climbHeld = !still;
    }
    else {
      walkPose(s, P, Q);
      if (!still && walkHeld) { walkQ.rotateTowards(Q, 2.8 * RAD); Q.copy(walkQ); } else walkQ.copy(Q);
      walkHeld = !still;
      if (!still && speed > 0) Q.multiply(qa.setFromAxisAngle(Z, .6 * RAD * Math.sin(TAU * s / STRIDE) * Math.min(1, speed)));
    }
    if (pk > 0 || c > 0) walkHeld = false;
    if (c === 0 || pk > 0) climbHeld = false;
    up.copy(Y).applyQuaternion(Q);
    const tap = u > TAP[0] && u < TAP[1] ? Math.sin(TAU * (u - TAP[0]) / (TAP[1] - TAP[0])) ** 2 : 0;
    const hold = span(c, .02, .26), quest = 1 - span(u, CLIMB[0] - .02, CLIMB[0] + .1);
    for (const leg of limbs) {
      if (leg.row === 0) {
        const wave = still ? 0 : quest * .025 * Math.sin(TAU * 2.3 * tt + leg.side * 1.7);
        place(v.set(leg.rest.x, .11 + wave, leg.rest.z + (still ? 0 : quest * .02 * Math.sin(TAU * 1.7 * tt + leg.side))), P, Q, leg.foot);
        leg.n.copy(up);
        if (tap > 0) { onBee(leg.foot, gp, gn); leg.foot.lerp(gp, tap * .7); leg.n.lerp(gn, tap).normalize(); }
        if (hold > 0) { climbFoot(leg, c, fa, lift); leg.foot.lerp(fa, hold); leg.n.lerp(lift, hold).normalize(); }
        continue;
      }
      if (c > 0) climbFoot(leg, c, leg.foot, leg.n);
      else { floorFoot(leg, s, u, still, leg.foot); leg.n.copy(Y); }
    }
    return { s, pk };
  }
  const TURN = .26, TRAVEL = -95 * RAD, AXIAL = .2, EXIT = [1, 1.1];
  const glide = q => { const a = .15, v = 1 / (1 - a); return q < a ? v * q * q / (2 * a) : q < 1 - a ? v * (q - a / 2) : 1 - v * (1 - q) ** 2 / (2 * a); };
  const pathAt = (q, outP, outN) => hit(SITE - TRAVEL * glide(clamp(q)), sites[0].P.z + AXIAL * glide(clamp(q)), outP, outN, true);
  const tangentAt = (q, out) => { const a = Math.min(q, .99); pathAt(a, eP, eN); pathAt(a + .01, eM, eF); eM.sub(eP); return out.copy(eM).addScaledVector(eN, -eM.dot(eN)).normalize(); };
  const startDir = tangentAt(0, new T.Vector3()), startN = new T.Vector3(), turnAxis = new T.Vector3();
  pathAt(0, eP, startN);
  const sf = siteFwd.clone().addScaledVector(startN, -siteFwd.dot(startN)).normalize();
  const TURN_ANGLE = Math.atan2(turnAxis.crossVectors(sf, startDir).dot(startN), sf.dot(startDir)), FLIP = TURN_ANGLE > 0 ? -Math.PI : Math.PI;
  function exitPose() {
    if (exit.bee) {
      const q = (exit.k - TURN) / (1 - TURN);
      if (q <= 0) {
        pathAt(0, eP, eN);
        eF.copy(sf).applyAxisAngle(eN, TURN_ANGLE * smooth(exit.k / TURN));
      } else {
        tangentAt(q, eF);
        pathAt(q, eP, eN);
      }
      if (exit.flip > 0) eF.applyAxisAngle(eN, FLIP * exit.flip * smooth(clamp(exit.k / TURN)));
      basis(eF, eN, eQ);
      if (exit.held) exit.q.rotateTowards(eQ, 2.8 * RAD); else { exit.q.copy(eQ); exit.held = true; }
      eQ.copy(exit.q);
      for (let i = 0; i < 3; i++) eP.addScaledVector(eN, sink(eP, eQ));
      eP.addScaledVector(eN, .002);
      P.copy(eP).applyMatrix4(B);
      Q.copy(eQ).premultiply(bq);
      const fade = 1 - span(exit.k, .9, 1), stride = Math.max(0, q) * 9 + exit.k * 2;
      for (const leg of limbs) {
        place(leg.rest, P, Q, leg.foot);
        onBee(leg.foot, gp, gn);
        leg.foot.copy(gp).addScaledVector(gn, .022 * Math.max(0, Math.sin(TAU * (stride + leg.off))) * fade);
        leg.n.copy(gn);
      }
      return;
    }
    const e = exit.k < .2 ? exit.k * exit.k / .4 : exit.k - .1;
    exit.s = trackLen * travel(exit.w0 * (1 - e / .9));
    walkPose(exit.s, P, eQ);
    eF.set(0, 0, 1).applyQuaternion(eQ);
    const goal = exit.back ? Math.atan2(eF.x, eF.z) : Math.atan2(-eF.x, -eF.z), step = 2.8 * RAD;
    exit.yaw += Math.max(-step, Math.min(step, ((goal - exit.yaw + Math.PI) % TAU + TAU) % TAU - Math.PI));
    exit.lag = Math.abs(((goal - exit.yaw + Math.PI) % TAU + TAU) % TAU - Math.PI);
    Q.setFromAxisAngle(Y, exit.yaw);
    for (const leg of limbs) {
      place(leg.rest, P, Q, leg.foot).setY(PAD + .02 * Math.max(0, Math.sin(TAU * ((exit.s0 - exit.s) / STRIDE + leg.off))));
      leg.n.copy(Y);
    }
  }

  function update({ t, dt, still, snap = false, m, leaving, body, anchor }) {
    dt = Math.min(dt, .05);
    const jump = still || snap;
    if (jump) { exit.on = false; exit.blend = 1; if (snap) shown = walkHeld = climbHeld = false; }
    else if (exit.on && !leaving && exit.k >= 1) { exit.on = false; exit.blend = 1; prog = 0; sm.v = sm.w = 0; shown = walkHeld = climbHeld = false; }
    if (jump) { sm.v = m; sm.w = 0; } else settle(sm, m, 7.5, dt);
    const u = clamp(sm.v), tt = still ? 0 : t, fe = span(u, FEED[0], FEED[1]);
    B.copy(body.matrixWorld);
    G.copy(anchor || B);
    B.decompose(bp, bq, bs);
    Binv.copy(B).invert();
    const p = exit.on ? prog : prog = jump ? u : Math.max(prog, u);
    if (leaving && !exit.on && root.visible && !jump) {
      exit.on = true; exit.back = false; exit.held = false; exit.k = 0; exit.lag = 0; exit.flip = 0; exit.bee = p >= CLIMB[0] - .02; exit.bitten = span(p, PRESS[0], PRESS[1]);
      exit.w0 = clamp((p - WALK[0]) / (WALK[1] - WALK[0]));
      exit.s0 = trackLen * travel(exit.w0);
      eF.set(0, 0, 1).applyQuaternion(root.quaternion);
      exit.yaw = Math.atan2(eF.x, eF.z);
      if (exit.bee) { snapshot(); exit.q.copy(bq).invert().multiply(root.quaternion); exit.held = true; } else exit.blend = 1;
    } else if (exit.on) exit.back = !leaving;
    let pk = 0;
    if (exit.on) {
      const dur = exit.bee ? EXIT[0] : EXIT[1] * (.2 + .8 * exit.w0);
      if (exit.bee) exit.flip = clamp(exit.flip + (exit.back ? dt : -dt) / 1.1);
      if (exit.bee ? exit.flip === +exit.back : exit.lag < 20 * RAD) exit.k = clamp(exit.k + (exit.back ? -dt : dt) / dur);
      if (exit.back && exit.k === 0) { exit.on = false; snapshot(); }
    }
    if (exit.on) {
      root.visible = exit.k < 1;
      mark.visible = exit.bitten > .001 && exit.k < 1;
      if (mark.visible) { const k = exit.bitten * (1 - span(exit.k, .6, 1)); mark.matrix.multiplyMatrices(B, mk.makeScale(k, k, k).setPosition(scar)); mark.updateMatrixWorld(true); }
      if (!root.visible) { shown = false; hook.ground = 0; hook.busy = false; return hook; }
      exitPose();
    } else {
      root.visible = p > .001;
      if (!root.visible) { shown = false; mark.visible = false; hook.ground = 0; hook.busy = Math.abs(sm.v - m) > 1e-3; return hook; }
      pk = trackPose(p, still, tt).pk;
    }
    if (exit.blend < 1) {
      const k = smooth(exit.blend);
      P.lerpVectors(snapP, P, k);
      if (!(exit.on && exit.bee)) { qa.copy(Q); Q.slerpQuaternions(snapQ, qa, k); }
      limbs.forEach((leg, i) => { leg.foot.lerpVectors(snapFeet[i], leg.foot, k); leg.n.lerpVectors(snapN[i], leg.n, k).normalize(); });
      exit.blend = still ? 1 : Math.min(1, exit.blend + dt / .35);
    }
    const breath = 1 - .015 * fe * (.5 + .5 * Math.sin(TAU * .7 * tt)) * (exit.on ? 0 : 1);
    if (!still && shown) { lastQ.rotateTowards(Q, 2.9 * RAD * dt * 60); Q.copy(lastQ); } else lastQ.copy(Q);
    shown = true;
    root.position.copy(P);
    root.quaternion.copy(Q);
    root.scale.set(SCALE, SCALE * breath, SCALE);
    root.updateMatrix();
    root.updateMatrixWorld();
    inv.copy(root.matrix).invert();

    slot = 0;
    for (const leg of limbs) ik(leg);
    const bite = still ? 0 : .5 + .5 * Math.sin(TAU * 1.4 * tt), feed = exit.on ? 0 : Math.max(pk, fe);
    wl.copy(wound).applyMatrix4(B).applyMatrix4(inv);
    rx.set(0, BASE + .02 - arch(0, .145), .145);
    wd.set(0, -Math.sin(22 * RAD), Math.cos(22 * RAD)).multiplyScalar(.058);
    j1.subVectors(wl, rx);
    const reach = Math.min(.058 * (1 + .12 * fe * bite), j1.length() - .024);
    wd.lerp(j1.normalize().multiplyScalar(reach), feed);
    j1.copy(rx).addScaledVector(wd, .52);
    bead(rx, j1, .016);
    bead(j1, A.copy(rx).add(wd), .013);
    legs.count = knees.count = slot;
    legs.instanceMatrix.needsUpdate = knees.instanceMatrix.needsUpdate = true;

    if (!exit.on) {
      mark.visible = pk > .001;
      if (mark.visible) { mark.matrix.multiplyMatrices(B, mk.makeScale(pk, pk, pk).setPosition(scar)); mark.updateMatrixWorld(true); }
    }

    hook.x = P.x;
    hook.z = P.z;
    hook.ground = 1 - span(P.y, .01, .16);
    hook.busy = exit.on || exit.blend < 1 || Math.abs(sm.v - m) > 1e-3 || Math.abs(sm.w) > 1e-3;
    return hook;
  }

  function detail() {}

  return { root, update, detail };
}
