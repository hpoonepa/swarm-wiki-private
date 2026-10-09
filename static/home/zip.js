/* hero reveal: the band sits under a solid green cover cut to its outline; a bee flies left to right on a wandering
   path (three mismatched sine waves) and the cover parts above and below its track behind it.
   The cover is one canvas: the green silhouette is rendered once, then each frame redraws it and cuts the opening,
   and the bee moves by transform only, so nothing re-lays-out or re-masks while it flies */
(function () {
  const zip = document.getElementById('zip');
  if (!zip) return;
  const cv = zip.querySelector('canvas'), ctx = cv.getContext('2d'), bee = zip.querySelector('.pull');
  const art = document.querySelector('.hero .band img');
  const GREEN = '#2C6A43', DUR = 3800, END = 1.32;                 // the bee flies past the right edge so the tail fully opens
  const DS = Array.from({ length: 81 }, (_, i) => 1.45 * (i / 80) ** 2);   // dense near the bee, where the opening curves fastest
  const off = d => Math.min(.78, 1.6 * d + .55 * Math.sqrt(d));   // how far each edge has lifted off the track, in band heights
  const ease = t => .5 - .5 * Math.cos(Math.PI * t);              // gentle start and stop, no rush in the middle
  const T = Math.PI * 2;
  const track = x => .5 + .14 * Math.sin(T * 1.3 * x + .6) + .06 * Math.sin(T * 3.1 * x + 2.1) + .015 * Math.sin(T * 5.7 * x + .3);  // band heights
  let W = 0, H = 0, dpr = 1, cw = 0, ch = 0, sil = null, ready = false, wanted = false, started = false;

  function build() {
    const r = cv.getBoundingClientRect();
    cw = r.width; ch = r.height; if (!cw || !ch) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = Math.round(cw * dpr); H = cv.height = Math.round(ch * dpr);
    sil = document.createElement('canvas'); sil.width = W; sil.height = H;
    const s = sil.getContext('2d');
    s.drawImage(art, 0, 0, W, H);                                   // the band's own outline...
    s.globalCompositeOperation = 'source-in';
    s.fillStyle = GREEN; s.fillRect(0, 0, W, H);                    // ...filled solid green
    ready = true;
    draw(.01);
    if (wanted) start();
  }

  function draw(P) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(sil, 0, 0);
    // cut the opening: along the upper edge from the bee back to the left, then the lower edge back to the bee
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    let last = 0;
    for (let i = 0; i < DS.length; i++) {
      const x = Math.max(-.1, P - DS[i]);
      const y = track(x) - off(DS[i]);
      i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H);
      last = i; if (x <= -.1) break;
    }
    for (let i = last; i >= 0; i--) {
      const x = Math.max(-.1, P - DS[i]);
      ctx.lineTo(x * W, (track(x) + off(DS[i])) * H);
    }
    ctx.closePath(); ctx.fill();

    const x = Math.min(P, 1);
    const slope = (track(x + .002) - track(x - .002)) * ch / (.004 * cw);
    const bw = bee.offsetWidth, bh = bw * 100 / 132;
    bee.style.transform = 'translate3d(' + (x * cw - bw / 2).toFixed(2) + 'px,' + (track(x) * ch - bh / 2).toFixed(2) + 'px,0) rotate(' + (Math.atan(slope) * 180 / Math.PI).toFixed(2) + 'deg)';
    bee.style.opacity = P > 1 ? Math.max(0, 1 - (P - 1) * 12) : 1;
  }

  function done() { zip.classList.add('gone'); setTimeout(() => zip.remove(), 450); }

  function start() {
    if (started) return; started = true;
    if (document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return done();
    const t0 = performance.now();
    (function frame(now) {
      const k = Math.min(1, (now - t0) / DUR);
      draw(.01 + (END - .01) * ease(k));
      if (k < 1) requestAnimationFrame(frame); else done();
    })(t0);
  }

  window.unzipHero = function () { wanted = true; if (ready) start(); };

  if (art.complete && art.naturalWidth) (art.decode ? art.decode() : Promise.resolve()).then(build, build);
  else art.addEventListener('load', build, { once: true });
  setTimeout(() => { wanted = true; if (ready) start(); else done(); }, 15000);   // never leave the band covered
})();
