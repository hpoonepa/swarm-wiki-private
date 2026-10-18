import { designs, modelUrl } from './designs';
import type { AtomSpec, GLModel, GLViewer } from '3dmol';

const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(`bv-${id}`) as T;
const select = (id: string) => el<HTMLSelectElement>(id);
const check = (id: string) => el<HTMLInputElement>(id);
const colors = { target: '#3e806b', binder: '#cc921f', selected: '#b74f35' };
const amino = Object.fromEntries('ALA A ARG R ASN N ASP D CYS C GLN Q GLU E GLY G HIS H ILE I LEU L LYS K MET M PHE F PRO P SER S THR T TRP W TYR Y VAL V'.split(' ').reduce<string[][]>((pairs, word, i, words) => i % 2 ? pairs : [...pairs, [word, words[i + 1]]], []));
let viewer: GLViewer;
let lib: typeof import('3dmol');
let model: GLModel | undefined;
let atoms: AtomSpec[] = [];
let currentName = '';
let currentFile = '';
let currentFormat = 'pdb';
let currentData = '';
let isLocal = false;
let targetChain = 'B';
let binderChain = 'A';
let selection: AtomSpec | undefined;
let request = 0;
let styleRequest = 0;
let downloadUrl = '';
let spinning = false;
let ready = false;
let initialView: number[] | undefined;
const near = new Set<string>();
const key = (a: AtomSpec) => `${a.chain}:${a.resi}:${a.icode || ''}`;
const atomSelection = (a: AtomSpec) => ({ chain: a.chain, resi: a.resi, ...(a.icode !== undefined ? { icode: a.icode } : {}) });
const residues = (chain: string) => [...new Map(atoms.filter(a => a.chain === chain && a.atom === 'CA').map(a => [key(a), a])).values()];

function status(message: string, error = false) {
  el('status').textContent = message;
  el('status').hidden = !message;
  el('status').classList.toggle('bv-status--error', error);
}

function spin(on: boolean) {
  spinning = on;
  viewer?.spin(on ? 'y' : false, .35);
  el('spin').setAttribute('aria-pressed', String(on));
}

function computeInterface() {
  near.clear();
  const target = atoms.filter(a => a.chain === targetChain && a.elem !== 'H');
  const binder = atoms.filter(a => a.chain === binderChain && a.elem !== 'H');
  // A geometric neighborhood, not a hydrogen-bond or affinity prediction.
  // Spatial bins keep local-file inspection responsive for larger structures.
  const bins = new Map<string, AtomSpec[]>();
  const bin = (x: number, y: number, z: number) => `${x},${y},${z}`;
  for (const a of target) {
    const k = bin(Math.floor(a.x / 5), Math.floor(a.y / 5), Math.floor(a.z / 5));
    if (!bins.has(k)) bins.set(k, []);
    bins.get(k)!.push(a);
  }
  for (const b of binder) {
    const [x, y, z] = [b.x, b.y, b.z].map(n => Math.floor(n / 5));
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      for (const a of bins.get(bin(x + dx, y + dy, z + dz)) || []) {
        if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 <= 25) {
          near.add(key(a));
          near.add(key(b));
        }
      }
    }
  }
}

function describe(a: AtomSpec) {
  const role = a.chain === targetChain ? (isLocal ? 'Target' : 'VP3') : 'Minibinder';
  return `${role} · ${a.resn} ${a.resi}${a.icode || ''} · chain ${a.chain || '(blank)'}${near.has(key(a)) ? ' · within 5 Å of the other chain' : ''}`;
}

