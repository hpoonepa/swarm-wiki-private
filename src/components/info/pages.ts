// Reading-page ordering and canopy crops adapted from vkalipat/igem-wiki (3e852c6).
// Routes follow this wiki's existing navigation.
const pages = [
  ['team', 'Team', 'Team', 1550, 1250],
  ['attributions', 'Attributions', 'Team', 1000, 700],
  ['description', 'Description', 'Project', 1550, 1250],
  ['engineering', 'Engineering', 'Project', 1000, 700],
  ['results', 'Results', 'Project', 300, 450],
  ['contribution', 'Contribution', 'Project', 2150, 1250],
  ['implementation', 'Implementation', 'Project', 1550, 1250],
  ['safety', 'Safety', 'Project', 450, 1350],
  ['experiments', 'Experiments', 'Wetlab', 2200, 1650],
  ['notebook', 'Notebook', 'Wetlab', 1300, 1800],
  ['diagnosticsoverview', 'Minibinders', 'Wetlab', 1000, 700],
  ['diagnostics-pdl', 'PDL', 'Wetlab', 2200, 1650],
  ['diagnostics-rpa', 'RPA', 'Wetlab', 700, 1300],
  ['diagnostics-cas12', 'CRISPR-Cas12a', 'Wetlab', 300, 450],
  ['therapeutics-overview', 'RNAi', 'Wetlab', 1550, 1250],
  ['therapeutics-crispri', 'CRISPRi', 'Wetlab', 1000, 700],
  ['therapeutics-lnps', 'LNPs', 'Wetlab', 2150, 1250],
  ['cell-free', 'Cell-free', 'Wetlab', 1300, 1800],
  ['parts-library', 'Parts library', 'Wetlab', 700, 1300],
  ['human-practices', 'Human Practices', 'Human Practices', 1720, 380],
  ['integrated-hp', 'Integrated Human Practices', 'Human Practices', 1720, 380],
  ['education', 'Education', 'Human Practices', 2250, 800],
  ['inclusivity', 'Inclusivity', 'Human Practices', 2000, 1300],
  ['hp-entre', 'Entrepreneurship', 'Human Practices', 900, 200],
  ['hp-sustainability', 'Sustainable Development', 'Human Practices', 500, 1800],
  ['model', 'Model', 'Drylab', 1300, 300],
  ['software', 'Software', 'Drylab', 2300, 800],
  ['hardware', 'Hardware', 'Drylab', 2380, 1100],
  ['resources', 'Resources', 'Project', 150, 500],
  ['awards', 'Awards', 'Team', 2150, 1250],
] as const;

export function readingPage(slug: string) {
  const index = pages.findIndex(page => page[0] === slug);
  const page = pages[index] ?? pages[0];
  const link = (item: typeof pages[number] | undefined) => item && ({ title: item[1], href: `/lambert-ga/${item[0]}/` });
  return { group: page[2], focal: { x: page[3], y: page[4] }, prev: link(pages[index - 1]), next: index < 0 ? undefined : link(pages[index + 1]) };
}
