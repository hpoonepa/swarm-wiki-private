// The original three-gene drawing becomes the first frame of the RNAi sequence.
// All geometry below deforms existing illustration paths; it is not a molecular model.
const clamp = v => Math.max(0, Math.min(1, Number(v) || 0));
const ease = v => { v = clamp(v); return v * v * (3 - 2 * v); };
const ramp = (v, a, b) => ease((v - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
const NS = 'http://www.w3.org/2000/svg';

export function initRnaTransition(rna) {
  const art = rna?.querySelector('.rna-discovery__art');
  const img = art?.querySelector('img');
  const canvas = rna?.querySelector('.rna-canvas');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let svg, center, outer = [], labels = [], detail = [], paths = [], rungs = [];
  let progress = 0, target = null;
  const originalVisibility = img?.style.visibility || '';
  const originalPosition = art?.style.position || '';
  const points = d => (d.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
  const line = pts => 'M ' + pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' L ');
  const restorePath = o => {
    o.node.setAttribute('d', o.d);
    o.node.setAttribute('stroke-width', o.width);
  };

  function resize() {
    if (!svg || !img || !canvas) return;
    // Retain the image as a layout anchor, including its object-fit letterboxing.
    const w = img.clientWidth, h = img.clientHeight;
    if (!w || !h) return;
    Object.assign(svg.style, {
      left: `${img.offsetLeft}px`, top: `${img.offsetTop}px`,
      width: `${w}px`, height: `${h}px`
    });
    const style = getComputedStyle(img);
    const pos = style.objectPosition.split(/\s+/);
    const axis = (p, prefix) => prefix + (p === '0%' || p === 'left' || p === 'top' ? 'Min' : p === '100%' || p === 'right' || p === 'bottom' ? 'Max' : 'Mid');
    svg.setAttribute('preserveAspectRatio', `${axis(pos[0], 'x')}${axis(pos[1], 'Y')} ${style.objectFit === 'cover' ? 'slice' : 'meet'}`);
    const matrix = svg.getScreenCTM();
    const box = canvas.getBoundingClientRect();
    if (!matrix || !box.width || !box.height) return;
    const inv = matrix.inverse();
    const z = Math.min(box.width / 820, box.height / 400);
    const project = (x, y) => new DOMPoint(
      box.left + box.width / 2 + (x - 400) * z,
      box.top + box.height / 2 + (y - 175) * z
    ).matrixTransform(inv);
    const a = project(100, 230), b = project(700, 230);
    const top = project(400, 200), bottom = project(400, 260);
    const c = project(400, 230), length = Math.hypot(b.x - a.x, b.y - a.y);
    const scale = length / 390;
    if (scale > 0 && Number.isFinite(scale)) target = {
      x: c.x, y: c.y, scale,
      half: Math.hypot(bottom.x - top.x, bottom.y - top.y) / (2 * scale),
      angle: -90 + Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI
    };
    paint();
  }

  function paint() {
    if (!svg || !center) return;
    const t = reduced.matches ? (progress < .5 ? 0 : 1) : progress;
    if (t === 0) {
      center.setAttribute('transform', 'translate(400 0)');
      outer.forEach(o => { o.node.setAttribute('transform', o.transform); o.node.style.opacity = ''; });
      labels.forEach(o => o.style.opacity = '');
      detail.forEach(o => o.style.opacity = '');
      paths.forEach(restorePath); rungs.forEach(restorePath);
      return;
    }
    const away = ramp(t, 0, .35);
    outer.forEach((o, i) => {
      const direction = i ? 1 : -1;
      o.node.setAttribute('transform', `${o.transform} translate(${direction * 100 * away} 0)`);
      o.node.style.opacity = String(1 - ramp(t, 0, .22));
    });
    labels.forEach(o => o.style.opacity = String(1 - ramp(t, 0, .22)));
    detail.forEach(o => o.style.opacity = String(1 - ramp(t, .12, .35)));
    if (!target) return;
    const travel = ramp(t, .09, .74), turn = ramp(t, .14, .71), uncoil = ramp(t, .25, .88);
    const scale = mix(1, target.scale, travel);
    center.setAttribute('transform', `translate(${mix(400, target.x, travel)} ${mix(280, target.y, travel)}) rotate(${target.angle * turn}) scale(${scale}) translate(0 -280)`);
    paths.forEach(o => {
      const shift = o.layer === 2 ? -3 : 0;
      const finalX = o.side * target.half + shift;
      o.node.setAttribute('d', line(o.pts.map(p => ({ x: mix(p.x, finalX, uncoil), y: p.y }))));
      // The original thick illustration strokes settle onto the canvas tube radius.
      const width = o.layer === 0 ? 8.8 : o.layer === 1 ? 7.54 : 1.8;
      o.node.setAttribute('stroke-width', String(mix(o.width, width, uncoil)));
    });
    rungs.forEach(o => {
      o.node.setAttribute('d', line(o.pts.map((p, i) => ({
        x: mix(p.x, target.half * (1 - 2 * i / (o.pts.length - 1)), uncoil),
        y: mix(p.y, o.y, uncoil)
      }))));
      o.node.setAttribute('stroke-width', String(mix(o.width, o.width > 5 ? 4.7 : 1.2, uncoil)));
    });
  }

  const api = {
    setProgress(t) {
      const next = clamp(t);
      if (next === progress) return;
      const previous = progress;
      progress = next;
      if (!svg) return;
      // Layouts can first become measurable when their pinned chapter is revealed.
      if (svg && (!target || (previous === 0 && progress > 0))) resize();
      else paint();
    },
    resize
  };
  if (!art || !img || !canvas) return api;

  const load = async () => {
    try {
      const response = await fetch(img.currentSrc || img.src);
      if (!response.ok) throw new Error('Gene illustration unavailable');
      const parsed = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      if (parsed.querySelector('parsererror')) throw new Error('Invalid gene illustration');
      svg = document.importNode(parsed.documentElement, true);
      if (svg.namespaceURI !== NS) throw new Error('Gene illustration must be SVG');
      center = svg.querySelector('.gene--2');
      const backbones = [...(center?.querySelectorAll(':scope > .gene-ribbon') || [])];
      if (!center || backbones.length < 2) throw new Error('Original gene paths unavailable');
      svg.classList.add('rna-transition-art');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      Object.assign(svg.style, { position: 'absolute', display: 'block', overflow: 'visible', pointerEvents: 'none', maxHeight: 'none', margin: '0' });
      if (getComputedStyle(art).position === 'static') art.style.position = 'relative';
      art.append(svg);
      outer = [...svg.querySelectorAll('.gene--1, .gene--3')].map(node => ({ node, transform: node.getAttribute('transform') }));
      labels = [...svg.querySelectorAll('.gene-label')];
      detail = [...backbones.slice(2), ...center.querySelectorAll(':scope > circle, :scope > path')];
      paths = backbones.slice(0, 2).flatMap((group, side) => [...group.querySelectorAll('path')].map((node, layer) => {
        const d = node.getAttribute('d'), coords = points(d), pts = [];
        for (let i = 0; i < coords.length; i += 2) pts.push({ x: coords[i], y: coords[i + 1] });
        return { node, d, pts, side: side ? -1 : 1, layer, width: Number(node.getAttribute('stroke-width')) };
      }));
      rungs = [...center.querySelectorAll('.gene-rungs path')].map(node => {
        const d = node.getAttribute('d'), length = node.getTotalLength();
        const pts = Array.from({ length: 9 }, (_, i) => node.getPointAtLength(length * i / 8));
        return { node, d, pts, y: (pts[0].y + pts[8].y) / 2, width: Number(node.getAttribute('stroke-width')) };
      });
      img.style.visibility = 'hidden';
      rna.dataset.rnaTransition = 'ready';
      resize();
    } catch {
      svg?.remove(); svg = null;
      img.style.visibility = originalVisibility;
      art.style.position = originalPosition;
      rna.dataset.rnaTransition = 'fallback';
    }
  };
  load();
  // Honor a preference change without introducing a separate animation clock.
  reduced.addEventListener?.('change', paint);
  return api;
}
