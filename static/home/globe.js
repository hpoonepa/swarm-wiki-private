/* Blueberry Earth: a smooth globe painted in the flat, outline-free cel style of the blueberry SVG.
   Posterised light bands with blobby edges, blueberry palette, fixed camera-space lighting. */
(function () {
  const canvas = document.getElementById('globe');
  if (!canvas || !window.THREE) return;
  const T = THREE;

  const M = window.LANDMASK;

  /* ---------- flat-cel "blueberry" earth ----------
     One smooth sphere. A shader paints it in posterised bands with soft, blobby edges and no outlines,
     using the blueberry SVG's palette: blues for water, unripe-berry greens for land, a few mauve patches,
     pale caps at the poles. Lighting is fixed to the camera, so the bands stay put while the planet turns. */
  const MH = window.LANDMASK_HI || M;
  const mbits = Uint8Array.from(atob(MH.data), c => c.charCodeAt(0));
  const mpx = new Uint8Array(MH.w * MH.h);
  for (let i = 0; i < mpx.length; i++) mpx[i] = ((mbits[i >> 3] >> (7 - (i & 7))) & 1) * 255;
  const mblur = new Uint8Array(mpx.length);                       // soften the 1-bit mask once so bilinear sampling gives smooth coasts
  for (let y = 0; y < MH.h; y++) for (let x = 0; x < MH.w; x++) {
    let sum = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const yy = Math.min(MH.h - 1, Math.max(0, y + dy)), xx = (x + dx + MH.w) % MH.w; sum += mpx[yy * MH.w + xx];
    }
    mblur[y * MH.w + x] = sum / 9;
  }
  const maskTex = new T.DataTexture(mblur, MH.w, MH.h, T.RedFormat);
  maskTex.wrapS = T.RepeatWrapping; maskTex.magFilter = maskTex.minFilter = T.LinearFilter; maskTex.needsUpdate = true;
  const hex3 = h => new T.Vector3(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);
  const band = (a, b, c, d, e) => [a, b, c, d, e].map(hex3);        // deep, shadow, base, lit, highlight
  const PAL = {
    sea:   band(0x251C46, 0x2D2F65, 0x344C82, 0x48669C, 0x6688BD),
    land:  band(0x33472F, 0x3F5A39, 0x586F39, 0x7E9D61, 0x9FBD79),
    mauve: band(0x3E2338, 0x623B54, 0x7B5176, 0x8E6488, 0xA78AA6),
    ice:   band(0x48669C, 0x6688BD, 0x8EA3CF, 0xA9BCE0, 0xC9D6EE),
  };
  function bakeNoise(W, H) {
    const hs = (x, y, z) => { const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return v - Math.floor(v); };
    const vn = (x, y, z) => {
      const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z); let fx = x - ix, fy = y - iy, fz = z - iz;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
      const L = (a, b, t) => a + (b - a) * t;
      return L(L(L(hs(ix, iy, iz), hs(ix + 1, iy, iz), fx), L(hs(ix, iy + 1, iz), hs(ix + 1, iy + 1, iz), fx), fy),
               L(L(hs(ix, iy, iz + 1), hs(ix + 1, iy, iz + 1), fx), L(hs(ix, iy + 1, iz + 1), hs(ix + 1, iy + 1, iz + 1), fx), fy), fz);
    };
    const fbm = (x, y, z) => .55 * vn(x, y, z) + .3 * vn(x * 2.1, y * 2.1, z * 2.1) + .15 * vn(x * 4.3, y * 4.3, z * 4.3);
    const d = new Uint8Array(W * H * 4);
    for (let j = 0; j < H; j++) {
      const lat = Math.PI / 2 - (j + .5) / H * Math.PI, cl = Math.cos(lat), y = Math.sin(lat);
      for (let i = 0; i < W; i++) {
        const lon = (i + .5) / W * Math.PI * 2 - Math.PI, x = cl * Math.cos(lon), z = -cl * Math.sin(lon), o = (j * W + i) * 4;
        d[o] = fbm(x * 9, y * 9, z * 9) * 255;                          // coast wobble
        d[o + 1] = fbm(x * 2.6, y * 2.6, z * 2.6) * 255;                // light-band wobble
        d[o + 2] = fbm(x * 3.2 + 11, y * 3.2 + 11, z * 3.2 + 11) * 255; // mauve patches
        d[o + 3] = fbm(x * 5, y * 5, z * 5) * 255;                      // ice-cap edge
      }
    }
    const tex = new T.DataTexture(d, W, H, T.RGBAFormat);
    tex.wrapS = T.RepeatWrapping; tex.magFilter = tex.minFilter = T.LinearFilter; tex.needsUpdate = true;
    return tex;
  }
  const noiseTex = bakeNoise(768, 384);
  const uniforms = { uMask: { value: maskTex }, uNoise: { value: noiseTex } };
  for (const k in PAL) PAL[k].forEach((v, i) => uniforms[`u_${k}${i}`] = { value: v });
  const decl = Object.keys(PAL).map(k => [0, 1, 2, 3, 4].map(i => `uniform vec3 u_${k}${i};`).join('\n')).join('\n');
  const earthMat = new T.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vObj; varying vec3 vN;
      void main() { vObj = normalize(position); vN = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uMask; uniform sampler2D uNoise; ${decl}
      varying vec3 vObj; varying vec3 vN;
      float h3(vec3 p) { p = fract(p * .3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
      float vnoise(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
      float fbm(vec3 p) { return .55 * vnoise(p) + .3 * vnoise(p * 2.1) + .15 * vnoise(p * 4.3); }
      float aa(float e, float x) { float w = max(fwidth(x) * .75, 1e-4); return smoothstep(e - w, e + w, x); }
      vec3 shade(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, float d, float hl) {
        vec3 c = mix(c0, c1, aa(-.42, d)); c = mix(c, c2, aa(-.08, d)); c = mix(c, c3, aa(.52, d)); return mix(c, c4, hl); }
      void main() {
        vec3 N = normalize(vN);
        float lat = asin(clamp(vObj.y, -1.0, 1.0)), lon = atan(-vObj.z, vObj.x);
        vec2 uv = vec2((lon + 3.14159265) / 6.2831853, (1.5707963 - lat) / 3.14159265);
        vec4 nz = texture2D(uNoise, uv);
        float coast = texture2D(uMask, uv).r + (nz.r - .5) * .22;
        float land = aa(.5, coast);
        float ice = aa(.5, (abs(lat) - 1.2) * 6.0 + (nz.a - .5) * 1.6);
        float mauve = aa(.71, nz.b) * land;
        vec3 L = normalize(vec3(-.45, .5, .74));
        float d = dot(N, L) + (nz.g - .5) * .26;          // blobby band edges, like the traced berries
        vec3 H = normalize(L + vec3(0, 0, 1));
        float hl = aa(.972, dot(N, H) + (nz.g - .5) * .05); // the big pale shine
        float hl2 = aa(.994, dot(N, normalize(vec3(-.12, .82, .56))));   // small second glint
        hl = max(hl, hl2);
        vec3 sea = shade(u_sea0, u_sea1, u_sea2, u_sea3, u_sea4, d, hl);
        vec3 grn = shade(u_land0, u_land1, u_land2, u_land3, u_land4, d, hl);
        vec3 mav = shade(u_mauve0, u_mauve1, u_mauve2, u_mauve3, u_mauve4, d, hl);
        vec3 icc = shade(u_ice0, u_ice1, u_ice2, u_ice3, u_ice4, d, hl);
        vec3 c = mix(sea, mix(grn, mav, mauve), land);
        c = mix(c, icc, ice);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  earthMat.extensions = { derivatives: true };

  const section = document.getElementById('honeycomb-earth');
  const viewport = section.querySelector('.map-view');
  const panels = [...section.querySelectorAll('[data-region-panel]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => { const x = clamp(v); return x * x * (3 - 2 * x); };
  const mix = (a, b, t) => a + (b - a) * t;
  const progress = () => clamp(-section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - innerHeight));
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (_) { canvas.setAttribute('aria-label', 'Globe unavailable on this device'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, .01, 100);
  const world = new T.Group(); scene.add(world);
  const spin = new T.Group(); world.add(spin);
  spin.add(new T.Mesh(new T.SphereGeometry(1, 192, 128), earthMat));
  // Same latitude/longitude convention as the surface shader above.
  const radians = Math.PI / 180;
  const atlanta = { lat: 33.749, lon: -84.388 };
  const surfacePoint = (lat, lon) => new T.Vector3(
    Math.cos(lat*radians)*Math.cos(lon*radians),
    Math.sin(lat*radians),
    -Math.cos(lat*radians)*Math.sin(lon*radians)
  );
  const pinNormal = surfacePoint(atlanta.lat, atlanta.lon);
  const pinMaterial = new T.MeshBasicMaterial({color:0xf4b72b,transparent:true,opacity:0,depthWrite:false});
  const pin = new T.Mesh(new T.CircleGeometry(.018,48),pinMaterial);
  pin.position.copy(pinNormal).multiplyScalar(1.006);
  pin.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),pinNormal);
  spin.add(pin);
  const ringMaterial = new T.MeshBasicMaterial({color:0xfffbec,transparent:true,opacity:0,depthWrite:false});
  const ring = new T.Mesh(new T.RingGeometry(.024,.028,64),ringMaterial);
  ring.position.copy(pinNormal).multiplyScalar(1.005);
  ring.quaternion.copy(pin.quaternion);spin.add(ring);
  const placeLabel = viewport.querySelector('.globe-location');
  const projected = new T.Vector3();

  // Original entrance: a spring pop with a brief squash and a cast shadow.
  const shadowMaterial = new T.MeshBasicMaterial({ color: 0x344c82, transparent: true, opacity: .12, depthWrite: false });
  const shadow = new T.Mesh(new T.CircleGeometry(1, 96), shadowMaterial);
  shadow.position.set(.08, -1.23, -1.5); shadow.scale.set(.92, .115, 1); scene.add(shadow);
  const statement = document.getElementById('statement');
  const spring = x => 1 - Math.exp(-5.5 * x) * Math.cos(10 * x);
  const squash = x => Math.exp(-5 * x) * Math.sin(14 * x);
  let popAt = null, idleTurn = 0;
  let active = -1, shown = progress(), raf = 0, last = performance.now();
  let visible = false, width = 1, height = 1, worldDistance = 5;
  function paint(p, now, dt = 0) {
    const statementRect = statement.getBoundingClientRect();
    const statementProgress = clamp(-statementRect.top / Math.max(1, statementRect.height - innerHeight));
    if (popAt === null && statementProgress >= .88) {
      popAt = now - (p > .2 || reduced.matches ? 2000 : 0);
      section.classList.add('popped'); statement.classList.add('cleared');
    }
    if (popAt !== null && statementProgress < .8) {
      popAt = null; section.classList.remove('popped'); statement.classList.remove('cleared');
    }
    const pt = popAt === null ? 0 : (now - popAt) / 1000;
    const amount = popAt === null ? 0 : reduced.matches ? 1 : spring(pt);
    const stretch = reduced.matches ? 0 : squash(pt) * .06;
    world.scale.set(Math.max(.001, amount * (1 + stretch)), Math.max(.001, amount * (1 - stretch)), Math.max(.001, amount));
    world.position.y = -.02 - .35 * (1 - Math.min(1, amount));
    shadow.scale.set(.92 * Math.max(.001, amount), .115 * Math.max(.001, amount), 1);
    shadowMaterial.opacity = .12 * clamp(amount);
    if (!reduced.matches) idleTurn += dt * .035;

    const phase = p < .115 ? 0 : p < .235 ? 1 : 2;
    if (phase !== active) {
      active = phase;
      section.dataset.region = ['world', 'usa', 'atlanta'][phase];
      panels.forEach((el, i) => { el.classList.toggle('is-active', i === phase); el.setAttribute('aria-hidden', String(i !== phase)); el.inert = i !== phase; });
    }
    const toUSA = ease((p-.045)/.13);
    const toAtlanta = ease((p-.18)/.12);
    const descend = ease((p-.30)/.115);
    // Rotate the actual requested surface point toward +Z (the camera), with
    // north up. USA and Atlanta remain centered as the camera gets closer.
    const latitude=mix(mix(7,38,toUSA),atlanta.lat,toAtlanta);
    const longitude=mix(mix(19,-98,toUSA),atlanta.lon,toAtlanta);
    world.rotation.x=latitude*radians;
    world.rotation.z=.20*(1-toUSA);
    const entranceTurn=(popAt===null?1.6:1.6*Math.exp(-3.2*pt))*(1-toUSA);
    spin.rotation.y=-Math.PI/2-longitude*radians+(idleTurn-entranceTurn)*(1-toUSA);
    world.position.y=mix(world.position.y,0,toUSA);
    const usaDistance=mix(worldDistance,1+(worldDistance-1)*.585,toUSA);
    const atlantaDistance=mix(usaDistance,1+(worldDistance-1)*.272,toAtlanta);
    camera.position.z=reduced.matches?usaDistance:mix(atlantaDistance,1+(worldDistance-1)*.061,descend);
    shadowMaterial.opacity*=1-ease((p-.14)/.14);
    const markerAlpha=ease((p-.17)/.07)*(1-ease((p-.335)/.055));
    pinMaterial.opacity=markerAlpha;ringMaterial.opacity=markerAlpha*.9;
    renderer.render(scene, camera);
    pin.getWorldPosition(projected).project(camera);
    placeLabel.style.left=`${(projected.x*.5+.5)*width}px`;
    placeLabel.style.top=`${(-projected.y*.5+.5)*height}px`;
    placeLabel.style.opacity=markerAlpha*(1-ease((p-.31)/.035));
    section.dataset.focusLat=latitude.toFixed(3);
    section.dataset.focusLon=longitude.toFixed(3);
    section.dataset.cameraDistance=camera.position.z.toFixed(3);
    section.dataset.progress = p.toFixed(3);
  }
  function tick(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    const goal = progress(), dt = Math.min(.05, (now - last) / 1000); last = now;
    if (reduced.matches) {
      shown = goal;
      paint(goal < .115 ? 0 : goal < .235 ? .175 : .30, now);
      return;
    }
    shown += (goal - shown) * (1 - Math.exp(-dt * 10));
    if (Math.abs(goal - shown) < .0001) shown = goal;
    paint(shown, now, dt);
    if ((popAt !== null && goal < .09) || shown !== goal || (popAt !== null && now-popAt<1700)) raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function resize() {
    width = viewport.clientWidth; height = viewport.clientHeight;
    camera.aspect = width / height; camera.updateProjectionMatrix();
    // Render into the whole stage, keeping the geographic focal point at the
    // flower's origin. Close zooms therefore have no rectangular canvas edge.
    const mobile=innerWidth<=760;
    camera.setViewOffset(width,height,mobile?0:-width*.20,mobile?-height*.20:height*.01,width,height);
    worldDistance = Math.max(5.6, 1 + 3.6 / camera.aspect);
    renderer.setSize(width, height, false);
    kick();
  }
  new ResizeObserver(resize).observe(viewport);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { shown = progress(); kick(); } }, { rootMargin: '50px' }).observe(viewport);
  addEventListener('scroll', kick, { passive: true });
  document.addEventListener('visibilitychange', kick);
  reduced.addEventListener('change', kick);
  resize();
})();
