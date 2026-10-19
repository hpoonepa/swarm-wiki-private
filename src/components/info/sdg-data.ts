export type GoalId = 'zero-hunger' | 'quality-education' | 'gender-equality' | 'decent-work' | 'cities' | 'life-on-land' | 'partnerships';
export type LinkState = 'support' | 'tension' | 'none';
export interface Goal { id: GoalId; number: number; name: string; lines: string[]; tone: string }

export const goals: Goal[] = [
  { id: 'zero-hunger', number: 2, name: 'Zero Hunger', lines: ['Zero Hunger'], tone: '#D78794' },
  { id: 'quality-education', number: 4, name: 'Quality Education', lines: ['Quality Education'], tone: '#E48D36' },
  { id: 'gender-equality', number: 5, name: 'Gender Equality', lines: ['Gender Equality'], tone: '#F7B74E' },
  { id: 'decent-work', number: 8, name: 'Decent Work and Economic Growth', lines: ['Decent Work and', 'Economic Growth'], tone: '#EBCEAD' },
  { id: 'cities', number: 11, name: 'Sustainable Cities and Communities', lines: ['Sustainable Cities', 'and Communities'], tone: '#E1AF70' },
  { id: 'life-on-land', number: 15, name: 'Life on Land', lines: ['Life on Land'], tone: '#5D695D' },
  { id: 'partnerships', number: 17, name: 'Partnerships for the Goals', lines: ['Partnerships', 'for the Goals'], tone: '#AAA06D' },
];

const support = new Set([
  'zero-hunger>quality-education', 'gender-equality>zero-hunger', 'zero-hunger>decent-work', 'cities>zero-hunger', 'life-on-land>zero-hunger', 'partnerships>zero-hunger',
  'quality-education>gender-equality', 'quality-education>decent-work', 'quality-education>cities', 'quality-education>life-on-land', 'partnerships>quality-education',
  'gender-equality>decent-work', 'partnerships>gender-equality',
  'cities>decent-work', 'life-on-land>decent-work', 'partnerships>decent-work',
  'life-on-land>cities', 'partnerships>cities', 'partnerships>life-on-land',
]);
const tension = new Set(['zero-hunger>life-on-land', 'decent-work>cities', 'decent-work>life-on-land', 'cities>life-on-land']);

export function linkState(from: GoalId, to: GoalId): LinkState {
  const key = `${from}>${to}`;
  return support.has(key) ? 'support' : tension.has(key) ? 'tension' : 'none';
}

export function pairKey(a: GoalId, b: GoalId): string { return [a, b].sort().join('+'); }

const texts: Partial<Record<string, string>> = {};
const summaries: Partial<Record<GoalId, string>> = {};

export function pairText(a: GoalId, b: GoalId): string {
  return texts[pairKey(a, b)] ?? '';
}

export function summaryText(id: GoalId): string {
  return summaries[id] ?? '';
}
