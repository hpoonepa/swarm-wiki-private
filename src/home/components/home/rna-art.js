// RNAi artwork and timeline adapted from the team's supplied RNAi animation.
// Schematic mechanism, not a species-specific molecular structure model.
// Guide-loaded Argonaute cleavage: Miyoshi et al. (2005), PMCID PMC1315391.
export function createRnaScene(cv) {
  const THREE = window.THREE;
  const dark = cv.closest('[data-theme="dark"]') !== null;

  // ---------------------------------------------------------------- colours & shapes (from the team's part SVGs)
  const C = {
    dicer: '#e6b64f', ago: '#315d4c', comp: '#ead8aa',
    back: dark ? '#abc9b9' : '#3b7560', rung: '#edc36b', // dsRNA / siRNA
    tBack: '#bb883c', tRung: '#f0dca3', // target mRNA
    ink: dark ? '#fff1e6' : '#153f36', paper: '#ffffff',
  };
  const DICER = 'M394.64 21.37C432.11 16.48 472.29 34.56 493.97 65.55C499.59 73.58 504.82 83.16 506.53 92.91C509.65 110.81 502.67 131.52 488.52 143.03C479.22 150.59 467.29 150.68 456.31 147.25C440.08 142.19 425.61 133.08 408.52 130.73C393.85 128.72 379.13 132.35 365.77 138.27C351.01 144.8 334.96 154.22 318.96 145.51C307.31 139.16 300.89 124.26 300.62 111.5C300.45 103.71 302.46 95.75 304.78 88.37C318.4 45.23 352.01 26.92 394.64 21.37Z';
  const AGO = 'M271.59 524.34C276.61 523.68 281.86 523.68 286.85 524.55C316.25 529.68 327.53 558.55 326.63 585.5C325.24 626.72 301.31 668.63 267.69 692.17C250.92 703.92 229.21 711.49 208.98 704.48C181.26 694.88 174.81 659.75 178.7 634.43C183.81 601.2 200.48 569.66 225.88 547.4C238.81 536.06 254.23 526.61 271.59 524.34Z';
  const COMP = 'M511.5 646.35C509.13 648.62 506.84 650.96 503.77 652.3C479.53 662.88 462.09 627.72 462.64 608.5C463.08 593.3 472.71 576.26 490.33 580.28C497.07 581.81 501.25 586.5 506.45 590.5C508.91 585.81 511.12 580.36 515.21 576.73C532.9 560.98 547.03 585.47 549.65 600.6C552.14 615.03 550.49 632.87 541.58 645.09C536.99 651.39 529.76 656.26 521.75 653.68C517.48 652.3 514.84 649.08 511.5 646.35Z';
  const CENTER = { dicer: [403, 84], ago: [252, 615], comp: [506, 615] };

  // ---------------------------------------------------------------- easing + keyframe tracks
  const E = {
    io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    lin: t => t,
  };
  const DEF = { x: 0, y: 0, r: 0, s: 1, sy: 1, a: 1, b: 0, f: 0, m: 0 };
  // keys: [time, {props}, ease?]; props carry forward from the previous key
  function track(keys) {
    let prev = { ...DEF };
    return keys.map(([t, p, e]) => { prev = { ...prev, ...p }; return { t, v: prev, e: E[e || 'io'] }; });
  }
  function at(tr, t) {
    if (t <= tr[0].t) return tr[0].v;
    for (let i = 1; i < tr.length; i++) {
      const b = tr[i];
      if (t <= b.t) {
        const a = tr[i - 1], k = b.e((t - a.t) / (b.t - a.t)), o = {};
        for (const p in DEF) o[p] = a.v[p] + (b.v[p] - a.v[p]) * k;
        return o;
      }
    }
    return tr[tr.length - 1].v;
  }
  const RAD = Math.PI / 180;
  // gentle floating, driven by timeline time so scrubbing stays deterministic
  function bob(v, ph, T) {
    if (!v.b) return v;
    return { ...v, x: v.x + v.b * 2.2 * Math.sin(T * .9 + ph), y: v.y + v.b * 4.5 * Math.sin(T * 1.3 + ph * 1.3), r: v.r + v.b * 1.4 * Math.sin(T * .7 + ph * 1.7) };
  }
  function attach(p, ox, oy, or = 0, os = 1, useScale = true) {
    const c = Math.cos(p.r * RAD), s = Math.sin(p.r * RAD), k = useScale ? p.s : 1;
    return { ...p, x: p.x + (ox * c - oy * s) * k, y: p.y + (ox * s + oy * c) * k, r: p.r + or, s: (useScale ? p.s : 1) * os, sy: useScale ? p.sy : 1 };
  }
  const mix = (a, b, m) => {
    if (m <= 0) return a; if (m >= 1) return b;
    const o = { ...a }; for (const k of ['x', 'y', 'r', 's', 'sy', 'a']) o[k] = a[k] + (b[k] - a[k]) * m; return o;
  };

  // ---------------------------------------------------------------- timeline
  const END = 33;
  const c1 = 3.95, c2 = 4.95, c3 = 5.95;                       // Dicer cuts

  const dicer = track([
    [0, { x: 400, y: -140, a: 0, r: -8 }],
    [1.8, { x: 400, y: 95, a: 1, r: 0, b: 1 }, 'out'],
    [3.0, {}],
    [3.8, { x: 250, y: 128, r: -3, b: 0 }],
    [c1, { y: 139, sy: .93 }, 'out'], [c1 + .25, { y: 128, sy: 1 }],
    [4.8, { x: 400, r: 0 }],
    [c2, { y: 139, sy: .93 }, 'out'], [c2 + .25, { y: 128, sy: 1 }],
    [5.8, { x: 550, r: 3 }],
    [c3, { y: 139, sy: .93 }, 'out'], [c3 + .25, { y: 128, sy: 1 }],
    [6.6, { x: 575, y: 105, r: 0 }],
    [7.8, { x: 790, y: -150, a: 0, r: 12 }, 'in'],
  ]);

  // four siRNAs, start abutted as one long dsRNA (each 150 long, 3 rungs)
  const si = [
    { ph: 0, g: track([[0, { x: 175, y: 230, a: 0 }], [.8, { a: 1 }], [c1, {}], [c1 + .45, { x: 160, y: 234, r: -2 }, 'out'], [6.9, {}], [8.5, { x: 180, y: 390, r: -4, b: 1 }],
        [12.8, {}], [15.8, { x: 40, y: 330, a: 0 }, 'in']]) },
    { ph: 1.7, g: track([[0, { x: 325, y: 230, a: 0 }], [.8, { a: 1 }], [c2, {}], [c2 + .45, { x: 318, y: 226, r: 1.5 }, 'out'], [7.0, {}], [8.6, { x: 560, y: 380, r: 3, b: 1 }],
        [12.8, {}], [15.8, { x: 780, y: 320, a: 0 }, 'in']]) },
    { ph: 3.1, g: track([[0, { x: 475, y: 230, a: 0 }], [.8, { a: 1 }], [c3, {}], [c3 + .45, { x: 482, y: 234, r: -1.5 }, 'out'], [7.05, {}], [8.7, { x: 330, y: 485, r: 2, b: 1 }],
        [12.8, {}], [14.3, { x: 410, y: 745, r: 0, b: 0 }], [17.4, { f: 0 }], [17.6, { f: 1 }]]),
      top: track([[16.0, {}], [16.35, { y: -7 }, 'out'], [17.7, { x: -200, y: -80, r: -8 }], [19.6, { x: -265, y: -115, r: -13, a: 0 }, 'out']]) },
    { ph: 4.4, g: track([[0, { x: 625, y: 230, a: 0 }], [.8, { a: 1 }], [c3, {}], [c3 + .45, { x: 640, y: 226, r: 2 }, 'out'], [7.1, {}], [8.8, { x: 650, y: 470, r: -3, b: 1 }],
        [12.8, {}], [15.8, { x: 790, y: 590, a: 0 }, 'in']]) },
  ];
  const NOOP = track([[0, {}]]);
  si.forEach(p => { p.top = p.top || NOOP; p.bot = p.bot || NOOP; });

  // Ago + partner protein come together into RISC
  const ago = track([[8.6, { x: -170, y: 640, r: -12 }], [10.0, { x: 240, y: 640, r: 0, b: 1 }, 'out']]);
  const agoM = track([[11.4, { m: 0 }], [12.6, { m: 1 }]]);
  const comp = track([[8.7, { x: 970, y: 645, r: 12 }], [10.1, { x: 580, y: 640, r: 0, b: 1 }, 'out']]);
  const compM = track([[11.5, { m: 0 }], [12.6, { m: 1 }]]);
  const risc = track([
    [12.5, { x: 410, y: 665 }], [12.72, { s: 1.07 }, 'out'], [13.05, { s: 1, b: 1 }],
    [14.3, { y: 655 }], [15.1, { x: 410, y: 690, b: 0 }],                         // lands on an siRNA
    [15.28, { s: 1.05, r: -3 }, 'out'], [15.5, { s: 1, r: 2 }], [15.7, { r: 0 }],
    [16.4, {}], [17.4, { y: 750 }],                                               // grips the guide strand
    [17.8, {}], [18.3, { b: .6 }], [20.4, { x: 438, y: 1350, r: 4 }], [21.3, { x: 435, y: 1275, r: 0, b: 0 }],   // carried to the target
    [22.35, { s: 1 }], [22.45, { s: 1.04, sy: .96 }, 'out'], [22.7, { s: 1, sy: 1 }],
    [23.25, {}], [25.1, { x: 435, y: 1360, r: -4 }], // release both cleavage products; retain the guide
    [27.5, { x: 510, y: 1365, r: 3, b: .25 }], [30, { x: 560, y: 1345, r: 5, b: .4 }],
  ]);
  const RISC_AGO = [-8, -20, -5, .8], RISC_COMP = [38, 22, 0, .7];                  // ox, oy, r, s relative to RISC

  // One intact target until ONE cleavage beneath the center of the loaded guide.
  // The two products remain recognizable before their later degradation/fade.
  const CUT_TIME = 22.4, CUT_X = 435;
  const targetEntry = track([[17.9, { x: 550, y: 1240, a: 0 }], [19.8, { x: 410, a: 1 }, 'out']]);
  const products = [
    track([[CUT_TIME, { x: 247.5, y: 1240 }], [24.4, { x: 215, y: 1215, r: -5 }], [27.5, { x: 195, y: 1196, r: -7, a: .9 }], [30, { x: 170, y: 1178, r: -9, a: .35 }]]),
    track([[CUT_TIME, { x: 597.5, y: 1240 }], [24.4, { x: 635, y: 1235, r: 6 }], [27.5, { x: 650, y: 1220, r: 8, a: .9 }], [30, { x: 670, y: 1205, r: 10, a: .35 }]]),
  ];

  const SNIPS = [
    [c1, 250, 230], [c2, 400, 230], [c3, 550, 230],
    [CUT_TIME, CUT_X, 1240, .75],
  ];

  const W = {};                                     // world transforms, filled each frame
  const LABELS = [
    ['dsRNA', .6, 3.6, () => [690, 178]],
    ['Dicer', 1.0, 6.4, () => [W.dicer.x + 132, W.dicer.y - 18]],
    ['Short RNA guides', 4.3, 7.0, () => [400, 320]],
    ['siRNA', 8.3, 12.6, () => [W.si[3].x, W.si[3].y - 50]],
    ['Argonaute', 9.6, 11.6, () => [W.ago.x, W.ago.y + 120], 25],
    ['+', 10.0, 11.5, () => [410, 650], 46],
    ['RISC', 12.75, 16.6, () => [W.ago.x - 4, W.ago.y - 108], 25],
    ['RISC', 18.4, 21.0, () => [W.ago.x - 4, W.ago.y - 108], 25],
    ['binds', 15.2, 16.7, () => [W.risc.x + 108, W.risc.y + 18]],
    ['Released strand', 16.7, 18.9, () => [W.siTop.x, W.siTop.y - 32], 23],
    ['guide strand', 17.2, 18.9, () => [W.siBot.x, W.siBot.y + 48]],
    ['target mRNA', 19.3, 22.3, () => [150, 1196]],
    ['Matching message', 21.3, 22.6, () => [435, 1392]],
    ['One cleavage', 22.4, 24.6, () => [CUT_X, 1162], 25],
    ['Cleavage products', 24.9, 30.5, () => [410, 1105], 25],
    ['Guide retained', 26.0, 30.5, () => [W.risc.x, W.risc.y + 85], 25],
  ];

  // camera: [time, cx, cy, width, height] region that must stay in view
  const CAM = [
    [0, 400, 175, 820, 400], [6.4, 400, 190, 820, 420], [8.4, 410, 360, 840, 470],
    [10.0, 410, 560, 840, 430], [12.8, 410, 560, 840, 430], [14.3, 410, 690, 600, 340],
    [16.2, 400, 700, 620, 340], [17.8, 380, 700, 660, 360],
    [20.6, 435, 1280, 800, 380], [22.4, 435, 1280, 800, 380], [25, 420, 1280, 900, 470], [END, 420, 1280, 900, 470],
  ];


  // ---------------------------------------------------------------- WebGL scene (three.js)
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(C.paper, 0);
  const scene = new THREE.Scene();
  const root = new THREE.Group(); root.scale.y = -1; scene.add(root);   // world is y-down, like the guide
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 2000);
  cam.position.z = 900;
  const ambient = new THREE.HemisphereLight('#fff8e7', '#879b8a', 2.0);
  const keyLight = new THREE.DirectionalLight('#fff3d5', 3.0);
  keyLight.position.set(-400, 700, 700);
  const rimLight = new THREE.DirectionalLight('#ffffff', 1.8);
  rimLight.position.set(450, -100, 500);
  scene.add(ambient, keyLight, rimLight);
  const RL = 30.5;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const FLAT = { transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide };
  const flat = color => new THREE.MeshBasicMaterial({ color, ...FLAT });
  const material = (color, roughness = .34) => {
    const col = new THREE.Color(color);
    if (!THREE.ColorManagement.enabled) col.convertSRGBToLinear();
    return new THREE.MeshStandardMaterial({ color: col, roughness, metalness: .06, transparent: true, side: THREE.DoubleSide });
  };

  // Inflate the team's contour into a continuous, convex front and back surface.
  // There is no extrusion cap or bevel rim: highlights flow over an organic dome.
  function shapeGeo(d, [cx, cy]) {
    const sh = new THREE.Shape(), n = d.match(/[MCZ]|-?[\d.]+/g); let i = 0, cmd = '';
    const num = () => +n[i++];
    while (i < n.length) {
      if (/[MCZ]/.test(n[i])) { cmd = n[i++]; if (cmd === 'Z') { sh.closePath(); continue; } }
      if (cmd === 'M') sh.moveTo(num() - cx, num() - cy);
      else { const a = num() - cx, b = num() - cy, c = num() - cx, e = num() - cy, f = num() - cx, g = num() - cy; sh.bezierCurveTo(a, b, c, e, f, g); }
    }
    const count = 112, rings = 24, contour = sh.getSpacedPoints(count).slice(0, count);
    if (THREE.ShapeUtils.isClockWise(contour)) contour.reverse();
    const bounds = new THREE.Box2().setFromPoints(contour), size = bounds.getSize(new THREE.Vector2());
    // Keep the tilted dome behind the RNA tubes at z=64, including their wave.
    const depth = Math.min(60, Math.max(28, Math.min(size.x, size.y) * .53));
    const positions = [0, 0, depth], indices = [];
    for (let row = 1; row < rings; row++) {
      const theta = Math.PI * row / rings, radius = Math.sin(theta), height = Math.cos(theta);
      for (let k = 0; k < count; k++) {
        const p = contour[k], angle = Math.atan2(p.y, p.x);
        const fullness = 1 + .045 * Math.sin(angle * 3 + .7) * radius * radius;
        positions.push(p.x * radius, p.y * radius, depth * height * fullness);
      }
    }
    const back = positions.length / 3; positions.push(0, 0, -depth);
    for (let k = 0; k < count; k++) {
      const next = (k + 1) % count;
      indices.push(0, 1 + k, 1 + next);
      for (let row = 0; row < rings - 2; row++) {
        const a = 1 + row * count + k, b = 1 + row * count + next;
        indices.push(a, a + count, b, b, a + count, b + count);
      }
      const a = 1 + (rings - 2) * count + k, b = 1 + (rings - 2) * count + next;
      indices.push(a, back, b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices); geo.computeVertexNormals(); return geo;
  }
  function blob(d, center, color, order) {
    const geo = shapeGeo(d, center), m = material(color, .39);
    const mesh = new THREE.Mesh(geo, m);
    mesh.rotation.x = -.23; mesh.rotation.y = .28;
    const g = new THREE.Group(); g.add(mesh); root.add(g);
    return { g, mats: [m], depth: -12 };
  }
  const dicerO = blob(DICER, CENTER.dicer, C.dicer, 6);
  const agoO = blob(AGO, CENTER.ago, C.ago, 1);
  const compO = blob(COMP, CENTER.comp, C.comp, 5);

  // Rounded tubes and capsule-like bases share cached geometry, two draws per strand.
  function mergeGeometry(parts) {
    const positions = [], normals = [];
    for (const part of parts) {
      const geo = part.index ? part.toNonIndexed() : part;
      positions.push(...geo.attributes.position.array); normals.push(...geo.attributes.normal.array);
      if (geo !== part) geo.dispose(); part.dispose();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    return geo;
  }
  const geoCache = {};
  function makeStrand(len, rungs, dir, back, rung, phase = 0) {
    const key = [len, dir, rungs, phase].join();
    let geometry = geoCache[key];
    if (!geometry) {
      const wave = x => new THREE.Vector3(x, 2.6 * Math.sin((x + phase) * Math.PI / 75), 4 * Math.cos((x + phase) * Math.PI / 75));
      const pointCount = Math.max(10, Math.ceil(len / 14));
      const points = Array.from({ length: pointCount }, (_, i) => wave(-len / 2 + len * i / (pointCount - 1)));
      const backbone = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), Math.max(32, Math.ceil(len / 5)), 5.8, 12, false);
      const ends = [-len / 2, len / 2].map(x => { const p = wave(x); return new THREE.SphereGeometry(5.8, 12, 8).translate(p.x, p.y, p.z); });
      const bases = [];
      for (const x of rungs) {
        const p = wave(x), endY = p.y + dir * RL;
        bases.push(new THREE.CylinderGeometry(3.5, 3.5, RL, 10).translate(x, p.y + dir * RL / 2, p.z));
        bases.push(new THREE.SphereGeometry(3.5, 10, 6).translate(x, endY, p.z));
      }
      geometry = geoCache[key] = [mergeGeometry(bases), mergeGeometry([backbone, ...ends])];
    }
    const g = new THREE.Group(), m1 = material(rung, .3), m2 = material(back, .28);
    g.add(new THREE.Mesh(geometry[0], m1), new THREE.Mesh(geometry[1], m2));
    root.add(g); return { g, mats: [m1, m2], depth: 64 };
  }
  const siO = si.map(() => [makeStrand(150, [-50, 0, 50], 1, C.back, C.rung), makeStrand(150, [-50, 0, 50], -1, C.back, C.rung)]);
  const targetRungs = Array.from({ length: 14 }, (_, i) => 85 + i * 50);
  const targetO = makeStrand(700, targetRungs.map(x => x - 410), 1, C.tBack, C.tRung, 410);
  const productO = [
    makeStrand(375, targetRungs.filter(x => x < CUT_X).map(x => x - 247.5), 1, C.tBack, C.tRung, 247.5),
    makeStrand(325, targetRungs.filter(x => x > CUT_X).map(x => x - 597.5), 1, C.tBack, C.tRung, 597.5),
  ];

  function pose(o, v, bx = 1, by = 1) {
    const vis = v.a > .002; o.g.visible = vis; if (!vis) return;
    o.g.position.set(v.x, v.y, o.depth || 0); o.g.rotation.z = v.r * RAD; o.g.scale.set(v.s * bx, v.s * (v.sy || 1) * by, 1);
    const a = Math.min(1, v.a);
    for (const m of o.mats) { if (m.uniforms) m.uniforms.op.value = a; else m.opacity = a; }
  }

  // pairing glow
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShaderMaterial({
    uniforms: { op: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
    fragmentShader: 'uniform float op; varying vec2 vUv; void main(){ float d = clamp(length(vUv - .5) * 2.1, 0., 1.); gl_FragColor = vec4(.92, .69, .22, op * .19 * pow(1. - d, 1.6)); }',
    ...FLAT,
  }));
  glow.position.set(435, 1270, 0); glow.renderOrder = 2; root.add(glow);

  // snip bursts: eight short ink dashes each
  const unitQuad = new THREE.PlaneGeometry(1, 1);
  const snipO = SNIPS.map(() => {
    const g = new THREE.Group(), m = flat(C.ink), rays = [];
    for (let j = 0; j < 8; j++) { const r = new THREE.Mesh(unitQuad, m); r.renderOrder = 7; g.add(r); rays.push(r); }
    root.add(g); return { g, m, rays };
  });

  // Restrained sans-serif labels, rendered once at high resolution.
  const PX = 3;                                                  // texture pixels per world unit
  const labO = LABELS.map(([txt, , , , size = 27]) => {
    const cnv = document.createElement('canvas'), tex = new THREE.CanvasTexture(cnv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
    const m = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, ...FLAT }), mesh = new THREE.Mesh(unitQuad, m);
    mesh.renderOrder = 8; root.add(mesh);
    const o = { mesh, m, tex, cnv, txt, size, w: 1, h: 1 };
    rasterLabel(o); return o;
  });
  function rasterLabel(o) {
    const c2 = o.cnv.getContext('2d'), font = `500 ${o.size * PX}px "Space Grotesk", Inter, sans-serif`;
    c2.font = font; const w = Math.ceil(c2.measureText(o.txt).width) + 12 * PX, h = Math.ceil(o.size * PX * 1.5);
    o.cnv.width = w; o.cnv.height = h;
    c2.font = font; c2.fillStyle = C.ink; c2.textAlign = 'center'; c2.textBaseline = 'middle';
    c2.fillText(o.txt, w / 2, h / 2);
    o.w = w / PX; o.h = h / PX; o.tex.dispose(); o.tex.needsUpdate = true;
  }

  function camAt(t) {
    if (t <= CAM[0][0]) return CAM[0].slice(1);
    for (let i = 1; i < CAM.length; i++) if (t <= CAM[i][0]) {
      const a = CAM[i - 1], b = CAM[i], k = E.io((t - a[0]) / (b[0] - a[0]));
      return [1, 2, 3, 4].map(j => a[j] + (b[j] - a[j]) * k);
    }
    return CAM[CAM.length - 1].slice(1);
  }

  let cw = 1, ch = 1;
  function resize() {
    // Camera transitions scale the parent; retain full-resolution backing pixels.
    cw = Math.max(1, cv.clientWidth); ch = Math.max(1, cv.clientHeight);
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.setSize(cw, ch, false);
  }

  function frame(T) {
    // world transforms, parents first
    W.dicer = bob(at(dicer, T), .4, T);
    const R = bob(at(risc, T), 2.2, T); W.risc = R;
    const agoF = bob(at(ago, T), 1.1, T), compF = bob(at(comp, T), 2.6, T);
    W.ago = mix(agoF, attach(R, RISC_AGO[0], RISC_AGO[1], RISC_AGO[2], RISC_AGO[3]), at(agoM, T).m);
    W.comp = mix(compF, attach(R, RISC_COMP[0], RISC_COMP[1], RISC_COMP[2], RISC_COMP[3]), at(compM, T).m);
    W.si = si.map(p => {
      const v = bob(at(p.g, T), p.ph, T);
      return v.f > 0 ? mix(v, { ...attach(R, 0, -5, 0, 1, false), a: v.a }, v.f) : v;
    });
    const tv = at(si[2].top, T);
    W.siTop = { ...attach(W.si[2], tv.x, -30 + tv.y, tv.r), a: W.si[2].a * tv.a, s: 1 };
    W.siBot = { ...attach(W.si[2], 0, 30), s: 1 };

    const breathe = k => 1 + .012 * Math.sin(T * 2.1 + k);
    pose(dicerO, { ...W.dicer, a: T < 8 ? W.dicer.a : 0 }, breathe(3), 2 - breathe(3));
    pose(agoO, { ...W.ago, a: T > 8.5 ? W.ago.a : 0 }, breathe(0), 2 - breathe(0));
    pose(compO, { ...W.comp, a: T > 8.5 ? W.comp.a : 0 }, breathe(1.5), 2 - breathe(1.5));
    W.si.forEach((v, i) => {
      const tr = i === 2 ? tv : DEF;
      pose(siO[i][0], { ...attach(v, tr.x, -30 + tr.y, tr.r), a: v.a * tr.a, s: 1 });
      pose(siO[i][1], { ...attach(v, 0, 30), s: 1 });
    });
    const target = at(targetEntry, T), cleaved = T >= CUT_TIME;
    pose(targetO, { ...target, a: T > 17.5 && !cleaved ? target.a : 0 });
    const productPoses = products.map(p => at(p, T));
    productPoses.forEach((v, i) => pose(productO[i], { ...v, a: cleaved ? v.a : 0 }));
    const [left, right] = productPoses;
    const gap = cleaved ? Math.max(0, right.x - 162.5 * Math.cos(right.r * RAD) - left.x - 187.5 * Math.cos(left.r * RAD)) : 0;
    cv.dataset.cleavage = !cleaved ? 'intact' : T < 25.1 ? 'cleaved' : 'released';
    cv.dataset.cleavageGap = gap.toFixed(2);
    cv.dataset.targetProducts = cleaved ? '2' : '0';

    const gl = clamp((T - 21.1) / .4) * (1 - clamp((T - 22.3) / .5));
    glow.visible = gl > 0; glow.material.uniforms.op.value = gl;

    SNIPS.forEach(([ts, x, y, sz = 1], i) => {
      const o = snipO[i], u = (T - ts) / .5; o.g.visible = u >= 0 && u <= 1; if (!o.g.visible) return;
      const k = E.out(u), r0 = (8 + 18 * k) * sz, r1 = (14 + 30 * k) * sz;
      o.m.opacity = 1 - u; o.g.position.set(x, y, 0);
      o.rays.forEach((r, j) => {
        const an = j * Math.PI / 4 + Math.PI / 8, rm = (r0 + r1) / 2;
        r.position.set(Math.cos(an) * rm, Math.sin(an) * rm, 0); r.rotation.z = an; r.scale.set(r1 - r0 + 2.6 * sz, 2.6 * sz, 1);
      });
    });

    const [cx, cy, vw, vh] = camAt(T), z = Math.min(cw / vw, ch / vh);
    LABELS.forEach(([, t0, t1, pos], i) => {
      const o = labO[i], on = T >= t0 && T <= t1; o.mesh.visible = on; if (!on) return;
      const aIn = E.out(clamp((T - t0) / .45)), aOut = 1 - clamp((T - (t1 - .4)) / .4), [x, y] = pos();
      o.m.opacity = aIn * aOut;
      const legibility = Math.max(1, 13 / (o.size * z));
      const halfLabel = o.w * legibility / 2 + 8 / z;
      const labelX = Math.max(cx - cw / (2 * z) + halfLabel, Math.min(cx + cw / (2 * z) - halfLabel, x));
      o.mesh.position.set(labelX, y + (1 - aIn) * 8, 130);
      o.mesh.scale.set(o.w * legibility, -o.h * legibility, 1);
    });


    cam.left = cx - cw / (2 * z); cam.right = cx + cw / (2 * z); cam.top = -cy + ch / (2 * z); cam.bottom = -cy - ch / (2 * z);
    cam.updateProjectionMatrix();
    renderer.render(scene, cam);
  }


  let currentTime = .8, destroyed = false;
  const render = time => {
    if (destroyed) return;
    currentTime = time;
    frame(time);
    cv.dataset.time = time.toFixed(3);
    cv.dataset.artwork = 'dimensional-rnai';
  };
  const observer = new ResizeObserver(() => { resize(); render(currentTime); });
  observer.observe(cv);
  resize(); render(currentTime);
  if (document.fonts) document.fonts.load('500 27px "Space Grotesk"').then(() => {
    if (destroyed) return;
    labO.forEach(rasterLabel); render(currentTime);
  });
  return {
    render,
    destroy() {
      if (destroyed) return;
      destroyed = true; observer.disconnect();
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) materials.add(object.material);
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      labO.forEach(label => label.tex.dispose());
      renderer.dispose();
    }
  };
}
