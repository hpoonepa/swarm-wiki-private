/**
 * ProteinScene renderer (spec §9.2, §19 delta 1). Loaded lazily by <protein-scene> when it nears the viewport.
 *
 * Modes:
 * - capsid: the 5L8Q protomer (VP1, VP2, VP3 as three InstancedMeshes) × the 60 assembly operators, and the
 *   placeholder minibinder docked on every protomer's VP3 P-domain (saturating binding; one binder on a 400 Å
 *   capsid would be a few pixels, and the dock pose is defined per protomer). The binders grow in only as docking
 *   approaches (PHASES.binders).
 * - complex: a close view of one protomer and the binder at its dock pose.
 * - pdomain: the 5G51 P-domain close-up, all honey.
 *
 * Motion grammar: rotation, scale and the P-domain glow are scrubbed by progress. Docking and the shell coming
 * apart are discrete events with hysteresis, played on their own clocks and retargeted from where they are.
 * The scene renders only when something changes (progress, drag, an event's frames, a resize), never offscreen.
 *
 * three is imported from its `src/` modules (see toon.ts): WebGPURenderer.Nodes is the node-material-only renderer,
 * which drops the classic-material library the scene never uses.
 */
import WebGPURenderer from 'three/src/renderers/webgpu/WebGPURenderer.Nodes.js';
import { BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Color } from 'three/src/math/Color.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Group } from 'three/src/objects/Group.js';
import { InstancedMesh } from 'three/src/objects/InstancedMesh.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { GPUFeatureName } from 'three/src/renderers/webgpu/utils/WebGPUConstants.js';
import type MeshBasicNodeMaterial from 'three/src/materials/nodes/MeshBasicNodeMaterial.js';
import { animate, motionValue, type MotionValue } from 'motion';
import { physics } from '../../motion/springs';
import { DragRotate } from './controls';
import { loadMesh, loadSymmetry, smoothNormals, type DecodedMesh, type MeshMeta, type Symmetry } from './loader';
import { glowUniform, resolvePalette, toonMaterial, type Palette } from './toon';

export type Mode = 'capsid' | 'complex' | 'pdomain';
export type Backend = 'webgpu' | 'webgl2';

/** Progress thresholds and ranges (spec §19 delta 1, C8 benchmark amendments). */
export const PHASES = {
  rotateIn: [0, 0.4],
  glow: [0.2, 0.45],
  /** The binders grow in (scrubbed, each about its own centre) as docking approaches; hidden before. */
  binders: [0.38, 0.48],
  dock: { on: 0.5, off: 0.42 },
  shell: { on: 0.78, off: 0.7 },
} as const;
/** The docked, intact state: the static figure, reduced motion, and the progress a scene starts at. */
export const DOCKED_PROGRESS = 0.75;

const ROTATE_IN_DEG = -40;
const ROTATE_IN_SCALE = 0.9;
const DOCK_SPRING = { type: 'spring', bounce: 0.15, duration: 0.9 } as const;
const DOCK_APPROACH = 40; // Å out along the radial line
const SHELL_OUT = 30; // Å, radially
const SHELL_TILT = (7 * Math.PI) / 180;
const SHELL_SECONDS = 1.2;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const; // --ease-in-out
const FOV = 30;
/** Normal-smoothing passes for the protein surfaces (cel bands follow normals: fewer, larger shapes). */
const SMOOTHING = 16;
/** Where the docking P-domain faces at rest: up and to the right, toward the viewer, so the binder's approach crosses the screen. */
const SHOW_DIR = new Vector3(0.5, 0.4, 0.77).normalize();
/** An anchor is visible while its outward normal faces the camera at least this squarely (cosine). */
const ANCHOR_FACING = 0.35;
/** How far below VP3's outermost point (Å) its label's surface point may lie, and how far (radians, about the capsid
 * centre) it keeps from every P domain (whose surfaces reach about 8° from their centres). */
const VP3_SHELL = 12;
const VP3_CLEAR = (14 * Math.PI) / 180;

export interface SceneOptions {
  mode: Mode;
  /** Uploaded filename prefix; defaults to the team's iGEM asset folder. */
  srcBase?: string;
  forceWebGL?: boolean;
  reduced: boolean;
  /** Progress applied (instantly) at mount. */
  progress: number;
}

export type AnchorId = 'p-domain' | 'vp3' | 'binder';
/**
 * A labelled point on the model as of the last drawn frame, in CSS px from the host's top-left corner. `visible`: the
 * point faces the camera and lies inside the host.
 */
export interface Anchor { id: AnchorId; x: number; y: number; visible: boolean }

