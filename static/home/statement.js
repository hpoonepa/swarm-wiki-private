(function () {
  const sec = document.getElementById('statement');
  if (!sec) return;
  const lines = [...sec.querySelectorAll('.line')];
  const arts = [...sec.querySelectorAll('.art')];
  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = t => (1 - Math.cos(Math.PI * t)) / 2;
  const windows = [[-1, 0, .3, .5], [.34, .54, .86, .98]];
  const RISE = 34, BLUR = 8;

  function target() {
    const r = sec.getBoundingClientRect();
    return Math.min(1, -r.top / (r.height - innerHeight));
  }
  function paint(praw) {
    const p = Math.max(0, praw);
    const k = (sec.offsetHeight - innerHeight) / innerHeight;
    const enter = clamp(1 + praw * k);
    lines.forEach((el, i) => {
      const [a, b, c, d] = windows[i];
      const vin = ease(clamp((p - a) / (b - a))), vout = ease(clamp((p - c) / (d - c)));
      const v = vin * (1 - vout);
      const y = vout > 0 ? -RISE * vout : RISE * (1 - vin);
      const blur = BLUR * (1 - v);
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      el.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : 'none';
      el.style.visibility = v < .002 ? 'hidden' : 'visible';
      const art = arts[i];
      if (art && art.classList.contains('food')) {
        const out = ease(clamp((p - c) / (d - c)));
        let any = false;
        ['--vb', '--vs', '--vc'].forEach((name, j) => {
          const val = ease(clamp((enter - .3 - j * .08) / .52)) * (1 - clamp(out * (1 + j * .15)));
          art.style.setProperty(name, val.toFixed(4));
          if (val > .001) any = true;
        });
        art.style.opacity = '1';
        art.style.visibility = any ? 'visible' : 'hidden';
      } else if (art) {
        art.style.opacity = v.toFixed(3);
        art.style.transform = `translate3d(0, ${(y * .6).toFixed(2)}px, 0) scale(${(.96 + .04 * v).toFixed(4)})`;
        art.style.filter = blur > .05 ? `blur(${(blur * .8).toFixed(2)}px)` : 'none';
        art.style.visibility = el.style.visibility;
      }
    });
    const blue = sec.querySelector('.f-blue');
    if (blue) {
      const [a2, b2, c2, d2] = windows[1];
      const vbl = ease(clamp((p - a2) / (b2 - a2 + .04))) * (1 - ease(clamp((p - c2) / (d2 - c2))));
      blue.style.setProperty('--vbl', vbl.toFixed(4));
      blue.style.visibility = vbl > .001 ? 'visible' : 'hidden';
    }
    if (arts[1]) arts[1].style.setProperty('--w', ease(clamp((p - .58) / .2)).toFixed(3));
  }

  let shown = target(), last = performance.now(), running = false;
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const goal = target();
    shown += (goal - shown) * (1 - Math.exp(-dt * 7));
    if (Math.abs(goal - shown) < .0004) shown = goal;
    paint(shown);
    if (shown !== goal) requestAnimationFrame(tick); else running = false;
  }
  function kick() {
    if (document.hidden) { shown = target(); paint(shown); return; }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  paint(shown);
})();
