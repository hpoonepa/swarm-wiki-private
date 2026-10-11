/* The bee beside the hive: it hovers, flaps, and its legs swing on damped springs.
   Each leg is three segments; every joint springs toward its resting angle relative to
   the segment above it, and the bee's own acceleration swings them, so they lag and settle. */
(() => {
  const bee = document.querySelector('.intro-bee');
  if (!bee) return;
  const hover = bee.querySelector('.intro-bee__hover');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const REST = [[2.25, 1.95, 2.45], [2.0, 1.75, 2.2], [1.75, 1.45, 1.95]];   // back, middle, front leg (radians, 0 = forward)
  const LEN = [[44, 50, 30], [46, 54, 31], [50, 56, 32]];
  // near-side legs, then the far-side ones (drawn behind the body, angled a little further forward)
  const legs = [...bee.querySelectorAll('.bee-legs')].flatMap(group => [...group.children].map((path, i) => ({ path, i }))).map(({ path, i }) => {
    const far = path.parentNode.classList.contains('bee-legs--far');
    const rest = REST[i].map(a => a - (far ? .34 : 0));
    // each segment is its own stroke so the leg tapers from the hip to the foot
    const widths = far ? [13, 10, 7.5] : [15, 12, 8.5];
    const parts = widths.map((w, j) => { const s = j ? path.cloneNode() : path; s.setAttribute('stroke-width', w); if (j) path.parentNode.insertBefore(s, path.nextSibling); return s; });
    return { path, parts, hip: path.dataset.hip.split(',').map(Number), angle: rest.slice(), spin: [0, 0, 0], rest, len: LEN[i] };
  });
  let frame = 0, last = 0, t = 0, prevX = null, prevY = 0, vx = 0, vy = 0;

  function draw() {
    for (const leg of legs) {
      let [x, y] = leg.hip;
      leg.angle.forEach((a, j) => {
        const nx = x + Math.cos(a) * leg.len[j], ny = y + Math.sin(a) * leg.len[j];
        leg.parts[j].setAttribute('d', `M${x.toFixed(1)} ${y.toFixed(1)} L${nx.toFixed(1)} ${ny.toFixed(1)}`);
        x = nx; y = ny;
      });
    }
  }

  function step(now) {
    frame = 0;
    if (bee.style.visibility !== 'visible' || document.hidden) { prevX = null; return; }
    const dt = Math.min(.033, (now - (last || now)) / 1000) || .016; last = now; t += dt;
    // hover in screen pixels, then the bee's total position (fly-in from the scroll + hover)
    const bob = Math.sin(t * 2.6) * 6, tilt = Math.sin(t * 2.6 - .6) * 1.8;
    hover.style.transform = `translate3d(0,${bob.toFixed(2)}px,0) rotate(${tilt.toFixed(2)}deg)`;
    const fly = parseFloat(bee.style.getPropertyValue('--fly')) || 0;
    const x = -(1 - fly) * innerWidth * .6, y = (1 - fly) * innerHeight * .12 + bob;
    let ax = 0, ay = 0;
    if (prevX !== null) {
      const nvx = (x - prevX) / dt, nvy = (y - prevY) / dt;
      ax = Math.max(-700, Math.min(700, (nvx - vx) / dt)); ay = Math.max(-700, Math.min(700, (nvy - vy) / dt));
      vx = nvx; vy = nvy;
    }
    prevX = x; prevY = y;
    const drag = Math.max(-1, Math.min(1, vx / 900)) * .55;        // airflow pushes the legs back while it flies in
    for (const leg of legs) {
      for (let j = 0; j < 3; j++) {
        const target = j === 0 ? leg.rest[0] + drag : leg.angle[j - 1] + (leg.rest[j] - leg.rest[j - 1]) + drag * .4;
        const k = j === 0 ? 90 : 70, damp = j === 0 ? 12 : 10;
        const a = leg.angle[j], inertia = .12 * (Math.sin(a) * ax - Math.cos(a) * ay);
        leg.spin[j] += (k * (target - a) - damp * leg.spin[j] + inertia) * dt;
        leg.angle[j] += leg.spin[j] * dt;
        const off = leg.angle[j] - target;                         // joints only bend so far
        if (Math.abs(off) > .7) { leg.angle[j] = target + Math.sign(off) * .7; leg.spin[j] *= .3; }
      }
    }
    draw();
    frame = requestAnimationFrame(step);
  }

  function kick() { if (!frame && !reduced.matches && bee.style.visibility === 'visible') { last = 0; frame = requestAnimationFrame(step); } }
  draw();
  new MutationObserver(kick).observe(bee, { attributes: true, attributeFilter: ['style'] });
  document.addEventListener('visibilitychange', kick);
})();