export interface SceneHandle {
  /** The backend drawing now: it can change at runtime ('poster' once the scene has given up). */
  readonly backend: Backend | 'poster';
  /** Scrubs rotation, scale and glow; fires dock/shell events across their thresholds. `instant` skips their animation. */
  setProgress(p: number, opts?: { instant?: boolean }): void;
  setReduced(reduced: boolean): void;
  /**
   * Read-only: the front protomer's P domain, VP3 body and binder on screen, updated with every drawn frame (the host
   * also fires an `anchors` event then, detail `{ anchors }`). Empty in pdomain mode and once the scene has ended.
   */
  anchors(): Anchor[];
  destroy(): void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const DEG = Math.PI / 180;

function sharedAttributes(mesh: DecodedMesh, withRegion: boolean, smoothing: number) {
  return {
    position: new BufferAttribute(mesh.positions, 3),
    normal: new BufferAttribute(smoothNormals(mesh.normals, mesh.indices, smoothing), 3),
    region: withRegion ? new BufferAttribute(Float32Array.from(mesh.regions), 1) : null,
  };
}

function chainGeometry(mesh: DecodedMesh, chain: MeshMeta['chains'][number], attrs: ReturnType<typeof sharedAttributes>) {
  const g = new BufferGeometry();
  g.setAttribute('position', attrs.position);
  g.setAttribute('normal', attrs.normal);
  if (attrs.region) g.setAttribute('region', attrs.region);
  // Indices are absolute into the file's vertex arrays, so each chain shares the vertex buffers.
  g.setIndex(new BufferAttribute(mesh.indices.subarray(chain.indexStart, chain.indexStart + chain.indexCount), 1));
  return g;
}

/** Mean of the vertices (optionally only region-1 ones). */
function centroid(mesh: DecodedMesh, regionOnly = false): Vector3 {
  const c = new Vector3();
  let n = 0;
  for (let i = 0; i < mesh.regions.length; i++) {
    if (regionOnly && mesh.regions[i] !== 1) continue;
    c.x += mesh.positions[i * 3]; c.y += mesh.positions[i * 3 + 1]; c.z += mesh.positions[i * 3 + 2];
    n++;
  }
  return c.divideScalar(Math.max(n, 1));
}

/**
 * A point on VP3's outer surface for its label, clear of the honey P domains: of the VP3 vertices outside the P
 * domain, within VP3_SHELL Å of the chain's outermost one and at least VP3_CLEAR from every P domain of the assembly
 * (`pDirs`, unit vectors), the one closest in angle to the chain body's centroid (the middle of VP3, not a seam
 * between protomers). With no such vertex, the one farthest from every P domain.
 */
function vp3Surface(mesh: DecodedMesh, pDirs: Vector3[]): Vector3 {
  const chain = mesh.chains.find((c) => c.name === 'VP3');
  const start = chain?.vertexStart ?? 0, end = chain ? start + chain.vertexCount : mesh.regions.length;
  const v = new Vector3(), body = new Vector3(), nearest = new Vector3(), clearest = new Vector3();
  let outer = 0;
  for (let i = start; i < end; i++) {
    if (mesh.regions[i] !== 0) continue;
    v.fromArray(mesh.positions, i * 3);
    body.add(v);
    outer = Math.max(outer, v.length());
  }
  body.normalize();
  const minClear = Math.cos(VP3_CLEAR);
  let bestToBody = -Infinity, bestClear = Infinity;
  for (let i = start; i < end; i++) {
    if (mesh.regions[i] !== 0) continue;
    const r = v.fromArray(mesh.positions, i * 3).length();
    if (r < outer - VP3_SHELL) continue;
    let closest = -1; // the largest cosine to a P domain: the nearest one
    for (const d of pDirs) closest = Math.max(closest, v.dot(d) / r);
    if (closest < bestClear) { bestClear = closest; clearest.copy(v); }
    const toBody = v.dot(body) / r;
    if (closest <= minClear && toBody > bestToBody) { bestToBody = toBody; nearest.copy(v); }
  }
  return bestToBody > -Infinity ? nearest : clearest;
}

/** Smallest sphere about `center` that holds every point. */
function radiusAbout(center: Vector3, points: Iterable<Vector3>): number {
  let r = 0;
  for (const p of points) r = Math.max(r, p.distanceTo(center));
  return r;
}

/** The mesh's vertices as fresh vectors, optionally transformed. */
function points(mesh: DecodedMesh, m?: Matrix4): Vector3[] {
  const out: Vector3[] = [];
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const v = new Vector3(mesh.positions[i], mesh.positions[i + 1], mesh.positions[i + 2]);
    out.push(m ? v.applyMatrix4(m) : v);
  }
  return out;
}

