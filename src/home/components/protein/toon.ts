/**
 * Cel shading for ProteinScene, in TSL: three flat lightness bands and a stepped rim, no outlines.
 * One key light plus hemisphere ambient, computed in view space so the lighting stays put while the
 * molecule turns under it (the way the canopy art is lit from a fixed upper left).
 *
 * three is imported from its `src/` modules rather than the `three/webgpu` + `three/tsl` bundles:
 * the prebuilt bundles do not tree-shake, and the lazy protein chunk must stay under 250 KB gzip.
 */
import MeshBasicNodeMaterial from 'three/src/materials/nodes/MeshBasicNodeMaterial.js';
import { attribute, color, dot, float, max, mix, normalView, positionViewDirection, pow, step, uniform, vec3 } from 'three/src/nodes/TSL.js';

export type Triple = readonly [dark: number, mid: number, light: number];
/** A float uniform, 0..1. */
export type GlowUniform = ReturnType<typeof glowUniform>;

/** The colour tokens (src/styles/tokens.css) the shader uses. */
export type Token =
  | 'maroon-deep' | 'maroon' | 'plum' | 'crimson-deep' | 'crimson'
  | 'orange' | 'honey-deep' | 'honey' | 'leaf' | 'mint' | 'sheet-raised';
/** A band colour: a token, or an OKLab mix of two tokens taking share `t` of the second. */
export type Band = Token | { readonly mix: readonly [Token, Token, number] };

/**
 * Band triples (dark, mid, light), per spec §4.1: the capsid in maroon, plum and crimson bands, the VP3 P-domain
 * in honey, the minibinder in mint with leaf. Every band is a token or an OKLab mix of two tokens; the scene
 * resolves them from the live CSS custom properties, so the shader follows tokens.css (tests/unit/toon.test.ts
 * checks each entry against it). The three capsid chains differ most in their mid bands (OKLab ΔE 0.069–0.156).
 */
export const BANDS = {
  vp1: ['maroon-deep', 'plum', { mix: ['plum', 'crimson', 0.5] }], // light: 50 % plum → crimson
  vp2: ['maroon', { mix: ['maroon', 'crimson-deep', 0.5] }, 'crimson-deep'], // mid: 50 % maroon → crimson-deep
  vp3: ['maroon', 'crimson-deep', 'crimson'],
  honey: ['orange', 'honey-deep', 'honey'],
  binder: ['leaf', { mix: ['leaf', 'mint', 0.5] }, 'mint'], // mid: 50 % leaf → mint
} as const satisfies Record<string, readonly [Band, Band, Band]>;
/** The rim light colour. */
export const RIM: Token = 'sheet-raised';

export type Palette = { -readonly [K in keyof typeof BANDS]: Triple } & { rim: number };

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** sRGB 0xRRGGBB → OKLab (Björn Ottosson's matrices). */
function oklab(rgb: number): [number, number, number] {
  const [r, g, b] = [16, 8, 0].map((sh) => toLinear(((rgb >> sh) & 255) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** Linear interpolation in OKLab, `t` of the way from `a` to `b`, back to sRGB 0xRRGGBB. */
export function oklabMix(a: number, b: number, t: number): number {
  const A = oklab(a), B = oklab(b);
  const [L, A1, B1] = A.map((v, i) => v + (B[i] - v) * t);
  const l = (L + 0.3963377774 * A1 + 0.2158037573 * B1) ** 3;
  const m = (L - 0.1055613458 * A1 - 0.0638541728 * B1) ** 3;
  const s = (L - 0.0894841775 * A1 - 1.291485548 * B1) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => Math.round(Math.min(1, Math.max(0, toGamma(c))) * 255));
  return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
}

/** Resolves BANDS and RIM with `token(name)`, which returns a token's value as '#RRGGBB'. */
export function resolvePalette(token: (name: Token) => string): Palette {
  const value = (name: Token) => {
    const m = /^#([0-9a-f]{6})$/i.exec(token(name).trim());
    if (!m) throw new Error(`toon: token --${name} is not a #RRGGBB colour`);
    return parseInt(m[1], 16);
  };
  const band = (b: Band) => (typeof b === 'string' ? value(b) : oklabMix(value(b.mix[0]), value(b.mix[1]), b.mix[2]));
  const out = { rim: value(RIM) } as Palette;
  for (const key of Object.keys(BANDS) as (keyof typeof BANDS)[]) {
    const [d, m, l] = BANDS[key];
    out[key] = [band(d), band(m), band(l)];
  }
  return out;
}

/** Band edges on the lighting term (0 = unlit, 1 = full key light). */
export const BAND_EDGES = [0.25, 0.6] as const;
const KEY_WEIGHT = 0.78;
const RIM_EDGE = 0.6;
const RIM_MIX = 0.35;
/** At full glow the region bands move this far toward their light band, so they brighten but keep their form. */
const GLOW_MIX = 0.55;

/** Key light from the upper left, slightly in front, in view space. */
const KEY = vec3(-0.5, 0.68, 0.54).normalize();

function lighting() {
  const n = normalView;
  const key = max(dot(n, KEY), 0);
  const hemi = n.y.mul(0.5).add(0.5); // sky above, ground below
  return key.mul(KEY_WEIGHT).add(hemi.mul(1 - KEY_WEIGHT));
}

function bands([dark, mid, light]: Triple, lum: ReturnType<typeof lighting>) {
  return mix(mix(color(dark), color(mid), step(BAND_EDGES[0], lum)), color(light), step(BAND_EDGES[1], lum));
}

/** fresnel = (1 − N·V)³, stepped at 0.6 and laid over the band colour at 35 %. */
function withRim(base: ReturnType<typeof bands>, rim: number) {
  const fresnel = pow(float(1).sub(max(dot(normalView, positionViewDirection), 0)), 3);
  return mix(base, color(rim), step(RIM_EDGE, fresnel).mul(RIM_MIX));
}

export interface ToonOptions {
  bands: Triple;
  rim: number;
  /**
   * Mix vertices whose `region` attribute is 1 (the VP3 P-domain) from base to these bands as glow rises,
   * mixed toward their light band by `glow` (0..1, scaled by GLOW_MIX).
   */
  region?: { bands: Triple; glow: GlowUniform };
  /** Colour every vertex with the region bands and glow (the 5G51 close-up is all P-domain). */
  wholeRegion?: boolean;
}

export function toonMaterial(opts: ToonOptions): MeshBasicNodeMaterial {
  const lum = lighting();
  let base = bands(opts.bands, lum);
  if (opts.region) {
    const lit = mix(bands(opts.region.bands, lum), color(opts.region.bands[2]), opts.region.glow.mul(GLOW_MIX));
    base = opts.wholeRegion ? lit : mix(base, mix(base, lit, opts.region.glow), step(0.5, attribute<'float'>('region', 'float')));
  }
  const material = new MeshBasicNodeMaterial();
  material.colorNode = withRim(base, opts.rim);
  return material;
}

export function glowUniform() {
  return uniform(0, 'float');
}
