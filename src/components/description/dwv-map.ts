import { evidence } from './dwv-evidence';
import { illustrativeCountryFill } from './dwv-illustration';
const years = [2014, 2017, 2019, 2020, 2022, 2025];
document.querySelectorAll<HTMLElement>('[data-dwv-atlas]').forEach(root => {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const button = root.querySelector<HTMLButtonElement>('[data-outlook-button]')!;
  const output = root.querySelector<HTMLOutputElement>('#atlas-year-output')!;
  const progress = root.querySelector<HTMLElement>('[data-progress]')!;
  const countries = Array.from(root.querySelectorAll<SVGPathElement>('[data-country]'));
  const reportedCountries = new Set(evidence.map(record => record.id));
  let index = 0;
  let started = false;
  let mode: 'observed' | 'transition' | 'outlook' = 'observed';
  let timer: ReturnType<typeof setInterval> | undefined;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function stop() { if (timer) clearInterval(timer); timer = undefined; }
  function setHidden(selector: string, hidden: boolean) { root.querySelector(selector)!.toggleAttribute('hidden', hidden); }
  function setYear(year: number) { output.value = String(year); root.dataset.year = String(year); }
  function setMode(next: typeof mode) {
    mode = next; root.dataset.mode = mode;
    ['[data-observed]', '[data-observed-key]', '[data-sources]'].forEach(selector => setHidden(selector, mode !== 'observed'));
    ['[data-outlook]', '[data-outlook-source]', '[data-outlook-scope]', '[data-outlook-metrics]'].forEach(selector => setHidden(selector, mode !== 'outlook'));
    ['[data-outlook-key]', '[data-illustrative-note]'].forEach(selector => setHidden(selector, mode === 'observed'));
    if (mode === 'observed') countries.forEach(country => country.style.removeProperty('fill'));
    setHidden('[data-progress-wrap]', mode === 'outlook');
    root.querySelector('#dwv-map-title')!.textContent = mode === 'observed' ? 'DWV around the world' : 'Varroa habitat outlook';
    root.querySelector('[data-progress-start]')!.textContent = mode === 'observed' ? '2014' : '2025';
    root.querySelector('[data-progress-end]')!.textContent = mode === 'observed' ? '2025' : '2050';
    root.querySelector('[data-progress-wrap]')!.setAttribute('aria-label', mode === 'observed' ? 'Selected reports from 2014 to 2025' : 'Illustrative color transition from 2025 to 2050; not annual forecasts');
    root.querySelector('#atlas-map-description')!.textContent = mode === 'observed'
      ? 'Selected countries with published DWV detections. Country shading indicates a report, not national prevalence.'
      : 'Illustrative transition from 2025 to 2050. Country fills gradually deepen from pale yellow to gold and rust. Colors, timing and country-level changes are artistic choices, not measured or predicted values. The separately cited published global habitat estimate is not derived from these country colors.';
  }
  function showYear(next: number) {
    index = next;
    const year = years[index];
    setYear(year);
    progress.style.width = `${index / 5 * 100}%`;
    const available = new Set(evidence.filter(record => record.year <= year).map(record => record.id));
    root.querySelectorAll<SVGPathElement>('[data-country]').forEach(country => country.classList.toggle('is-recorded', available.has(country.dataset.country!)));
    root.querySelectorAll<SVGAElement>('[data-marker]').forEach(marker => {
      const visible = Number(marker.dataset.year) <= year;
      marker.classList.toggle('is-visible', visible);
      marker.classList.toggle('is-current', Number(marker.dataset.year) === year);
      marker.setAttribute('tabindex', visible ? '0' : '-1');
      marker.setAttribute('aria-hidden', String(!visible));
    });
    button.hidden = index !== 5;
  }
  function finishHistory() { stop(); showYear(5); }
  function paintIllustration(year: number) {
    const amount = (year - 2025) / 25;
    countries.forEach(country => {
      const iso = country.dataset.country!;
      country.style.fill = illustrativeCountryFill(iso, amount, reportedCountries.has(iso));
    });
  }
  function finishOutlook() {
    stop(); setMode('outlook'); setYear(2050); paintIllustration(2050); progress.style.width = '100%';
    button.disabled = false; button.textContent = '← Back to 2025';
  }
  function start() {
    started = true;
    if (reducedMotion()) { finishHistory(); return; }
    showYear(0);
    timer = setInterval(() => { showYear(index + 1); if (index === 5) stop(); }, 550);
  }
  button.addEventListener('click', () => {
    stop();
    if (mode === 'outlook') {
      setMode('observed'); finishHistory(); button.textContent = 'See 2050 outlook →'; return;
    }
    if (reducedMotion()) { finishOutlook(); return; }
    setMode('transition'); setYear(2025); paintIllustration(2025); progress.style.width = '0%';
    button.disabled = true; button.textContent = '2025 → 2050';
    let year = 2025;
    // Animate explicitly illustrative country shades, not annual predictions.
    timer = setInterval(() => {
      year += 1; setYear(year); paintIllustration(year); progress.style.width = `${(year - 2025) / 25 * 100}%`;
      if (year === 2050) finishOutlook();
    }, 80);
  });
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) start();
    else if (!entries[0].isIntersecting && started) {
      if (mode === 'observed' && index < 5) finishHistory();
      else if (mode === 'transition') finishOutlook();
    }
  }, { threshold: .25 }).observe(root);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden || !started) return;
    if (mode === 'observed') finishHistory();
    else if (mode === 'transition') finishOutlook();
  });
  setMode('observed'); showYear(0);
});