/** Centre of the axis-aligned bounds of `pts`. */
function boundsCentre(pts: Vector3[]): Vector3 {
  const lo = pts[0].clone(), hi = pts[0].clone();
  for (const p of pts) { lo.min(p); hi.max(p); }
  return lo.add(hi).multiplyScalar(0.5);
}

type Loaded = { meta: MeshMeta; mesh: DecodedMesh };
type DevHost = HTMLElement & { __loseDevice?: () => void };
type SceneData = [main: Loaded, binder: Loaded | null, symmetry: Symmetry | null];

/** The part of GPUDevice the first-frame check uses (the DOM lib here has no WebGPU types). */
interface GpuDeviceLike {
  addEventListener(type: 'uncapturederror', cb: () => void): void;
  removeEventListener(type: 'uncapturederror', cb: () => void): void;
  queue: { onSubmittedWorkDone(): Promise<void> };
}

/** WebGPU started but its first frame failed on the GPU (a driver that cannot present, for one). */
class FirstFrameError extends Error {}
/** The host left the document while the scene was being built. */
class CancelledError extends Error {}

/** The parts of the WebGPU adapter API the renderer choice uses (the DOM lib here has no WebGPU types). */
interface GpuAdapterLike {
  features: ReadonlySet<string>;
  info?: { isFallbackAdapter?: boolean };
  isFallbackAdapter?: boolean;
  requestDevice(descriptor: { requiredFeatures: string[] }): Promise<unknown>;
}
type GpuLike = { requestAdapter(options?: { featureLevel?: string }): Promise<GpuAdapterLike | null> };
/** A WebGPU device the scene requested itself, so it must destroy it. */
type OwnDevice = { destroy(): void };

/** Renderer names of software rasterisers, which draw the capsid at seconds per frame. */
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** Hands the main thread back between the mount's steps (scheduler.yield where supported), so no step blocks input. */
function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return scheduler?.yield ? scheduler.yield() : new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * A renderer on hardware only: software rendering (a fallback WebGPU adapter, or a WebGL 2 context the browser flags
 * with a major performance caveat, such as SwiftShader) would block the main thread for whole seconds per capsid frame,
 * so the element keeps its poster instead. WebGPU unless `forceWebGL` or no hardware adapter; then WebGL 2.
 */
async function createRenderer(forceWebGL: boolean): Promise<{ renderer: WebGPURenderer; device: OwnDevice | null }> {
  const gpu = (navigator as Navigator & { gpu?: GpuLike }).gpu;
  if (!forceWebGL && gpu) {
    try {
      const adapter = await gpu.requestAdapter({ featureLevel: 'compatibility' });
      if (adapter && !(adapter.info?.isFallbackAdapter ?? adapter.isFallbackAdapter)) {
        // The features three would request itself (it asks for every supported one it knows).
        const known: string[] = Object.values(GPUFeatureName);
        const device = (await adapter.requestDevice({ requiredFeatures: known.filter((f) => adapter.features.has(f)) })) as OwnDevice;
        return { renderer: new WebGPURenderer({ antialias: true, alpha: true, device } as ConstructorParameters<typeof WebGPURenderer>[0]), device };
      }
    } catch {
      // No usable WebGPU device: try WebGL 2.
    }
  }
  const canvas = document.createElement('canvas');
  // The attributes three's WebGL backend would ask for (antialias for its default 4 samples; alpha, as it always does).
  const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true, antialias: true, alpha: true, depth: true, stencil: false });
  if (!context) throw new Error('no hardware WebGL 2 context (software rendering is refused)');
  // Some browsers allow a software rasteriser despite the caveat flag (headless Chromium runs SwiftShader that way).
  const info = context.getExtension('WEBGL_debug_renderer_info');
  const rendererName = String(info ? context.getParameter(info.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER));
  if (SOFTWARE_GL.test(rendererName)) {
    context.getExtension('WEBGL_lose_context')?.loseContext();
    throw new Error(`software WebGL 2 (${rendererName}) is refused`);
  }
  return { renderer: new WebGPURenderer({ antialias: true, alpha: true, forceWebGL: true, canvas, context } as ConstructorParameters<typeof WebGPURenderer>[0]), device: null };
}

/**
 * Disposes an initialised renderer, then destroys the WebGPU device the scene made for it: three destroys only devices
 * it created itself. dispose() is async; a failure there has nothing left to clean up.
 */
function release(renderer: WebGPURenderer, device: OwnDevice | null): void {
  renderer.dispose().catch(() => {}).finally(() => device?.destroy());
}

type LostApi = 'WebGPU' | 'WebGL';
type Built = SceneHandle & { readonly backend: Backend };

