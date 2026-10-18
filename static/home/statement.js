/* Two sentences share one spot. Scroll sets a target; the animation eases toward it every frame,
   so wheel ticks glide instead of stepping. Sentence 1 drifts up and softens away while
   sentence 2 rises into the same place, with a short overlap so there's never an empty beat. */
(function () {
  const sec = document.getElementById('statement');
  if (!sec) return;
  const lines = [...sec.querySelectorAll('.line')];
  const arts = [...sec.querySelectorAll('.art')];
  const clamp = v => Math.min(1, Math.max(0, v));
  const ease = t => (1 - Math.cos(Math.PI * t)) / 2;   // easeInOutSine: soft ends, even crossfade
  // [in start, in end, out start, out end] in section progress
  const windows = [[-1, 0, .3, .5], [.34, .54, .86, .98]];
  const RISE = 34, BLUR = 8;

  // raw progress: negative while the section is still rising into view (used for the food's entrance)
  function target() {
    const r = sec.getBoundingClientRect();
    return Math.min(1, -r.top / (r.height - innerHeight));
  }
  function paint(praw) {
    const p = Math.max(0, praw);
    const k = (sec.offsetHeight - innerHeight) / innerHeight;
    const enter = clamp(1 + praw * k);                     // 0 = section top at the bottom of the screen, 1 = pinned
    lines.forEach((el, i) => {
      const [a, b, c, d] = windows[i];
      const vin = ease(clamp((p - a) / (b - a))), vout = ease(clamp((p - c) / (d - c)));
      const v = vin * (1 - vout);                       // visibility 0..1
      const y = vout > 0 ? -RISE * vout : RISE * (1 - vin); // below when arriving, above when leaving
      const blur = BLUR * (1 - v);
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      el.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : 'none';
      el.style.visibility = v < .002 ? 'hidden' : 'visible';
      const art = arts[i];                                  // illustration rides the same curve, drifting a touch less
      if (art && art.classList.contains('food')) {
        // entrance is timed (not scroll-scrubbed) so it glides at a steady pace whatever the scroll wheel does;
        // the exit still rides the scroll with the sentence
        foodOut = ease(clamp((p - c) / (d - c)));
        if (foodAt === null && enter > .3) foodAt = performance.now();
        if (foodAt !== null && enter < .08) foodAt = null;
        foodArt = art; foodFrame();
      } else if (art) {
        art.style.opacity = v.toFixed(3);
        art.style.transform = `translate3d(0, ${(y * .6).toFixed(2)}px, 0) scale(${(.96 + .04 * v).toFixed(4)})`;
        art.style.filter = blur > .05 ? `blur(${(blur * .8).toFixed(2)}px)` : 'none';
        art.style.visibility = el.style.visibility;
      }
    });
    // blueberry flies in with sentence 2 and out with it
    const blue = sec.querySelector('.f-blue');
    if (blue) {
      const [a2, b2, c2, d2] = windows[1];
      const vbl = ease(clamp((p - a2) / (b2 - a2 + .04))) * (1 - ease(clamp((p - c2) / (d2 - c2))));
      blue.style.setProperty('--vbl', vbl.toFixed(4));
      blue.style.visibility = vbl > .001 ? 'visible' : 'hidden';
    }
    // crops wilt once sentence 2 has landed, during its hold
    if (arts[1]) arts[1].style.setProperty('--w', ease(clamp((p - .58) / .2)).toFixed(3));
  }

  // ---- timed food entrance: almond, then strawberry, then cherries, each easing out over ~1.2 s ----
  let foodAt = null, foodOut = 0, foodArt = null, foodRAF = 0;
  const easeOut = t => 1 - Math.pow(1 - t, 4);                       // long, soft deceleration into place
  const FOOD = [['--vb', 0, 1.25], ['--vs', .16, 1.2], ['--vc', .32, 1.15]];   // var, delay s, duration s
  function foodFrame() {
    if (!foodArt) return;
    const now = performance.now(), t = foodAt === null ? -1 : (now - foodAt) / 1000;
    let any = false, done = true;
    FOOD.forEach(([v, delay, dur], i) => {
      const k = t < 0 ? 0 : easeOut(clamp((t - delay) / dur));
      if (t >= 0 && t < delay + dur) done = false;
      const val = k * (1 - clamp(foodOut * (1 + i * .15)));
      foodArt.style.setProperty(v, val.toFixed(4));
      const img = foodArt.querySelector(['.f-almond', '.f-berry', '.f-cherries'][i]);
      if (img) img.style.opacity = clamp(val * 3).toFixed(3);
      if (val > .001) any = true;
    });
    foodArt.style.opacity = '1'; foodArt.style.transform = 'none'; foodArt.style.filter = 'none';
    foodArt.style.visibility = any ? 'visible' : 'hidden';
    cancelAnimationFrame(foodRAF);
    if (!done && !document.hidden) foodRAF = requestAnimationFrame(foodFrame);
  }

  let shown = target(), last = performance.now(), running = false;
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const goal = target();
    shown += (goal - shown) * (1 - Math.exp(-dt * 7));   // ~140 ms glide
    if (Math.abs(goal - shown) < .0004) shown = goal;
    paint(shown);
    if (shown !== goal) requestAnimationFrame(tick); else running = false;
  }
  function kick() {
    if (document.hidden) { shown = target(); paint(shown); return; }   // no animation frames in hidden tabs: jump straight there
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  }
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  paint(shown);
})();
