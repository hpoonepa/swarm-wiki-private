/* Deformed wing virus, in the site's flat cel style.
   Geometry is real: one DWV protomer (capsid proteins VP1, VP2, VP3 as molecular surfaces, P domain marked) from
   PDB 5L8Q, repeated by the entry's 60 icosahedral symmetry operators into the ~30 nm shell (assets/protein/).
   Shading copies the blueberry earth: posterised light bands with blobby edges, a pale shine, no outlines. */
(function () {
  const host = document.getElementById('dwv');
  if (!host || !window.THREE) return;
  const T = THREE, BASE = host.dataset.src || 'assets/protein/';
  // Embedded models follow the section's scroll-driven transform. Their internal
  // scale stays constant so moving the model to the centre does not restart a pop.
  const embed = 'embed' in host.dataset;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  let renderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (_) { host.classList.add('no-webgl'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, embed ? 1.25 : 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, .1, 100);
  camera.position.set(0, 0, 4.6);
  const spin = new T.Group(), float = new T.Group();
  float.add(spin); scene.add(float);

  // ground shadow, like the globe's
  const shadow = new T.Mesh(new T.CircleGeometry(1, 96), new T.MeshBasicMaterial({ color: 0x344c82, transparent: true, opacity: .12, depthWrite: false }));
  shadow.position.set(0, -1.22, -1.4); shadow.scale.set(.8, .1, 1); scene.add(shadow);
  shadow.visible = !embed;

  const hex3 = h => new T.Vector3(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);
  const band = (...c) => c.map(hex3);                                 // deep, shadow, base, lit, highlight
  // colours follow the DWV structure paper (Skubnik et al. 2017, PNAS): VP1 blue, VP2 green, VP3 red, P domain magenta
  const PAL = [
    band(0x1B2660, 0x24357E, 0x2E48A3, 0x4565C2, 0x7391DE),           // VP1  blue
    band(0x1C4722, 0x275F2E, 0x37803E, 0x52A259, 0x84C886),           // VP2  green
    band(0x581314, 0x7A1C1D, 0xA52A2A, 0xC94242, 0xE77470),           // VP3  red
    band(0x55104C, 0x761A6A, 0x9F278C, 0xC243AE, 0xE07ED1),           // P domain (part of VP3)  magenta
  ];
  const uniforms = {};
  PAL.forEach((p, k) => p.forEach((v, i) => uniforms[`u${k}_${i}`] = { value: v }));
  const decl = PAL.map((p, k) => p.map((_, i) => `uniform vec3 u${k}_${i};`).join('\n')).join('\n');
  const pick = PAL.map((_, k) => `if (t < ${k}.5) return shade(u${k}_0, u${k}_1, u${k}_2, u${k}_3, u${k}_4, d, hl);`).join('\n          ');

  const material = new T.ShaderMaterial({
    uniforms,
    vertexShader: `
      attribute float aTone;
      varying vec3 vN; varying vec3 vObj; varying float vTone;
      void main() {
        mat4 m = modelMatrix * instanceMatrix;
        vObj = (instanceMatrix * vec4(position, 1.0)).xyz;
        vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vTone = aTone;
        gl_Position = projectionMatrix * viewMatrix * m * vec4(position, 1.0);
      }`,
    fragmentShader: `
      precision highp float;
      ${decl}
      varying vec3 vN; varying vec3 vObj; varying float vTone;
      float h3(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float vnoise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
      float aa(float e, float x) { float w = max(fwidth(x) * .75, 1e-4); return smoothstep(e - w, e + w, x); }
      vec3 shade(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, float d, float hl) {
        vec3 c = mix(c0, c1, aa(-.42, d)); c = mix(c, c2, aa(-.08, d)); c = mix(c, c3, aa(.5, d)); return mix(c, c4, hl); }
      vec3 tone(float t, float d, float hl) {
          ${pick}
          return vec3(1.0);
      }
      void main() {
        vec3 N = normalize(vN);
        vec3 L = normalize(vec3(-.45, .5, .74));                       // the earth's light
        float wob = vnoise(vObj * 1.6) - .5;
        float d = dot(N, L) + wob * .14;                                 // blobby band edges
        float hl = aa(.965, dot(N, normalize(L + vec3(0, 0, 1))) + wob * .04);
        gl_FragColor = vec4(tone(vTone, d, hl), 1.0);
      }`,
  });
  material.extensions = { derivatives: true };

  let mesh = null, born = null, loading = false;
  let active = !embed || host.classList.contains('on');
  async function asset(name, type) {
    const response = await fetch(BASE + name);
    if (!response.ok) throw new Error(`DWV asset ${name}: ${response.status}`);
    return response[type]();
  }
  function load() {
  if (loading) return; loading = true;
  Promise.all([
    asset('dwv-protomer.json', 'json'),
    asset('dwv-protomer.bin', 'arrayBuffer'),
    asset('symmetry.json', 'json'),
  ]).then(([meta, bin, sym]) => {
    const vcount = meta.chains.reduce((n, c) => Math.max(n, c.vertexStart + c.vertexCount), 0);
    const q = new Int16Array(bin, meta.bytes.positions[0], vcount * 3);
    const pos = new Float32Array(vcount * 3);
    for (let i = 0; i < vcount * 3; i++) pos[i] = q[i] * meta.quant.scale[i % 3] + meta.quant.offset[i % 3];
    const regions = new Uint8Array(bin, meta.bytes.regions[0], vcount);
    const idx = new Uint32Array(bin, meta.bytes.indices[0], meta.bytes.indices[1] / 4);
    const tone = new Float32Array(vcount);
    meta.chains.forEach((c, k) => { for (let i = c.vertexStart; i < c.vertexStart + c.vertexCount; i++) tone[i] = regions[i] === 1 ? 3 : k; });

    // soften the atom-level bumps a little (Laplacian smoothing), so the proteins read as soft cartoon shapes
    const nbr = Array.from({ length: vcount }, () => new Set());
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i], b = idx[i + 1], c = idx[i + 2];
      nbr[a].add(b); nbr[a].add(c); nbr[b].add(a); nbr[b].add(c); nbr[c].add(a); nbr[c].add(b);
    }
    const tmp = new Float32Array(pos.length);
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < vcount; i++) {
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const j of nbr[i]) { sx += pos[3 * j]; sy += pos[3 * j + 1]; sz += pos[3 * j + 2]; n++; }
        const k = n ? .5 : 0, o = 3 * i;
        tmp[o] = pos[o] + (sx / (n || 1) - pos[o]) * k; tmp[o + 1] = pos[o + 1] + (sy / (n || 1) - pos[o + 1]) * k; tmp[o + 2] = pos[o + 2] + (sz / (n || 1) - pos[o + 2]) * k;
      }
      pos.set(tmp);
    }

    // capsid radius from the assembled shell, so the model fits the frame whatever the units
    let r = 0; for (let i = 0; i < vcount; i++) r = Math.max(r, Math.hypot(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]));
    for (let i = 0; i < pos.length; i++) pos[i] /= r;

    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('aTone', new T.BufferAttribute(tone, 1));
    g.setIndex(new T.BufferAttribute(idx, 1));
    g.computeVertexNormals();

    const ops = sym.operators;
    mesh = new T.InstancedMesh(g, material, ops.length);
    const m = new T.Matrix4();
    ops.forEach((o, i) => { m.set(o[0], o[1], o[2], o[3] / r, o[4], o[5], o[6], o[7] / r, o[8], o[9], o[10], o[11] / r, 0, 0, 0, 1); mesh.setMatrixAt(i, m); });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    spin.add(mesh);
    spin.rotation.set(.35, -.5, .12);
    born = performance.now();
    host.classList.add('ready');
    host.dataset.ready = 'true';
    host.dataset.radiusAngstrom = r.toFixed(1);
    host.dispatchEvent(new CustomEvent('dwv-ready', { bubbles: true }));
    kick();
  }).catch(() => {
    host.classList.add('no-data');
    host.dataset.ready = 'false';
    host.dispatchEvent(new CustomEvent('dwv-error', { bubbles: true }));
  });
  }
  if (active || 'preload' in host.dataset) load();
  if (embed) new MutationObserver(() => {
    const next = host.classList.contains('on');
    if (next === active) return;
    active = next;
    if (active) { load(); kick(); }
    else { cancelAnimationFrame(raf); raf = 0; dragging = false; }
  }).observe(host, { attributes: true, attributeFilter: ['class'] });

  // drag to turn; otherwise it turns slowly by itself
  let dragging = false, lx = 0, ly = 0, vx = 0, vy = 0;
  host.addEventListener('pointerdown', e => {
    if (!active || !mesh) return;
    dragging = true; lx = e.clientX; ly = e.clientY;
    vx = 0; vy = 0; host.setPointerCapture(e.pointerId);
  });
  host.addEventListener('pointermove', e => {
    if (!dragging) return;
    vx = (e.clientX - lx) * .008; vy = (e.clientY - ly) * .008; lx = e.clientX; ly = e.clientY;
    spin.rotation.y += vx; spin.rotation.x += vy; kick();
  });
  const end = () => { dragging = false; };
  host.addEventListener('pointerup', end); host.addEventListener('pointercancel', end);
  host.addEventListener('lostpointercapture', end);
  host.addEventListener('keydown', e => {
    if (!active || !mesh) return;
    const k = { ArrowLeft: [0, -.15], ArrowRight: [0, .15], ArrowUp: [-.15, 0], ArrowDown: [.15, 0] }[e.key];
    if (k) { e.preventDefault(); spin.rotation.x += k[0]; spin.rotation.y += k[1]; kick(); }
  });

  const spring = x => 1 - Math.exp(-5.5 * x) * Math.cos(10 * x);    // the globe's pop-in
  let raf = 0, last = performance.now(), visible = true;
  function frame(now) {
    raf = 0;
    if (!visible || !active || document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (mesh) {
      const t = (now - born) / 1000, s = embed || reduced.matches ? 1 : spring(t);
      float.scale.setScalar(Math.max(.001, s)); shadow.scale.set(.8 * s, .1 * s, 1);
      if (!dragging && !reduced.matches) {
        const damping = Math.exp(-dt * 9);
        spin.rotation.y += dt * .18 + vx * dt * 45;
        spin.rotation.x += vy * dt * 45;
        vx *= damping; vy *= damping;
      }
      float.position.y = embed || reduced.matches ? 0 : Math.sin(t * .9) * .035;
    }
    renderer.render(scene, camera);
    if (mesh && (!reduced.matches || dragging)) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && visible && active && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = 4.6 * Math.max(1, 1 / camera.aspect); camera.updateProjectionMatrix(); kick();
  }
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) kick();
    else { cancelAnimationFrame(raf); raf = 0; }
  }).observe(host);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else kick();
  });
  reduced.addEventListener('change', () => { vx = 0; vy = 0; kick(); });
  resize();
})();
