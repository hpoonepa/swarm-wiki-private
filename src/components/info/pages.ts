// Reading-page ordering and canopy crops adapted from vkalipat/igem-wiki (3e852c6).
// Routes follow this wiki's existing navigation.
const pages = [
  ['team', 'Team', 'Team', 1550, 1250],
  ['attributions', 'Attributions', 'Team', 1000, 700],
  ['description', 'Project Description', 'Project', 1550, 1250],
  ['judging', 'Project judging', 'Project', 1550, 1250],
  ['contribution', 'Contribution', 'Project', 1550, 1250],
  ['engineering', 'Engineering Success', 'Project', 1550, 1250],
  ['implementation', 'Implementation', 'Project', 1550, 1250],
  ['minibinder', 'Minibinder Overview', 'Wetlab', 2200, 1650],
  ['minibinder-design', 'Minibinder & VP3 Plasmid Design', 'Wetlab', 2200, 1650],
  ['minibinder-experimentation', 'Minibinder Experimentation', 'Wetlab', 2200, 1650],
  ['minibinder-positive-control', 'Positive Control Experimentation', 'Wetlab', 2200, 1650],
  ['rnai', 'RNAi Overview', 'Wetlab', 2200, 1650],
  ['rnai-design', 'RNAi Design', 'Wetlab', 2200, 1650],
  ['rnai-experimentation', 'RNAi Experimentation', 'Wetlab', 2200, 1650],
  ['parts', 'Parts Roster', 'Wetlab', 2200, 1650],
  ['notebook', 'Minibinder Notebook', 'Wetlab', 2200, 1650],
  ['notebook-rnai', 'RNAi Notebook', 'Wetlab', 2200, 1650],
  ['results', 'Results', 'Wetlab', 2200, 1650],
  ['experiments', 'Experiments', 'Wetlab', 2200, 1650],
  ['safety', 'Safety', 'Wetlab', 2200, 1650],
  ['model', 'Modeling Overview', 'Drylab', 1300, 300],
  ['model-design', 'Minibinder Design', 'Drylab', 1300, 300],
  ['model-rnai', 'RNAi Model', 'Drylab', 1300, 300],
  ['model-minibinder', 'Minibinder Model', 'Drylab', 1300, 300],
  ['model-epidemiological', 'Epidemiological Model', 'Drylab', 1300, 300],
  ['model-instructional', 'Modeling Instructional', 'Drylab', 1300, 300],
  ['software', 'Software Writeups', 'Drylab', 1300, 300],
  ['hardware', 'Hardware', 'Drylab', 2380, 1100],
  ['education', 'Education', 'Human Practices', 1720, 380],
  ['human-practices', 'Integrated Human Practices', 'Human Practices', 1720, 380],
  ['sustainability', 'Sustainability', 'Human Practices', 1720, 380],
  ['entrepreneurship', 'Entrepreneurship', 'Human Practices', 1720, 380],
] as const;

export function readingPage(slug: string) {
  const index = pages.findIndex(page => page[0] === slug);
  const page = pages[index] ?? pages[0];
  const link = (item: typeof pages[number] | undefined) => item && ({ title: item[1], href: `/lambert-ga/${item[0]}/` });
  return { group: page[2], focal: { x: page[3], y: page[4] }, prev: link(pages[index - 1]), next: index < 0 ? undefined : link(pages[index + 1]) };
}
