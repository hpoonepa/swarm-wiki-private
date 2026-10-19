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
  'life-on-land>zero-hunger', 'life-on-land>decent-work',
  'quality-education>gender-equality', 'quality-education>cities', 'quality-education>life-on-land',
  'partnerships>quality-education', 'partnerships>life-on-land', 'partnerships>decent-work',
]);
const tension = new Set(['zero-hunger>life-on-land', 'decent-work>life-on-land']);

export function linkState(from: GoalId, to: GoalId): LinkState {
  const key = `${from}>${to}`;
  return support.has(key) ? 'support' : tension.has(key) ? 'tension' : 'none';
}

export function pairKey(a: GoalId, b: GoalId): string { return [a, b].sort().join('+'); }

const texts: Partial<Record<string, string>> = {
  'life-on-land>zero-hunger': 'Pollination connects bee health to food production. This is a reason for pursuing SWARM; we have not yet measured an effect on crop yield or food security.',
  'life-on-land>decent-work': 'Beekeepers depend on healthy colonies. Their feedback made practicality and affordability part of our design assessment, alongside laboratory performance.',
  'quality-education>gender-equality': 'Through Flowers for the Future, we teach synthetic biology to Afghan girls. The course provides an educational opportunity for students facing barriers to formal schooling.',
  'quality-education>cities': 'Our school workshops, gardening activities, and public resources connect pollinator education with actions people can take in their own communities.',
  'quality-education>life-on-land': 'At Sharon Elementary, students prepared a garden while learning about pollination. Our book and other activities also introduce the pressures facing bees.',
  'partnerships>quality-education': 'Teachers and partner organizations helped shape our lessons and reach learners. Tiffany Bono’s review led us to simplify the language of our children’s book.',
  'partnerships>life-on-land': 'Beekeepers and researchers helped define the problem. Amy Dolan’s feedback also prompted us to consider pollinators beyond managed honey bees.',
  'partnerships>decent-work': 'Kerry Langley’s cost feedback and conversations with beekeepers prompted us to consider affordability, usability, and seasonal workflows.',
  'zero-hunger>life-on-land': 'An approach intended to support crop pollination must also be assessed for effects on other organisms. Benefits to managed colonies would not automatically establish benefits across an ecosystem.',
  'decent-work>life-on-land': 'A low purchase price can improve access, but does not establish a low environmental footprint. Energy use, durability, repair, and disposal remain part of the assessment.',
};
const summaries: Record<GoalId, string> = {
  'zero-hunger': 'We connected bee health with food security after stakeholder feedback broadened our project scope. Agricultural benefits remain an intended outcome to evaluate.',
  'quality-education': 'Our education program records more than 30 initiatives and more than 530 participants, with lessons, surveys, and feedback documented in the education writeup.',
  'gender-equality': 'Flowers for the Future provides synthetic biology lessons for Afghan girls. Our team reports approximately 120 students across three semesters.',
  'decent-work': 'Beekeeper feedback made cost and usability important design criteria. VAPOR-X documents our prototype hardware; full operating costs and economic effects still need evaluation.',
  'cities': 'Workshops, pollinator presentations, and gardening resources connect SWARM with local schools and communities.',
  'life-on-land': 'SWARM investigates bee health while considering other pollinators and potential environmental effects. Our education work includes pollinator gardens and conservation activities.',
  'partnerships': 'Our assessment includes 32 stakeholder records. These conversations influenced the problem we addressed, the constraints we considered, and the educational resources we developed.',
};

export const evidenceLinks: Record<GoalId, { href: string; label: string }> = {
  'zero-hunger': { href: '#pollinator-health', label: 'Pollinator health' },
  'quality-education': { href: '/lambert-ga/education/', label: 'Education activities' },
  'gender-equality': { href: '/lambert-ga/education/#inclusivity', label: 'Inclusive education' },
  'decent-work': { href: '#decisions-shaped-by-feedback', label: 'Stakeholder decisions' },
  'cities': { href: '/lambert-ga/education/', label: 'Community activities' },
  'life-on-land': { href: '#pollinator-health', label: 'Pollinator health' },
  'partnerships': { href: '#decisions-shaped-by-feedback', label: 'Stakeholder decisions' },
};

export function pairText(a: GoalId, b: GoalId): string {
  return texts[`${a}>${b}`] ?? '';
}

export function summaryText(id: GoalId): string {
  return summaries[id] ?? '';
}
