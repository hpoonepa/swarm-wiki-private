import { goals, linkState, type Goal, type GoalId } from './sdg-data';

export type Layout = 'large' | 'small';
export interface Shape { size: number; r: number; hub: number; sat: number; glyph: { hub: number; sat: number }; text: { eyebrow: number; name: number; lead: number; pad: number }; hint: { x: number; y: number; anchor: 'start' | 'end'; big: number; small: number; from: { x: number; y: number } } }
export const SHAPES: Record<Layout, Shape> = {
  large: { size: 1000, r: 385, hub: 96, sat: 56, glyph: { hub: 92, sat: 52 }, text: { eyebrow: 16, name: 25, lead: 28, pad: 14 }, hint: { x: 985, y: 236, anchor: 'end', big: 20, small: 15, from: { x: 872, y: 226 } } },
  small: { size: 640, r: 206, hub: 80, sat: 50, glyph: { hub: 76, sat: 46 }, text: { eyebrow: 16, name: 22, lead: 25, pad: 12 }, hint: { x: 630, y: 226, anchor: 'end', big: 18, small: 13, from: { x: 536, y: 215 } } },
};
export const SLOTS = [-120, -60, 0, 60, 120, 180] as const;
const GAP = 12;
const BOW = 18;
const HEAD = 18;
const HEAD_W = 9;

export const byId = Object.fromEntries(goals.map(g => [g.id, g])) as Record<GoalId, Goal>;

const f = (n: number) => n.toFixed(1);
const pt = (p: { x: number; y: number }) => `${f(p.x)} ${f(p.y)}`;

export function viewBox(layout: Layout): string {
  const { size } = SHAPES[layout];
  return `0 0 ${size} ${size}`;
}

export function point(layout: Layout, angle: number, k: number): { x: number; y: number } {
  const s = SHAPES[layout], a = (angle * Math.PI) / 180;
  return { x: s.size / 2 + s.r * k * Math.cos(a), y: s.size / 2 + s.r * k * Math.sin(a) };
}

export function arrow(layout: Layout, angle: number, outward: boolean): { shaft: string; head: string; hit: string } {
  const s = SHAPES[layout], hub = point(layout, angle, 0), sat = point(layout, angle, 1);
  const distance = Math.hypot(sat.x - hub.x, sat.y - hub.y);
  const ux = (sat.x - hub.x) / distance, uy = (sat.y - hub.y) / distance, side = outward ? 1 : -1, nx = -uy * side, ny = ux * side;
  const inner = s.hub + GAP, outer = distance - s.sat - GAP;
  const at = (d: number, off: number) => ({ x: hub.x + ux * d + nx * off, y: hub.y + uy * d + ny * off });
  const p0 = at(outward ? inner : outer, BOW), p1 = at((inner + outer) / 2, BOW * 2.4), tip = at(outward ? outer : inner, BOW);
  const tl = Math.hypot(tip.x - p1.x, tip.y - p1.y), tx = (tip.x - p1.x) / tl, ty = (tip.y - p1.y) / tl;
  const end = { x: tip.x - tx * HEAD, y: tip.y - ty * HEAD };
  return {
    shaft: `M${pt(p0)} Q${pt(p1)} ${pt(end)}`,
    head: `M${pt(tip)} L${pt({ x: end.x - ty * HEAD_W, y: end.y + tx * HEAD_W })} L${pt({ x: end.x + ty * HEAD_W, y: end.y - tx * HEAD_W })}z`,
    hit: `M${pt(p0)} Q${pt(p1)} ${pt(tip)}`,
  };
}

export function hubMarkup(goal: Goal, layout: Layout): string {
  const s = SHAPES[layout], p = point(layout, 0, 0), g = s.glyph.hub;
  return `<g class="sdg-node sdg-node--hub" data-goal="${goal.id}" tabindex="-1" role="group" aria-label="${goal.name}, center goal" style="--tone:${goal.tone}" transform="translate(${p.x} ${p.y})"><circle r="${s.hub}"/><use href="#sdg-glyph-${goal.id}" x="${-g / 2}" y="${-g / 2}" width="${g}" height="${g}"/></g>`;
}

export function satMarkup(goal: Goal, layout: Layout, angle: number): string {
  const s = SHAPES[layout], p = point(layout, angle, 1), g = s.glyph.sat;
  return `<a class="sdg-node sdg-node--sat" href="#sdg-${goal.number}" data-goal="${goal.id}" style="--tone:${goal.tone}" transform="translate(${pt(p)})" aria-label="Bring ${goal.name} to the center"><circle r="${s.sat}"/><use href="#sdg-glyph-${goal.id}" x="${-g / 2}" y="${-g / 2}" width="${g}" height="${g}"/></a>`;
}

