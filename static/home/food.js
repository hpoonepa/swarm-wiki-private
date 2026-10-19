(function () {
  const sec = document.getElementById('statement');
  const food = sec && sec.querySelector('.food');
  if (!food || matchMedia('(hover: none)').matches) return;
  const foodOn = () => food.style.visibility !== 'hidden' && ['--vb', '--vs', '--vc'].every(v => +(food.style.getPropertyValue(v) || 1) > .9);
  const blueEl = sec.querySelector('.f-blue');
  const blueOn = () => blueEl && blueEl.style.visibility !== 'hidden' && +(blueEl.style.getPropertyValue('--vbl') || 0) > .9;
  const items = [['.f-cherries', 1, foodOn, false, food], ['.f-almond', .32, foodOn, false, food], ['.f-berry', .6, foodOn, false, food],
                 ['.f-blue', .7, blueOn, true, sec]]
    .map(([sel, depth, on, topCut, root]) => ({ el: root.querySelector(sel), depth, on, topCut, mx: 0, my: 0, s: 1, sv: 0, r: 0, rv: 0, mask: null }))
    .filter(o => o.el);

  items.forEach(o => {
    const build = () => {
      const w = o.el.naturalWidth || 600, h = o.el.naturalHeight || 600, k = 300 / Math.max(w, h);
      const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(o.el, 0, 0, c.width, c.height);
      try { o.mask = { d: g.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height }; } catch (e) { o.mask = null; }
    };
    o.el.complete && o.el.naturalWidth ? build() : o.el.addEventListener('load', build, { once: true });
  });
  function hit(o, x, y) {
    const r = o.el.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return false;
    if (!o.mask) return true;
    const t = getComputedStyle(o.el).transform, m = (t === 'none' ? new DOMMatrix() : new DOMMatrix(t)).inverse();
    const w = o.el.offsetWidth, h = o.el.offsetHeight, dx = x - (r.left + r.right) / 2, dy = y - (r.top + r.bottom) / 2;
    const lx = w / 2 + m.a * dx + m.c * dy, ly = h / 2 + m.b * dx + m.d * dy;
    if (lx < 0 || ly < 0 || lx >= w || ly >= h) return false;
    return o.mask.d[(Math.floor(ly / h * o.mask.h) * o.mask.w + Math.floor(lx / w * o.mask.w)) * 4 + 3] > 40;
  }

  let px = innerWidth / 2, py = innerHeight / 2, hover = null, last = performance.now(), running = false;
  addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; kick(); }, { passive: true });
  addEventListener('scroll', kick, { passive: true });
  addEventListener('click', e => {
    if (e.clientX <= innerWidth / 2) return;
    const o = items.find(o => o.on() && hit(o, e.clientX, e.clientY));
    if (o) { o.sv -= 3.2; o.rv += (Math.random() < .5 ? -1 : 1) * 70; kick(); }
  });

  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const right = px > innerWidth / 2;
    const nx = Math.max(0, (px / innerWidth - .5) * 2), ny = (py / innerHeight - .5) * 2;
    const h = right ? items.find(o => o.on() && hit(o, px, py)) || null : null;
    if (h !== hover) { hover = h; document.documentElement.style.cursor = h ? 'pointer' : ''; }
    let moving = false;
    items.forEach(o => {
      const on = right && o.on();
      const tx = on ? nx * 22 * o.depth : 0, ty = on ? (o.topCut ? Math.min(0, ny) : ny) * 16 * o.depth : 0;
      o.mx += (tx - o.mx) * (1 - Math.exp(-dt * 6)); o.my += (ty - o.my) * (1 - Math.exp(-dt * 6));
      const ts = o === hover ? 1.06 : 1, tr = o === hover ? -3 : 0;
      o.sv += (ts - o.s) * 260 * dt; o.sv *= Math.exp(-dt * 14); o.s += o.sv * dt;
      o.rv += (tr - o.r) * 200 * dt; o.rv *= Math.exp(-dt * 12); o.r += o.rv * dt;
      o.el.style.setProperty('--mx', o.mx.toFixed(2) + 'px'); o.el.style.setProperty('--my', o.my.toFixed(2) + 'px');
      o.el.style.setProperty('--hs', o.s.toFixed(4)); o.el.style.setProperty('--hr', o.r.toFixed(3) + 'deg');
      if (Math.abs(tx - o.mx) + Math.abs(ty - o.my) > .05 || Math.abs(o.sv) + Math.abs(o.rv) > .02 || Math.abs(ts - o.s) > .001 || Math.abs(tr - o.r) > .01) moving = true;
    });
    if (moving) requestAnimationFrame(frame); else running = false;
  }
  function kick() { if (!running && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
})();
