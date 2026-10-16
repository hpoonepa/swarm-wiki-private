export function mountEngineering(root: HTMLElement) {
  if (root.dataset.ready) return;
  const all = <T extends HTMLElement = HTMLElement>(selector: string, within: ParentNode = root) => [...within.querySelectorAll<T>(selector)];
  const tracks = all('[data-track-panel]');
  const cycles = tracks.map(track => all('[data-cycle-panel]', track));
  const trackButtons = all<HTMLButtonElement>('[data-track]');
  const readingToggle = root.querySelector<HTMLButtonElement>('[data-reading-toggle]')!;
  const wheel = root.querySelector<HTMLElement>('.eng-wheel')!;
  let group = 0, cycle = 0, phase = 0, full = false;
  const phaseNames = ['Design', 'Build', 'Test', 'Learn'];
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function currentCycle() { return cycles[group][cycle]; }
  function syncHash() {
    const selected = currentCycle().querySelector<HTMLElement>(`[data-phase-panel="${phase}"]`)!;
    history.replaceState(null, '', `#${selected.id}`);
  }
  function draw() {
    root.dataset.reading = full ? 'all' : 'cycle';
    readingToggle.setAttribute('aria-pressed', String(full));
    readingToggle.innerHTML = `<span aria-hidden="true">${full ? '↺' : '☷'}</span> ${full ? 'Read by cycle' : 'Read full writeup'}`;
    trackButtons.forEach((button, index) => {
      button.setAttribute('aria-selected', String(index === group));
      button.tabIndex = index === group ? 0 : -1;
    });
    tracks.forEach((track, gi) => {
      track.hidden = !full && gi !== group;
      if (full) track.removeAttribute('role'); else track.setAttribute('role', 'tabpanel');
      cycles[gi].forEach((item, ci) => {
        item.hidden = !full && (gi !== group || ci !== cycle);
        all('[data-phase-panel]', item).forEach((panel, pi) => {
          panel.hidden = !full && pi !== phase;
          if (full) panel.removeAttribute('role'); else panel.setAttribute('role', 'tabpanel');
        });
        all<HTMLButtonElement>('[data-phase-tab]', item).forEach((button, pi) => {
          button.setAttribute('aria-selected', String(pi === phase));
          button.tabIndex = pi === phase ? 0 : -1;
        });
        const prev = item.querySelector<HTMLButtonElement>('[data-cycle-prev]')!;
        const next = item.querySelector<HTMLButtonElement>('[data-cycle-next]')!;
        prev.disabled = ci === 0; next.disabled = ci === cycles[gi].length - 1;
        // References stay with their iteration; never hide them behind a phase.
      });
    });
    all('[data-cycle-list]').forEach(list => { list.hidden = Number(list.dataset.cycleList) !== group; });
    all('[data-cycle-select]').forEach(button => {
      const selected = Number(button.dataset.cycleTrack) === group && Number(button.dataset.cycleSelect) === cycle;
      if (selected) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    });
    all('[data-phase-select]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === phase)));
    wheel.dataset.phase = String(phase);
    all('[data-track-description]').forEach(description => { description.hidden = !full && Number(description.dataset.trackDescription) !== group; });
    root.querySelector('[data-step-status]')!.textContent = `Iteration ${cycle + 1} of ${cycles[group].length} · ${phaseNames[phase]}`;
  }
  function positionReader() {
    const document = root.querySelector<HTMLElement>('.eng-document')!;
    if (document.getBoundingClientRect().top < 75 || window.innerWidth < 800) {
      document.scrollIntoView({ behavior: reduceMotion() ? 'instant' : 'smooth', block: 'start' });
    }
  }
  function select(gi = group, ci = cycle, pi = phase, reposition = false) {
    group = gi; cycle = ci; phase = pi; full = false;
    draw(); syncHash();
    if (reposition) positionReader();
  }
  function revealHash() {
    let id: string;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return false; }
    if (!id) return false;
    const target = document.getElementById(id);
    if (!target || !root.contains(target)) return false;
    const targetTrack = target.closest<HTMLElement>('[data-track-panel]');
    if (!targetTrack) return false;
    const targetCycle = target.closest<HTMLElement>('[data-cycle-panel]');
    const targetPhase = target.closest<HTMLElement>('[data-phase-panel]');
    group = Number(targetTrack.dataset.trackPanel);
    cycle = Number(targetCycle?.dataset.cyclePanel ?? 0);
    phase = Number(targetPhase?.dataset.phasePanel ?? 0);
    full = false; draw();
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    return true;
  }
  root.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button, [data-phase-select]');
    if (!button || !root.contains(button) || button.disabled) return;
    if (button.hasAttribute('data-track')) select(Number(button.dataset.track), 0, 0);
    else if (button.hasAttribute('data-cycle-select')) select(Number(button.dataset.cycleTrack), Number(button.dataset.cycleSelect), 0, true);
    else if (button.hasAttribute('data-phase-select')) select(group, cycle, Number(button.dataset.phaseSelect), true);
    else if (button.hasAttribute('data-phase-tab')) select(group, cycle, Number(button.dataset.phaseTab));
    else if (button.hasAttribute('data-cycle-prev')) select(group, cycle - 1, 0, true);
    else if (button.hasAttribute('data-cycle-next')) select(group, cycle + 1, 0, true);
     else if (button.hasAttribute('data-reading-toggle')) {
      full = !full; draw();
      if (!full) syncHash();
    }
  });
  root.addEventListener('keydown', event => {
    const wheelControl = (event.target as Element).closest<SVGElement>('[data-phase-select]');
    if (wheelControl && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      select(group, cycle, Number(wheelControl.dataset.phaseSelect), true);
      return;
    }
    const button = (event.target as Element).closest<HTMLButtonElement>('[role="tab"]');
    if (!button || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = all<HTMLButtonElement>('[role="tab"]', button.parentElement!);
    const index = tabs.indexOf(button);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].click(); tabs[next].focus({ preventScroll: true });
  });
  all('.eng-interactive').forEach(element => { element.hidden = false; });
  root.dataset.ready = 'true';
  draw(); revealHash();
  window.addEventListener('hashchange', revealHash);
}
