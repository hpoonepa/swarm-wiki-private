import { parseFragment, serializeOuter } from 'parse5';

const phases = ['Design', 'Build', 'Test', 'Learn'];
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;

// Keep the editable MDX as the only source of the scientific writeup.
// Group its rendered HTML without re-parsing or losing tables, figures, or IDs.
export function parseCycles(html) {
  const groups = [];
  let preamble = '', group, cycle, phase, tail = false;
  for (const node of parseFragment(html).childNodes) {
    const heading = /^h[1-6]$/.test(node.tagName || '');
    const label = heading ? text(node).trim() : '';
    if (node.tagName === 'h1') {
      group = { id: attr(node, 'id'), title: label, intro: '', cycles: [] };
      groups.push(group);
      cycle = phase = undefined; tail = false;
      continue;
    }
    const iteration = heading && label.match(/^Iteration\s+([\d.]+)\s*[–—:\-]\s*(.*)$/i);
    if (group && iteration) {
      cycle = { id: attr(node, 'id'), number: iteration[1], title: iteration[2], intro: '', phases: [], tail: '' };
      group.cycles.push(cycle);
      phase = undefined; tail = false;
      continue;
    }
    if (cycle && heading && phases.includes(label)) {
      phase = { id: attr(node, 'id'), title: label, html: '' };
      cycle.phases.push(phase); tail = false;
      continue;
    }
    if (cycle && heading && label === 'References') { phase = undefined; tail = true; }
    const fragment = serializeOuter(node);
    if (phase) phase.html += fragment;
    else if (cycle && tail) cycle.tail += fragment;
    else if (cycle) cycle.intro += fragment;
    else if (group) group.intro += fragment;
    else preamble += fragment;
  }
  for (const group of groups) for (const cycle of group.cycles) {
    if (cycle.phases.map(p => p.title).join('|') !== phases.join('|')) {
      throw new Error(`Engineering iteration ${cycle.number} needs Design, Build, Test, and Learn headings.`);
    }
  }
  return { groups, preamble };
}