function renderSequence() {
  const list = residues(binderChain);
  const fragment = document.createDocumentFragment();
  const overview = document.createDocumentFragment();
  const focusedKey = el('sequence').contains(document.activeElement) ? (document.activeElement as HTMLElement)?.dataset.residue : undefined;
  for (let offset = 0; offset < list.length; offset += 10) {
    const group = document.createElement('div');
    group.className = 'bv-sequence-group';
    const range = document.createElement('div');
    range.className = 'bv-sequence-range';
    range.setAttribute('aria-hidden', 'true');
    const start = document.createElement('span');
    const end = document.createElement('span');
    const chunk = list.slice(offset, offset + 10);
    start.textContent = String(chunk[0].resi);
    end.textContent = String(chunk.at(-1)!.resi);
    range.append(start, end);
    const letters = document.createElement('div');
    letters.className = 'bv-sequence-letters';
    for (const a of chunk) {
      const selected = !!selection && key(selection) === key(a);
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.residue = key(a);
      button.textContent = amino[a.resn || ''] || 'X';
      button.title = describe(a);
      button.setAttribute('aria-label', describe(a));
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-interface', near.has(key(a)));
      button.addEventListener('click', () => pick(a));
      letters.append(button);
      const tick = document.createElement('span');
      tick.classList.toggle('is-interface', near.has(key(a)));
      tick.classList.toggle('is-selected', selected);
      overview.append(tick);
    }
    group.append(range, letters);
    fragment.append(group);
  }
  el('sequence').replaceChildren(fragment);
  el('sequence-overview').replaceChildren(overview);
  el('sequence-count').textContent = `${list.length} residues`;
  if (focusedKey) Array.from(el('sequence').querySelectorAll('button')).find(button => button.dataset.residue === focusedKey)?.focus({ preventScroll: true });
}

function pick(a: AtomSpec) {
  selection = selection && key(selection) === key(a) ? undefined : a;
  el('residue').textContent = selection ? describe(selection) : 'Select a residue to inspect it.';
  renderSequence();
  void render();
}

function visibleChains() {
  return [check('chain-target').checked ? targetChain : null, check('chain-binder').checked ? binderChain : null].filter((c): c is string => c !== null);
}

function focus(reset = false) {
  if (!model) return;
  spin(false);
  const mode = select('focus').value;
  const chains = visibleChains();
  const chosen = mode === 'target' ? [targetChain] : mode === 'binder' ? [binderChain] : chains;
  const indices = atoms.filter(a => chosen.includes(a.chain || '') && (mode !== 'interface' || near.has(key(a)))).map(a => a.index!);
  if (indices.length) {
    viewer.zoomTo({ index: indices }, 0);
    if (!reset) viewer.zoom(mode === 'interface' ? 1.65 : 1.5);
  }
  if (reset) {
    const view = viewer.getView();
    view[4] = 0; view[5] = 0; view[6] = 0; view[7] = 1;
    viewer.setView(view);
    viewer.rotate(25, 'y');
    viewer.rotate(-15, 'x');
    viewer.zoom(1.75);
  }
  viewer.render();
}

async function render() {
  if (!model) return;
  const token = ++styleRequest;
  const chains = visibleChains();
  const iface = select('focus').value === 'interface';
  viewer.removeAllSurfaces();
  viewer.removeAllLabels();
  model.setStyle({}, {});
  const surfaces: Promise<unknown>[] = [];
  for (const chain of chains) {
    const color = chain === targetChain ? colors.target : colors.binder;
    const representation = select('style').value;
    if (representation === 'stick') {
      model.setStyle({ chain }, { stick: { radius: .14, color } });
    } else {
      model.setStyle({ chain }, { cartoon: { color, opacity: iface ? .32 : 1 } });
      if (representation === 'surface') {
        surfaces.push(viewer.addSurface(lib.SurfaceType.MS, { color, opacity: iface ? .3 : .82 }, { chain }) as Promise<unknown>);
      }
    }
    if (iface) {
      const indices = atoms.filter(a => a.chain === chain && near.has(key(a))).map(a => a.index!);
      model.setStyle({ index: indices }, { cartoon: { color }, stick: { color, radius: .19 } });
    }
  }
  if (selection && chains.includes(selection.chain || '')) {
    model.setStyle(atomSelection(selection), { cartoon: { color: colors.selected }, stick: { color: colors.selected, radius: .22 } });
    viewer.addLabel(`${selection.resn} ${selection.resi}`, {
      position: { x: selection.x, y: selection.y, z: selection.z },
      backgroundColor: '#fffcf3', backgroundOpacity: .96, fontColor: '#593e28',
      fontSize: 13, borderThickness: 1, borderColor: '#d8c39a', inFront: true,
    });
  }
  el('interface-note').hidden = !iface;
  viewer.render();
  try {
    await Promise.all(surfaces);
    if (token === styleRequest) viewer.render();
  } catch {
    if (token === styleRequest) el('residue').textContent = 'Surface could not be drawn. Try the cartoon view.';
  }
}

