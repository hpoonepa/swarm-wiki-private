/**
 * Reader for the `swarm-mesh-v1` protein meshes in static/data/protein (written by scripts/protein/build_mesh.py;
 * the format is documented in scripts/protein/README.md). No three.js here: the scene turns these arrays into geometry.
 */

type Vec3 = [number, number, number];

export interface MeshChain { name: string; vertexStart: number; vertexCount: number; indexStart: number; indexCount: number }

export interface MeshMeta {
  format: 'swarm-mesh-v1';
  source: string;
  units: 'angstrom';
  placeholder: boolean;
  /** position = int16 * scale + offset, per axis. */
  quant: { scale: Vec3; offset: Vec3 };
  chains: MeshChain[];
  regions: Record<string, string>;
  /** [byteOffset, byteLength] of each block in the .bin; every block starts 4-byte aligned. */
  bytes: { positions: [number, number]; normals: [number, number]; regions: [number, number]; indices: [number, number] };
  indexType: 'uint32';
  dockRule?: string;
  /** binder-placeholder only: the docked pose in the protomer frame. */
  dock?: { position: Vec3; quaternion: [number, number, number, number] };
}

/** symmetry.json: 60 row-major [R | t] operators, p' = R p + t, in the protomer frame (capsid centre at the origin). */
export interface Symmetry { source: string; operators: number[][] }

export interface DecodedMesh {
  positions: Float32Array;
  normals: Float32Array;
  regions: Uint8Array;
  indices: Uint32Array;
  chains: MeshMeta['chains'];
}

/** Octahedral decode of (x, y) ∈ [-1, 1]² to a unit vector (the lower hemisphere is folded over the diagonals). */
export function octDecode(x: number, y: number): [number, number, number] {
  let nx = x, ny = y;
  const nz = 1 - Math.abs(x) - Math.abs(y);
  if (nz < 0) { nx = (1 - Math.abs(y)) * (x >= 0 ? 1 : -1); ny = (1 - Math.abs(x)) * (y >= 0 ? 1 : -1); }
  const len = Math.hypot(nx, ny, nz);
  return [nx / len, ny / len, nz / len];
}

/** Inverse of octDecode; matches build_mesh.py's oct_encode (store round(v * 127) as int8). */
export function octEncode([x, y, z]: [number, number, number]): [number, number] {
  const l1 = Math.abs(x) + Math.abs(y) + Math.abs(z);
  let px = x / l1, py = y / l1;
  if (z < 0) { const ox = px; px = (1 - Math.abs(py)) * (ox >= 0 ? 1 : -1); py = (1 - Math.abs(ox)) * (py >= 0 ? 1 : -1); }
  return [px, py];
}

/**
 * Decodes one `.bin` against its `.json`. Typed-array views read the blocks in the platform's byte order;
 * the files are little-endian, as is every browser platform.
 */
export function decodeMesh(meta: MeshMeta, buf: ArrayBuffer): DecodedMesh {
  if (meta.format !== 'swarm-mesh-v1') throw new Error(`decodeMesh: expected format swarm-mesh-v1, got ${String(meta.format)}`);
  const vertexCount = meta.bytes.positions[1] / 6;
  const expect = (block: keyof MeshMeta['bytes'], bytes: number) => {
    if (meta.bytes[block][1] !== bytes) throw new Error(`decodeMesh: ${block} block is ${meta.bytes[block][1]} bytes, expected ${bytes}`);
  };
  if (!Number.isInteger(vertexCount)) throw new Error('decodeMesh: positions block is not a whole number of vertices');
  expect('normals', vertexCount * 2);
  expect('regions', vertexCount);
  if (meta.bytes.indices[1] % 12 !== 0) throw new Error('decodeMesh: indices block is not a whole number of triangles');

  const { scale, offset } = meta.quant;
  const q = new Int16Array(buf, meta.bytes.positions[0], vertexCount * 3);
  const positions = new Float32Array(vertexCount * 3);
  for (let i = 0; i < q.length; i++) positions[i] = q[i] * scale[i % 3] + offset[i % 3];

  const oct = new Int8Array(buf, meta.bytes.normals[0], vertexCount * 2);
  const normals = new Float32Array(vertexCount * 3);
  for (let v = 0; v < vertexCount; v++) {
    const n = octDecode(oct[v * 2] / 127, oct[v * 2 + 1] / 127);
    normals.set(n, v * 3);
  }

  return {
    positions,
    normals,
    regions: new Uint8Array(buf, meta.bytes.regions[0], vertexCount).slice(),
    indices: new Uint32Array(buf, meta.bytes.indices[0], meta.bytes.indices[1] / 4).slice(),
    chains: meta.chains,
  };
}

/**
 * Laplacian smoothing of vertex normals over the triangle graph. Each pass replaces a normal with the normalised
 * sum of itself and its triangle neighbours (a neighbour shared by two triangles counts twice). Cel bands follow
 * the normals, so this turns the speckle of a molecular surface into larger flat shapes; positions are untouched,
 * so the silhouette stays the real surface. Returns a new array.
 */
export function smoothNormals(normals: Float32Array, indices: Uint32Array, iterations: number): Float32Array {
  let cur = normals.slice();
  let next = new Float32Array(cur.length);
  for (let pass = 0; pass < iterations; pass++) {
    next.set(cur);
    for (let t = 0; t < indices.length; t += 3) {
      const a = indices[t] * 3, b = indices[t + 1] * 3, c = indices[t + 2] * 3;
      for (let k = 0; k < 3; k++) {
        next[a + k] += cur[b + k] + cur[c + k];
        next[b + k] += cur[a + k] + cur[c + k];
        next[c + k] += cur[a + k] + cur[b + k];
      }
    }
    for (let v = 0; v < next.length; v += 3) {
      const len = Math.hypot(next[v], next[v + 1], next[v + 2]) || 1;
      next[v] /= len; next[v + 1] /= len; next[v + 2] /= len;
    }
    [cur, next] = [next, cur];
  }
  return cur;
}

async function fetchOk(url: string): Promise<Response> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}

/** Decode the lossless JSON envelope used by iGEM's asset uploader. */
export function decodeMeshBuffer(payload: { format: string; encoding: string; byteLength: number; data: string }): ArrayBuffer {
  if (payload.format !== 'swarm-mesh-buffer-v1' || payload.encoding !== 'base64') {
    throw new Error('Unsupported mesh buffer format');
  }
  const raw = atob(payload.data);
  if (raw.length !== payload.byteLength) throw new Error('Incomplete mesh buffer');
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

/** Fetches metadata and its lossless JSON mesh buffer from the uploaded asset prefix. */
export async function loadMesh(base: string, name: string): Promise<{ meta: MeshMeta; mesh: DecodedMesh }> {
  const [meta, buf] = await Promise.all([
    fetchOk(`${base}${name}.json`).then((r) => r.json() as Promise<MeshMeta>),
    fetchOk(`${base}${name}-mesh.json`).then((r) => r.json()).then(decodeMeshBuffer),
  ]);
  return { meta, mesh: decodeMesh(meta, buf) };
}

export async function loadSymmetry(base: string): Promise<Symmetry> {
  return (await fetchOk(`${base}symmetry.json`)).json() as Promise<Symmetry>;
}
