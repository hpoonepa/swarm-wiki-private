import { HOME_STOPS, getDestination } from './journey-stops.js?v=1234e48119ea';

// A small section rail, inspired by McGill's 2023 homepage navigation.
// Native scrolling remains in charge; no snapping or external libraries.
const story = document.getElementById('honeycomb-earth');
if (story && !document.querySelector('.section-nav')) {
  const nav = document.createElement('nav');
  nav.className = 'section-nav';
  nav.setAttribute('aria-label', 'Homepage sections');
  const hexagon = '<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M14 2 26 9v14l-12 7L2 23V9Z"/></svg>';
  nav.innerHTML = `<ol>${HOME_STOPS.map((stop, index) => `<li><a href="#${stop.id}" class="section-nav__link" aria-label="${stop.label}" tabindex="${index ? -1 : 0}">${hexagon}<span class="section-nav__label" aria-hidden="true">${stop.label}</span></a></li>`).join('')}</ol>`;
  document.body.append(nav);
  document.body.classList.add('has-section-nav');

  const links = [...nav.querySelectorAll('a')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wikiNav = document.querySelector('swarm-nav');
  let positions = [], frame = 0, current = -1;

  function measure() {
    positions = HOME_STOPS.map(stop => stop.start());
    requestUpdate();
  }
  function update() {
    frame = 0;
    let active = 0;
    for (let index = 1; index < positions.length; index++) {
      if (Number.isFinite(positions[index]) && scrollY + 2 >= positions[index]) active = index;
    }
    if (active !== current) {
      current = active;
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
        link.dataset.past = String(index < active);
        if (!nav.contains(document.activeElement)) link.tabIndex = index === active ? 0 : -1;
      });
    }
    const stageRect = story.querySelector('.geo-stage').getBoundingClientRect();
    const inStory = stageRect.top < innerHeight * .5 && stageRect.bottom > innerHeight * .5;
    const phase = story.dataset.journey;
    const dark = active === 0 || (inStory && ['rna-intro', 'rnai'].includes(phase));
    nav.dataset.theme = dark ? 'dark' : 'light';
  }
  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.getAttribute('href').slice(1), destination = getDestination(id);
    if (!Number.isFinite(destination)) return;
    event.preventDefault();
    history.pushState(null, '', `#${id}`);
    scrollTo({ top: destination, behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  nav.addEventListener('keydown', event => {
    const index = links.indexOf(document.activeElement);
    if (index < 0) return;
    const next = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? (index + 1) % links.length
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? (index + links.length - 1) % links.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    links.forEach((link, i) => { link.tabIndex = i === next ? 0 : -1; });
    links[next].focus({ preventScroll: true });
  });
  nav.addEventListener('focusout', event => {
    if (!nav.contains(event.relatedTarget)) links.forEach((link, i) => { link.tabIndex = i === current ? 0 : -1; });
  });
  const syncOverlay = () => {
    nav.inert = !!wikiNav?.hasAttribute('data-map-open');
    nav.toggleAttribute('data-obscured', nav.inert);
  };
  if (wikiNav) new MutationObserver(syncOverlay).observe(wikiNav, { attributes: true, attributeFilter: ['data-map-open'] });
  // Camera easing can finish after scrolling stops, so follow its semantic scene.
  new MutationObserver(requestUpdate).observe(story, { attributes: true, attributeFilter: ['data-journey'] });
  new ResizeObserver(measure).observe(document.body);
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('swarm-ready', measure);
  document.fonts?.ready.then(measure);
  syncOverlay();
  measure();
}