function updateDetails() {
  const items = [
    ['Target', isLocal ? 'Selected chain' : 'VP3 P-domain'],
    ['Target length', `${residues(targetChain).length} aa`],
    ['Minibinder length', `${residues(binderChain).length} aa`],
    ['Near-interface residues', `${residues(targetChain).filter(a => near.has(key(a))).length} + ${residues(binderChain).filter(a => near.has(key(a))).length}`],
  ];
  const dl = document.createElement('dl');
  for (const [label, value] of items) {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label; dd.textContent = value;
    row.append(dt, dd); dl.append(row);
  }
  el('details').replaceChildren(dl);
  el('source-note').textContent = isLocal
    ? 'Local file. Choose the target and binder chains to inspect their interface.'
    : 'Target: VP3 residues 260–416 in 5MV5, numbered 1–157 here. Design labels follow the local export order, not experimental ranking.';
  computeInterface();
  renderSequence();
}

function chainChanged(which: 'target' | 'binder') {
  const previousTarget = targetChain;
  const previousBinder = binderChain;
  targetChain = select('target-chain').value;
  binderChain = select('binder-chain').value;
  if (targetChain === binderChain) {
    if (which === 'target') binderChain = previousTarget;
    else targetChain = previousBinder;
  }
  select('target-chain').value = targetChain;
  select('binder-chain').value = binderChain;
  selection = undefined;
  computeInterface(); updateDetails();
  void render(); focus();
}

function installStructure(data: string, format: string, name: string, local = false, filename = '') {
  const candidate = viewer.addModel(data, format, { keepH: false });
  const parsed = candidate.selectedAtoms({});
  const chains = [...new Set(parsed.filter(a => a.atom === 'CA').map(a => a.chain || ''))];
  if (parsed.length > 60000 || chains.length < 2 || !parsed.every(a => Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(a.z))) {
    viewer.removeModel(candidate);
    throw new Error('Choose a protein complex with at least two chains and fewer than 60,000 atoms.');
  }
  if (!local && (!chains.includes('A') || !chains.includes('B'))) {
    viewer.removeModel(candidate);
    throw new Error('This design is missing the expected target or minibinder chain.');
  }
  if (model) viewer.removeModel(model);
  model = candidate; atoms = parsed;
  currentName = name; currentFile = filename || name; currentData = data; currentFormat = format; isLocal = local;
  targetChain = local ? chains[0] : 'B'; binderChain = local ? chains[1] : 'A'; selection = undefined;
  for (const id of ['target-chain', 'binder-chain']) {
    select(id).replaceChildren(...chains.map(chain => new Option(chain || '(blank)', chain)));
    select(id).disabled = !local;
  }
  select('target-chain').value = targetChain;
  select('binder-chain').value = binderChain;
  check('chain-target').checked = check('chain-binder').checked = true;
  select('focus').value = 'complex';
  el('model-title').textContent = name;
  el('subtitle').textContent = local ? 'Local structure' : 'VP3 P-domain + minibinder';
  el('residue').textContent = 'Select a residue to inspect it.';
  const controls = el('canvas');
  controls.setAttribute('aria-label', `${name}. Drag to rotate. Use arrow keys to rotate and plus or minus to zoom.`);
  computeInterface(); updateDetails();
  model.setClickable({}, true, (a: AtomSpec) => pick(a));
  model.setHoverable({}, true, (a: AtomSpec) => {
    if (!selection) el('residue').textContent = describe(a);
  }, () => {
    if (!selection) el('residue').textContent = 'Select a residue to inspect it.';
  });
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = URL.createObjectURL(new Blob([data], { type: 'text/plain' }));
  const download = el<HTMLAnchorElement>('download');
  download.href = downloadUrl;
  download.download = `${currentFile.replace(/\.(pdb|cif|mmcif)$/i, '')}.${format === 'pdb' ? 'pdb' : 'cif'}`;
  download.setAttribute('aria-disabled', 'false');
  status('');
  void render(); focus(true); initialView = viewer.getView();
}

function markDesign(id: string) {
  select('design').value = id;
  for (const button of el('design-list').querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.design === id));
  }
}

