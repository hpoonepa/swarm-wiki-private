// The team's predicted l79_s469532_mpnn9 complex, rendered from its PDB coordinates.
// Chain A: 79-residue minibinder. Chain B: 157-residue VP3 P domain.
// This predicted pose is separate from the experimentally measured binding result.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
let library;
function loadLibrary() {
  if (window.$3Dmol) return Promise.resolve(window.$3Dmol);
  return library ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('./vendor/3Dmol-min.js', import.meta.url).href;
    script.onload = () => resolve(window.$3Dmol);
    script.onerror = () => reject(new Error('The molecular renderer could not load.'));
    document.head.append(script);
  });
}

export async function mountBinderScene(host, { progress = 0, reduced = false } = {}) {
  const [mol, response] = await Promise.all([
    loadLibrary(), fetch(new URL('https://static.igem.wiki/teams/6185/wiki/lastmin/protein-l79_s469532_mpnn9.pdb', import.meta.url))
  ]);
  if (!response.ok) throw new Error('The predicted minibinder structure could not load.');
  const pdb = await response.text();
  const viewport = host.querySelector('.protein-viewport');
  const viewer = mol.createViewer(viewport, {
    backgroundAlpha: 0, antialias: true, nomouse: true, cartoonQuality: 8, disableFog: true
  });
  viewer.setProjection('orthographic');
  viewer.addModel(pdb, 'pdb');
  viewer.setStyle({ chain: 'A' }, { cartoon: { color: '#286858', thickness: .35, arrows: true } });
  viewer.setStyle({ chain: 'B' }, { cartoon: { color: '#bf953c', thickness: .3, arrows: true } });
  viewer.rotate(25, 'y');
  viewer.rotate(-15, 'x');
  const orientationView = viewer.getView();
  const backbone = viewer.selectedAtoms({ atom: 'CA' });
  const binderBackbone = backbone.filter(atom => atom.chain === 'A');
  let complexView, binderView;
  function fitProjected(atoms) {
    const view = viewer.getView();
    const center = viewer.modelToScreen({ x: -view[0], y: -view[1], z: -view[2] });
    const points = viewer.modelToScreen(atoms);
    const extentX = Math.max(1, ...points.map(point => Math.abs(point.x - center.x)));
    const extentY = Math.max(1, ...points.map(point => Math.abs(point.y - center.y)));
    // Reserve space for ribbon thickness and fit both axes, including after a turn.
    const fit = Math.min(viewport.clientWidth * .42 / extentX, viewport.clientHeight * .42 / extentY);
    viewer.zoom(fit);
  }
  function fitSelection(selection) {
    viewer.zoomTo(selection);
    fitProjected(selection.chain ? binderBackbone : backbone);
    return viewer.getView();
  }
  function fitViews() {
    viewer.setView(orientationView);
    complexView = fitSelection({});
    binderView = fitSelection({ chain: 'A' });
    viewer.setSlab(-150, 150);
  }
  fitViews();
  let current = progress, targetShown = null, yaw = 0, pitch = 0, down = null, destroyed = false;
  function paint(p) {
    if (destroyed) return;
    current = p;
    // Finish framing the whole complex before the second chain appears.
    const reveal = reduced ? Number(p >= .43) : smooth((p - .28) / .15);
    const showTarget = p >= .43;
    if (showTarget !== targetShown) {
      targetShown = showTarget;
      viewer.setStyle({ chain: 'B' }, showTarget
        ? { cartoon: { color: '#bf953c', thickness: .3, arrows: true } } : {});
      viewer.render();
      host.dataset.target = String(showTarget);
    }
    viewer.setView(binderView.map((v, i) => i < 4 ? v + (complexView[i] - v) * reveal : v));
    if (yaw) viewer.rotate(yaw, 'y');
    if (pitch) viewer.rotate(pitch, 'x');
    if (yaw || pitch) fitProjected(showTarget ? backbone : binderBackbone);
    host.dataset.progress = p.toFixed(3);
  }
  const onDown = event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    down = { x: event.clientX, y: event.clientY };
    host.setPointerCapture(event.pointerId);
    host.dataset.dragging = 'true';
  };
  const onMove = event => {
    if (!down) return;
    yaw += (event.clientX - down.x) * .4;
    pitch += (event.clientY - down.y) * .4;
    down = { x: event.clientX, y: event.clientY };
    paint(current);
  };
  const onUp = () => { down = null; delete host.dataset.dragging; };
  const onKey = event => {
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); return; }
    const directions = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
    if (!directions[event.key]) return;
    event.preventDefault();
    yaw += directions[event.key][0]; pitch += directions[event.key][1]; paint(current);
  };
  const reset = () => { yaw = pitch = 0; paint(current); };
  const resetButton = host.closest('.binder-panel')?.querySelector('[data-protein-reset]');
  resetButton?.addEventListener('click', reset);
  host.addEventListener('pointerdown', onDown);
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerup', onUp);
  host.addEventListener('pointercancel', onUp);
  host.addEventListener('keydown', onKey);
  let viewWidth = viewport.clientWidth, viewHeight = viewport.clientHeight;
  const resize = new ResizeObserver(() => {
    const width = viewport.clientWidth, height = viewport.clientHeight;
    if (!width || !height || (width === viewWidth && height === viewHeight)) return;
    viewWidth = width; viewHeight = height;
    viewer.resize(); fitViews(); paint(current);
  });
  resize.observe(viewport);
  viewer.render();
  paint(progress);
  host.dataset.ready = '';
  host.dataset.binder = 'l79_s469532_mpnn9';
  return {
    backend: 'webgl',
    setProgress: paint,
    setReduced(value) { reduced = value; paint(current); },
    destroy() {
      destroyed = true; resize.disconnect(); viewer.clear();
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointercancel', onUp);
      host.removeEventListener('keydown', onKey);
      resetButton?.removeEventListener('click', reset);
    }
  };
}
