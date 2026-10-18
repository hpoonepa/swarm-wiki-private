/* Shared positions for links into the pinned homepage story. */
export const STORY_STOPS = Object.freeze({
  minibinders: .94,
  rnaIntro: 1.67,
  rnaMechanism: 1.9
});

const elementTop = id => {
  const element = document.getElementById(id);
  return element ? element.getBoundingClientRect().top + scrollY : undefined;
};
const at = p => {
  const top = elementTop('honeycomb-earth');
  return top === undefined || !window.earthOffset ? undefined : top + window.earthOffset(p);
};
const pause = (name, p) => {
  const top = elementTop('honeycomb-earth');
  const offset = name === 'intro' ? window.earthIntroOffset : window.earthDiseaseOffset;
  return top === undefined || !offset ? undefined : top + offset(p);
};

export const HOME_STOPS = Object.freeze([
  { id: 'top', label: 'SWARM', target: () => 0, start: () => 0 },
  { id: 'statement', label: 'Why bees matter', target: () => {
    const el = document.getElementById('statement');
    return el ? elementTop('statement') + Math.max(0, el.offsetHeight - innerHeight) * .12 : undefined;
  }, start: () => elementTop('statement') - innerHeight * .3 },
  { id: 'earth', label: 'Pollination', target: () => at(.04), start: () => at(0) },
  { id: 'usa', label: 'DWV & bee health', target: () => at(.18), start: () => at(.115) },
  { id: 'dwv', label: 'Deformed wing virus', target: () => pause('disease', .23), start: () => at(.235) },
  { id: 'hive', label: 'Introducing SWARM', target: () => pause('intro', .96), start: () => at(.32) },
  { id: 'minibinders', label: 'Minibinders', target: () => at(STORY_STOPS.minibinders), start: () => at(.58) },
  { id: 'rna-intro', label: 'RNAi and the mite', target: () => at(STORY_STOPS.rnaIntro), start: () => at(1.36) },
  { id: 'rnai', label: 'How RNAi works', target: () => at(STORY_STOPS.rnaMechanism), start: () => at(1.81) },
  { id: 'project-overview', label: 'The whole project', target: () => elementTop('project-overview'), start: () => elementTop('project-overview') - innerHeight * .3 },
  { id: 'explore', label: 'Explore our project', target: () => elementTop('explore'), start: () => elementTop('explore') - innerHeight * .3 }
].map(Object.freeze));

export function getDestination(id) {
  const key = id === 'honeycomb-earth' ? 'earth' : ['flower', 'together'].includes(id) ? 'project-overview' : id;
  const stop = HOME_STOPS.find(item => item.id === key);
  if (stop) return stop.target();
  // Preserve existing links into intermediate camera beats.
  const beats = { atlanta: .26, 'hive-arrival': .385, 'return-hive': 1.285, bee: .79, mite: 1.60 };
  if (key in beats) return at(beats[key]);
  if (key === 'bee-comparison') return pause('disease', .42);
  return undefined;
}