async function loadDesign(id: string) {
  if (!ready) return;
  const design = designs.find(d => d.id === id);
  if (!design) return;
  const token = ++request;
  spin(false);
  status(`Loading ${design.label.toLowerCase()}…`);
  try {
    const response = await fetch(modelUrl(design.file), { credentials: 'omit', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error('The structure file is not available yet. You can open a local PDB or mmCIF file below.');
    const payload = await response.json();
    if (typeof payload.data !== 'string' || !['pdb', 'cif', 'mmcif'].includes(payload.format)) throw new Error('The structure file has an unsupported format.');
    if (token !== request) return;
    installStructure(payload.data, payload.format, design.label, false, design.source);
    markDesign(id);
    const url = new URL(window.location.href);
    url.searchParams.set('design', id);
    window.history.replaceState(null, '', url);
  } catch (error) {
    if (token !== request) return;
    const message = error instanceof Error ? error.message : 'The structure could not be loaded.';
    status(message, true);
  }
}

async function start() {
  // The npm dependency is bundled into the wiki build. No CDN script or
  // structure-database lookup is used at runtime.
  const imported = await import('3dmol/build/3Dmol.js');
  lib = (imported.default || imported) as typeof import('3dmol');
  lib.setSyncSurface(true);
  viewer = lib.createViewer(el('canvas'), { backgroundColor: '#fff8e7', antialias: true });
  viewer.setProjection('orthographic');
  ready = true;
  select('design').replaceChildren(...designs.map(d => new Option(d.label, d.id)));
  for (const design of designs) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.design = design.id;
    const name = document.createElement('span');
    const length = document.createElement('small');
    name.textContent = design.label;
    length.textContent = `${design.binderLength} amino acids`;
    button.append(name, length);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => void loadDesign(design.id));
    el('design-list').append(button);
  }
  select('design').addEventListener('change', () => void loadDesign(select('design').value));
  select('style').addEventListener('change', () => void render());
  select('focus').addEventListener('change', () => {
    if (['target', 'interface', 'complex'].includes(select('focus').value)) check('chain-target').checked = true;
    if (['binder', 'interface', 'complex'].includes(select('focus').value)) check('chain-binder').checked = true;
    selection = undefined; renderSequence(); void render(); focus();
  });
  for (const id of ['chain-target', 'chain-binder']) check(id).addEventListener('change', () => {
    if (!visibleChains().length) check(id === 'chain-target' ? 'chain-binder' : 'chain-target').checked = true;
    void render();
  });
  select('target-chain').addEventListener('change', () => chainChanged('target'));
  select('binder-chain').addEventListener('change', () => chainChanged('binder'));
  el('reset').addEventListener('click', () => {
    if (!model || !initialView) return;
    spin(false); selection = undefined;
    select('focus').value = 'complex';
    check('chain-target').checked = check('chain-binder').checked = true;
    el('residue').textContent = 'Select a residue to inspect it.';
    renderSequence(); void render(); viewer.setView(initialView); viewer.render();
  });
  el('spin').addEventListener('click', () => spin(!spinning));
  el('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el('stage').requestFullscreen();
      viewer.resize();
    } catch { el('residue').textContent = 'Fullscreen is not supported in this browser.'; }
  });
  check('open-file').addEventListener('change', async () => {
    const file = check('open-file').files?.[0];
    if (!file) return;
    const token = ++request;
    try {
      if (file.size > 8000000) throw new Error('Please choose a structure smaller than 8 MB.');
      if (!/\.(pdb|cif|mmcif)$/i.test(file.name)) throw new Error('Choose a .pdb, .cif or .mmcif file.');
      const data = await file.text();
      if (token !== request) return;
      installStructure(data, /\.pdb$/i.test(file.name) ? 'pdb' : 'cif', file.name, true);
      markDesign('');
    } catch (error) {
      if (token === request) status(error instanceof Error ? error.message : 'Could not open this structure.', true);
    } finally { check('open-file').value = ''; }
  });
  new ResizeObserver(() => viewer.resize()).observe(el('canvas'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) spin(false); });
  el('canvas').tabIndex = 0;
  el('canvas').addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-'].includes(e.key)) return;
    e.preventDefault(); spin(false);
    if (e.key.startsWith('Arrow')) viewer.rotate(e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -8 : 8, e.key === 'ArrowLeft' || e.key === 'ArrowRight' ? 'y' : 'x');
    else viewer.zoom(e.key === '-' ? .9 : 1.1);
    viewer.render();
  });
  const requestedDesign = new URLSearchParams(window.location.search).get('design');
  await loadDesign(designs.find(design => design.id === requestedDesign)?.id ?? designs[0].id);
}

void start().catch(() => status('The 3D viewer could not start. Check that WebGL is enabled, then reload this page.', true));