export function labelMarkup(goal: Goal, layout: Layout, angle: number): string {
  const s = SHAPES[layout], t = s.text, p = point(layout, angle, 1), n = goal.lines.length, names: number[] = [];
  let eyebrow: number;
  if (angle < 0) {
    const base = p.y - s.sat - t.pad;
    for (let i = 0; i < n; i++) names.push(base - (n - 1 - i) * t.lead);
    eyebrow = names[0] - t.lead;
  } else {
    eyebrow = p.y + s.sat + t.pad + t.eyebrow * 0.75;
    for (let i = 0; i < n; i++) names.push(eyebrow + (i + 1) * t.lead);
  }
  const line = (cls: string, y: number, size: number, text: string) => `<text class="${cls}" x="${f(p.x)}" y="${f(y)}" font-size="${size}">${text}</text>`;
  return `<g class="sdg-label" data-goal="${goal.id}">${line('sdg-label__eyebrow', eyebrow, t.eyebrow, `Goal ${goal.number}`)}${goal.lines.map((l, i) => line('sdg-label__name', names[i], t.name, l)).join('')}</g>`;
}

export function hintMarkup(layout: Layout): string {
  const s = SHAPES[layout], h = s.hint, n = point(layout, -60, 1), a = (40 * Math.PI) / 180;
  const to = { x: n.x + (s.sat + 12) * Math.cos(a), y: n.y + (s.sat + 12) * Math.sin(a) }, from = h.from;
  const dx = to.x - from.x, dy = to.y - from.y, len = Math.hypot(dx, dy), tx = dx / len, ty = dy / len;
  const ctrl = { x: (from.x + to.x) / 2 + ty * 16, y: (from.y + to.y) / 2 - tx * 16 };
  const cl = Math.hypot(to.x - ctrl.x, to.y - ctrl.y), hx = (to.x - ctrl.x) / cl, hy = (to.y - ctrl.y) / cl;
  const end = { x: to.x - hx * 9, y: to.y - hy * 9 };
  const head = `M${pt({ x: end.x - hy * 5, y: end.y + hx * 5 })} L${pt(to)} L${pt({ x: end.x + hy * 5, y: end.y - hx * 5 })}`;
  return `<g class="sdg-hint" aria-hidden="true"><path class="sdg-hint__line" d="M${pt(from)} Q${pt(ctrl)} ${pt(to)}"/><path class="sdg-hint__line" d="${head}"/><text class="sdg-hint__big" x="${h.x}" y="${h.y}" font-size="${h.big}" text-anchor="${h.anchor}">Click here</text><text class="sdg-hint__small" x="${h.x}" y="${h.y + h.small * 1.4}" font-size="${h.small}" text-anchor="${h.anchor}">to bring a goal to the center</text></g>`;
}

export function arrowMarkup(hub: Goal, sat: Goal, layout: Layout, angle: number): string {
  const pair: [Goal, Goal, boolean][] = [[hub, sat, true], [sat, hub, false]];
  return pair.map(([from, to, outward]) => {
    const state = linkState(from.id, to.id), d = arrow(layout, angle, outward);
    const body = `<path class="sdg-arrow" d="${d.shaft}"/><path class="sdg-arrow__head" d="${d.head}"/>`;
    if (state === 'none') return `<g class="sdg-link sdg-link--none" data-state="none" aria-hidden="true">${body}</g>`;
    return `<g class="sdg-link" role="button" tabindex="0" data-state="${state}" data-from="${from.id}" data-to="${to.id}" aria-label="${from.name} to ${to.name}${state === 'tension' ? ', a tension' : ''}">${body}<path class="sdg-arrow__hit" d="${d.hit}"/></g>`;
  }).join('');
}

export function chipMarkup(goal: Goal): string {
  return `<svg class="sdg-chip" viewBox="0 0 48 48" style="--tone:${goal.tone}"><circle cx="24" cy="24" r="24"/><use href="#sdg-glyph-${goal.id}" x="11" y="11" width="26" height="26"/></svg>`;
}

export function chipsMarkup(a: Goal, b?: Goal): string {
  return b ? `${chipMarkup(a)}<svg class="sdg-chip__arrow" viewBox="0 0 24 24"><path d="M3 12h17M14 6l6 6-6 6"/></svg>${chipMarkup(b)}` : chipMarkup(a);
}

export function wheelMarkup(hub: GoalId, ring: GoalId[], layout: Layout): { nodes: string; arrows: string; labels: string } {
  const nodes = hubMarkup(byId[hub], layout) + ring.map((id, i) => satMarkup(byId[id], layout, SLOTS[i])).join('');
  const arrows = ring.map((id, i) => arrowMarkup(byId[hub], byId[id], layout, SLOTS[i])).join('');
  const labels = ring.map((id, i) => labelMarkup(byId[id], layout, SLOTS[i])).join('');
  return { nodes, arrows, labels };
}

export function defaultRing(hub: GoalId): GoalId[] {
  const rest = goals.filter(g => g.id !== hub).map(g => g.id);
  return rest.includes('partnerships') ? ['partnerships', ...rest.filter(id => id !== 'partnerships')] : rest;
}