/**
 * Mounts the scene on WebGPU, or on WebGL 2 when there is no hardware WebGPU adapter or when WebGPU starts but
 * fails its first frame (GPU errors or a lost device). Software rendering is refused (createRenderer). Rejects when
 * neither backend can start; the element then keeps its poster.
 *
 * The build yields to the main thread between its steps (the normals smoothing, the meshes, the framing, an
 * asynchronous shader compile before the first frame), so mounting never blocks the page for long.
 *
 * At runtime, a lost WebGPU device is rebuilt once on WebGL 2 (`data-fallback="webgpu-device-lost"`); a lost
 * WebGL context, or a rebuild that fails, ends on the poster (`data-backend="poster"`, `data-ready` cleared).
 */
export async function mountScene(host: HTMLElement, opts: SceneOptions): Promise<SceneHandle> {
  // Start the downloads while the renderer initialises.
  const srcBase = opts.srcBase ?? 'https://static.igem.wiki/teams/6185/wiki/lastmin/protein-';
  const data: Promise<SceneData> = Promise.all([
    loadMesh(srcBase, opts.mode === 'pdomain' ? 'pdomain' : 'dwv-protomer'),
    opts.mode !== 'pdomain' ? loadMesh(srcBase, 'binder-placeholder') : null,
    opts.mode === 'capsid' ? loadSymmetry(srcBase) : null,
  ]);
  data.catch(() => {}); // an init failure below must not leave this rejection unhandled

  let progress = clamp01(opts.progress), reduced = opts.reduced;
  let inner: Built | null = null, destroyed = false, rebuilt = false;
  const now = (): SceneOptions => ({ ...opts, progress, reduced });
  // A build checks this after each of its yields and stops (releasing what it made) once the host has left the page.
  const token = { get cancelled() { return destroyed || !host.isConnected; } };

  const onLost = (api: LostApi) => {
    if (destroyed || !inner) return;
    inner.destroy();
    inner = null;
    if (api !== 'WebGPU' || rebuilt) {
      host.dataset.backend = 'poster';
      return;
    }
    rebuilt = true;
    host.dataset.fallback = 'webgpu-device-lost';
    build(host, now(), data, true, onLost, token).then((s) => {
      if (destroyed) return s.destroy();
      inner = s;
      s.setReduced(reduced);
      s.setProgress(progress, { instant: true });
      host.dataset.backend = s.backend;
    }, () => {
      if (!destroyed) host.dataset.backend = 'poster';
    });
  };

  if (!opts.forceWebGL) {
    try {
      inner = await build(host, now(), data, false, onLost, token);
    } catch (err) {
      if (!(err instanceof FirstFrameError)) throw err;
      host.dataset.fallback = 'webgpu-first-frame';
    }
  }
  inner ??= await build(host, now(), data, true, onLost, token);

  return {
    get backend() { return inner?.backend ?? 'poster'; },
    setProgress(p, o) {
      progress = clamp01(p);
      inner?.setProgress(progress, o);
    },
    setReduced(r) {
      reduced = r;
      inner?.setReduced(r);
    },
    anchors() {
      return inner?.anchors() ?? [];
    },
    destroy() {
      destroyed = true;
      inner?.destroy();
      inner = null;
    },
  };
}

async function build(host: HTMLElement, opts: SceneOptions, data: Promise<SceneData>, forceWebGL: boolean, onLost: (api: LostApi) => void, token: { readonly cancelled: boolean }): Promise<Built> {
  const { mode } = opts;
  const withBinder = mode !== 'pdomain';
  const { renderer, device: ownDevice } = await createRenderer(forceWebGL);
  // A lost device or context: until the first frame has been checked it only marks this build failed (that
  // covers a loss while the meshes download); after that the mount handles it (rebuild or poster).
  let firstFrameDone = false, gpuFailed = false;
  renderer.onDeviceLost = (info) => {
    if (firstFrameDone) onLost(info.api);
    else gpuFailed = true;
  };
  let main: Loaded, binderData: Loaded | null, symmetry: Symmetry | null, palette: Palette;
  const style = getComputedStyle(host);
  // A failed init() is not followed by dispose(): on such a renderer dispose() calls setAnimationLoop(null), which
  // re-awaits that init() without catching it (an unhandled rejection), and nothing was set up to release.
  try {
    await renderer.init();
  } catch (err) {
    ownDevice?.destroy();
    throw err;
  }
  const backend: Backend = (renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend ? 'webgpu' : 'webgl2';
  const geometries: BufferGeometry[] = [];
  const materials: MeshBasicNodeMaterial[] = [];
  /** Releases what the build has made so far; for a build that stops before its first frame. */
  function abandon(err: unknown): never {
    for (const g of geometries) g.dispose();
    for (const m of materials) m.dispose();
    release(renderer, ownDevice);
    throw err;
  }
  /** Yields, then stops if the host has left the page or the GPU was lost meanwhile. */
  const checkpoint = async () => {
    await yieldToMain();
    if (token.cancelled) throw new CancelledError('the scene left the page while it was being built');
    if (gpuFailed) {
      if (backend === 'webgpu') throw new FirstFrameError('the WebGPU device was lost while the scene loaded');
      throw new Error('the WebGL 2 context was lost while the scene loaded');
    }
  };
  try {
    [main, binderData, symmetry] = await data;
    palette = resolvePalette((name) => style.getPropertyValue(`--${name}`));
    await checkpoint();
  } catch (err) {
    abandon(err);
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // ---- scene graph: scene → root (turn + scale about the pivot) → content (offset by −pivot) ----
  const scene = new Scene();
  // Let the homepage's ambient colour continue behind the molecule.
  scene.background = null;
  renderer.setClearColor(0x000000, 0);
  const camera = new PerspectiveCamera(FOV, 1, 1, 1000);
  const root = new Group();
  const content = new Group();
  root.add(content);
  scene.add(root);

  const glow = glowUniform();
  const material = (m: MeshBasicNodeMaterial) => (materials.push(m), m);

  const mesh = main.mesh;
  const operators = symmetry
    ? symmetry.operators.map((o) => new Matrix4().set(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], 0, 0, 0, 1))
    : [new Matrix4()];

  const attrs = sharedAttributes(mesh, mode !== 'pdomain', SMOOTHING);
  await checkpoint().catch(abandon); // the 16-pass normals smoothing is the heaviest loop
  const chainMeshes: InstancedMesh[] = [];
  const chainMaterial = (name: string) => {
    const rim = palette.rim;
    if (mode === 'pdomain') return material(toonMaterial({ bands: palette.honey, rim, region: { bands: palette.honey, glow }, wholeRegion: true }));
    if (name === 'VP1') return material(toonMaterial({ bands: palette.vp1, rim }));
    if (name === 'VP2') return material(toonMaterial({ bands: palette.vp2, rim }));
    return material(toonMaterial({ bands: palette.vp3, rim, region: { bands: palette.honey, glow } }));
  };
  for (const chain of mesh.chains) {
    const g = chainGeometry(mesh, chain, attrs);
    geometries.push(g);
    const im = new InstancedMesh(g, chainMaterial(chain.name), operators.length);
    im.frustumCulled = false; // instances move apart; the scene is always framed whole
    chainMeshes.push(im);
    content.add(im);
  }

  // ---- the shell coming apart: each protomer slides out along its own radial line and tilts about its centre ----
  const c0 = centroid(mesh);
  const tilt0 = new Vector3().crossVectors(c0.clone().normalize(), new Vector3(0, 1, 0)).normalize();
  const instances = operators.map((op) => {
    const c = c0.clone().applyMatrix4(op);
    return { op, c, out: c.clone().normalize(), axis: tilt0.clone().transformDirection(op) };
  });
  const tmpM = new Matrix4(), tmpR = new Matrix4(), tmpT = new Matrix4();
  function protomerMatrix(i: number, apart: number, out: Matrix4): Matrix4 {
    const { op, c, out: dir, axis } = instances[i];
    if (apart === 0) return out.copy(op);
    // out = T(dir·18a) · T(c) · R(axis, tilt·a) · T(−c) · op
    tmpT.makeTranslation(dir.x * SHELL_OUT * apart + c.x, dir.y * SHELL_OUT * apart + c.y, dir.z * SHELL_OUT * apart + c.z);
    tmpR.makeRotationAxis(axis, SHELL_TILT * apart);
    tmpM.makeTranslation(-c.x, -c.y, -c.z);
    return out.copy(tmpT).multiply(tmpR).multiply(tmpM).multiply(op);
  }

  // ---- the binder: docked pose from its metadata; undocked is 40 Å further out on the radial line ----
  let binder: InstancedMesh | null = null;
  const dockPos = new Vector3(), dockQuat = new Quaternion(), dockOut = new Vector3();
  if (binderData?.meta.dock) {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(binderData.mesh.positions, 3));
    g.setAttribute('normal', new BufferAttribute(binderData.mesh.normals, 3));
    g.setIndex(new BufferAttribute(binderData.mesh.indices, 1));
    geometries.push(g);
    binder = new InstancedMesh(g, material(toonMaterial({ bands: palette.binder, rim: palette.rim })), 1);
    binder.frustumCulled = false;
    content.add(binder);
    dockPos.fromArray(binderData.meta.dock.position);
    dockQuat.fromArray(binderData.meta.dock.quaternion);
    dockOut.copy(dockPos).normalize();
    if (binderData.meta.placeholder) host.dataset.binder = 'placeholder';
  }
  const binderPose = (dock: number, out: Matrix4, scale = 1, arrival = 1) => {
    const inverseRest = rest.clone().invert();
    const position = dockPos.clone().add(new Vector3(-200, -30, 70).applyQuaternion(inverseRest).multiplyScalar(1 - dock));
    position.add(new Vector3(-900, 100, 0).applyQuaternion(inverseRest).multiplyScalar(1 - arrival));
    return out.compose(position, dockQuat, new Vector3(scale, scale, scale));
  };
  await checkpoint().catch(abandon);

  // ---- framing: pivot, radius and rest orientation per mode ----
  const pivot = new Vector3();
  let radius: number;
  /** For the elongated modes: their points at rest, relative to the pivot, fitted exactly in frame. */
  let fitPoints: Vector3[] | null = null;
  const rest = new Quaternion();
  if (mode === 'capsid') {
    // A sphere: its bounding sphere is tight at any angle. Leave room for the shell coming apart and for the
    // binders hovering 40 Å out before they dock.
    radius = radiusAbout(pivot, points(mesh)) + SHELL_OUT;
    if (binderData) radius = Math.max(radius, radiusAbout(pivot, points(binderData.mesh, binderPose(1, new Matrix4()))));
    rest.setFromUnitVectors(centroid(mesh, true).normalize(), SHOW_DIR);
  } else {
    // The protomer (with its binder docked and 40 Å out, so the approach stays in view) and the P-domain.
    const pts = points(mesh);
    if (mode === 'complex' && binderData) for (const d of [0, 1]) pts.push(...points(binderData.mesh, binderPose(d, new Matrix4())));
    pivot.copy(boundsCentre(pts));
    radius = radiusAbout(pivot, pts);
    if (mode === 'complex') rest.setFromUnitVectors(centroid(mesh, true).normalize(), SHOW_DIR);
    else rest.setFromAxisAngle(new Vector3(1, 0, 0), 20 * DEG);
    fitPoints = pts.map((p) => p.sub(pivot).applyQuaternion(rest));
  }
  content.position.copy(pivot).negate();

  // ---- anchors (read-only): the front protomer's P domain, VP3 body and binder on screen, after each frame ----
  // The front protomer starts as the showcased one (the one the rest pose turns to SHOW_DIR) and is kept while it
  // faces the camera; once it turns away, the protomer whose P domain now points most nearly along SHOW_DIR takes
  // over, so labels stay on the model wherever it is turned. Points are in the protomer frame (capsid centre at the
  // origin), so each one's outward normal is its own direction from the origin.
  let anchorsNow: Anchor[] = [];
  const pCentre = centroid(mesh, true);
  const vp3Point = mode === 'pdomain' ? null : vp3Surface(mesh, instances.map(({ op }) => pCentre.clone().applyMatrix4(op).normalize()));
  const anchorLocal = vp3Point && { pDomain: pCentre, vp3: vp3Point, vp3Dir: vp3Point.clone().normalize() };
  const pDir = anchorLocal ? anchorLocal.pDomain.clone().normalize() : null;
  let front = 0;
  if (pDir) {
    let best = -Infinity;
    instances.forEach(({ op }, i) => {
      const d = pDir.clone().transformDirection(op).dot(pDir);
      if (d > best) { best = d; front = i; }
    });
  }
  const aWorld = new Matrix4(), aProto = new Matrix4();
  const aPoint = new Vector3(), aNormal = new Vector3(), aView = new Vector3(), aBinder = new Vector3();
  /** How squarely `local` (under `world`) faces the camera: 1 head-on, 0 edge-on, negative facing away. */
  const facing = (local: Vector3, world: Matrix4, outward: Vector3) => {
    aPoint.copy(local).applyMatrix4(world);
    aNormal.copy(outward).transformDirection(world);
    return aNormal.dot(aView.copy(camera.position).sub(aPoint).normalize());
  };
  const protomerWorld = (i: number, a: number) => aWorld.multiplyMatrices(content.matrixWorld, protomerMatrix(i, a, aProto));
  function updateAnchors(): void {
    if (!anchorLocal || !pDir) return;
    const a = apartT.get();
    if (facing(anchorLocal.pDomain, protomerWorld(front, a), pDir) < ANCHOR_FACING) {
      let best = -Infinity;
      for (let i = 0; i < instances.length; i++) {
        const d = aNormal.copy(pDir).transformDirection(protomerWorld(i, a)).dot(SHOW_DIR);
        if (d > best) { best = d; front = i; }
      }
    }
    const world = protomerWorld(front, a);
    const at = (id: AnchorId, local: Vector3, m: Matrix4, outward: Vector3): Anchor => {
      const f = facing(local, m, outward);
      aPoint.project(camera); // aPoint holds the world position from facing()
      const x = ((aPoint.x + 1) / 2) * width, y = ((1 - aPoint.y) / 2) * height;
      return { id, x, y, visible: f > ANCHOR_FACING && x >= 0 && x <= width && y >= 0 && y <= height };
    };
    const out = [
      at('p-domain', anchorLocal.pDomain, world, pDir),
      at('vp3', anchorLocal.vp3, world, anchorLocal.vp3Dir),
    ];
    // The binder mesh is centred on its origin, so its pose's translation is its centre.
    if (binder) {
      const binderMatrix = content.matrixWorld.clone().multiply(operators[0]);
      const position = new Vector3().setFromMatrixPosition(binderPose(dockT.get(), new Matrix4(), 1, smooth(ramp(progress, PHASES.binders))));
      const b = at('binder', position, binderMatrix, dockOut);
      out.push({ ...b, visible: b.visible && progress > .44 });
    }
    anchorsNow = out;
    host.dispatchEvent(new CustomEvent('anchors', { detail: { anchors: anchorsNow } }));
  }

  await checkpoint().catch(abandon);
  // Compile every material's shaders now, asynchronously (off the main thread where the backend can), so the first
  // frame only draws.
  await renderer.compileAsync(scene, camera).catch(abandon);
  await checkpoint().catch(abandon);

  function frame(width: number, height: number) {
    camera.aspect = width / height;
    const tanV = Math.tan((FOV / 2) * DEG);
    const tanH = tanV * camera.aspect;
    let dist: number;
    if (fitPoints) {
      // A view-space point (x, y, z) is in frame when dist ≥ |x| / tanH + z (and likewise for y): exact for the
      // rest pose, with a margin for turning it by hand.
      dist = 0;
      for (const p of fitPoints) dist = Math.max(dist, Math.max(Math.abs(p.x) / tanH, Math.abs(p.y) / tanV) + p.z);
      dist *= 1.12;
    } else {
      dist = (radius / Math.sin(Math.atan(Math.min(tanV, tanH)))) * 1.04;
    }
    camera.position.set(0, 0, dist);
    // The enlarged binder flies in ahead of the shell before returning to its
    // docked scale. Keep that complete reveal inside the camera's depth range.
    camera.near = Math.max(1, dist - radius * 4);
    camera.far = dist + radius * 4;
    camera.updateProjectionMatrix();
  }

  // ---- state ----
  let reduced = opts.reduced;
  let progress = clamp01(opts.progress);
  let docked = false, apart = false;
  const dockT: MotionValue<number> = motionValue(0);
  const apartT: MotionValue<number> = motionValue(0);
  let lastApart = Number.NaN, lastApartBinder = Number.NaN, lastDock = Number.NaN, lastBinderScale = Number.NaN;
  const controls = new DragRotate(host, {
    onChange: () => requestRender(),
    reduced: () => reduced,
    degPerPx: () => 180 / Math.max(1, Math.min(host.clientWidth, host.clientHeight)),
  });

  const qYaw = new Quaternion(), qPitch = new Quaternion(), Y = new Vector3(0, 1, 0), X = new Vector3(1, 0, 0);
  /** The binders' size: hidden until docking approaches, then grown in as progress crosses PHASES.binders. */
  const binderScale = () => 6 - 5 * smooth(ramp(progress, [.58, .78]));
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const tmpInst = new Matrix4(), binderLocal = new Matrix4();
  function applyState() {
    const turnIn = mode === 'capsid' ? smooth(ramp(progress, [0, .22])) : 1;
    const yaw = controls.yaw + ROTATE_IN_DEG * (1 - turnIn);
    qYaw.setFromAxisAngle(Y, yaw * DEG);
    qPitch.setFromAxisAngle(X, controls.pitch * DEG);
    root.quaternion.copy(qPitch).multiply(qYaw).multiply(rest);
    root.scale.setScalar(ROTATE_IN_SCALE + (1 - ROTATE_IN_SCALE) * turnIn);
    glow.value = mode === 'capsid' ? ramp(progress, PHASES.glow) : mode === 'complex' ? 1 : 0;

    const a = apartT.get();
    if (a !== lastApart) {
      lastApart = a;
      for (let i = 0; i < instances.length; i++) {
        protomerMatrix(i, a, tmpInst);
        for (const im of chainMeshes) im.setMatrixAt(i, tmpInst);
      }
      for (const im of chainMeshes) im.instanceMatrix.needsUpdate = true;
    }
    const d = dockT.get(), bs = binderScale();
    if (binder) {
      lastDock = d;
      lastApartBinder = a;
      lastBinderScale = bs;
      binder.visible = true;
      binderPose(d, binderLocal, bs, smooth(ramp(progress, PHASES.binders)));
      binder.setMatrixAt(0, protomerMatrix(0, 0, tmpInst).multiply(binderLocal));
      binder.instanceMatrix.needsUpdate = true;
    }
  }

  // ---- events (threshold + hysteresis) ----
  const emit = (name: 'dock' | 'shell', detail: object) => host.dispatchEvent(new CustomEvent(name, { detail }));
  function run(value: MotionValue<number>, target: number, instant: boolean, spec: 'dock' | 'shell') {
    if (instant) return value.jump(target);
    if (spec === 'dock') animate(value, target, { ...physics(DOCK_SPRING) });
    else animate(value, target, { duration: SHELL_SECONDS * Math.abs(target - value.get()), ease: [...EASE_IN_OUT] });
  }
  function updateEvents(_instant: boolean, initial: boolean) {
    if (!withBinder) return;
    const amount = smooth(ramp(progress, [.58, .78]));
    const wasDocked = docked;
    docked = amount > .999;
    host.dataset.docked = String(docked);
    host.dataset.shell = 'intact';
    dockT.jump(amount);
    apartT.jump(0);
    if (wasDocked !== docked && !initial) emit('dock', { docked });
  }

  const unsubs = [dockT.on('change', () => requestRender()), apartT.on('change', () => requestRender())];

  // ---- render policy: on demand, one frame per animation frame at most, never while offscreen ----
  let raf = 0, dirty = false, visible = false, frames = 0, width = 0, height = 0;
  function requestRender() {
    dirty = true;
    if (raf || (!visible && frames > 0)) return;
    raf = requestAnimationFrame(draw);
  }
  function draw() {
    raf = 0;
    // The first frame renders even offscreen (the scene loads a viewport early), so it is ready when scrolled to.
    if (!dirty || (!visible && frames > 0) || width === 0 || height === 0) return;
    dirty = false;
    applyState();
    renderer.render(scene, camera);
    updateAnchors();
    host.dataset.frames = String(++frames);
    if (frames === 1) host.toggleAttribute('data-ready', true);
  }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (w === width && h === height) return;
    width = w; height = h;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    frame(w, h);
    requestRender();
  }

  const canvas = renderer.domElement;
  canvas.classList.add('protein__canvas');
  host.prepend(canvas);
  const io = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible && dirty) requestRender();
  });
  io.observe(host);
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Draw the first frame now, and on WebGPU wait for the GPU to finish it: validation errors arrive as
  // `uncapturederror` events, and a canvas that cannot present stays blank without any exception.
  const device = backend === 'webgpu' ? (renderer.backend as unknown as { device: GpuDeviceLike }).device : null;
  const onGpuError = () => { gpuFailed = true; };
  device?.addEventListener('uncapturederror', onGpuError);
  updateEvents(true, true);
  resize();
  if (raf) { cancelAnimationFrame(raf); draw(); }

  const handle: Built = {
    backend,
    setProgress(p, o = {}) {
      progress = clamp01(p);
      updateEvents(reduced || !!o.instant, false);
      requestRender();
    },
    setReduced(r) {
      reduced = r;
      if (!r) return;
      // Stop anything in flight at its end state.
      controls.stop();
      dockT.jump(docked ? 1 : 0);
      apartT.jump(apart ? 1 : 0);
      requestRender();
    },
    anchors() {
      return anchorsNow;
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.destroy();
      for (const u of unsubs) u();
      dockT.destroy();
      apartT.destroy();
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      release(renderer, ownDevice);
      canvas.remove();
      host.removeAttribute('data-ready');
      delete host.dataset.frames;
      anchorsNow = [];
      if (anchorLocal) host.dispatchEvent(new CustomEvent('anchors', { detail: { anchors: anchorsNow } }));
      if (import.meta.env.DEV) delete (host as DevHost).__loseDevice;
    },
  };
  // Dev and test hook: runs the lost-device handler as if the GPU had dropped this renderer.
  if (import.meta.env.DEV) {
    (host as DevHost).__loseDevice = () =>
      renderer.onDeviceLost({ api: backend === 'webgpu' ? 'WebGPU' : 'WebGL', message: 'simulated (dev hook)', reason: null, originalEvent: null });
  }

  if (device) {
    try {
      await device.queue.onSubmittedWorkDone();
      await new Promise((r) => setTimeout(r, 50)); // let the error events of that submission arrive
    } catch {
      gpuFailed = true; // the device was lost while drawing it
    }
    device.removeEventListener('uncapturederror', onGpuError);
  }
  if (gpuFailed) {
    handle.destroy();
    if (device) throw new FirstFrameError('WebGPU could not draw the first frame');
    throw new Error('the WebGL 2 context was lost drawing the first frame');
  }
  firstFrameDone = true;
  return handle;
}
