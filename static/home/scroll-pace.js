/* Trim large wheel bursts during the pinned story. Never queue leftover scrolling. */
(() => {
  const story = document.getElementById('honeycomb-earth');
  if (!story) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let budget = 0, last = 0;
  function ownsScroll(target) {
    if (!(target instanceof Element)) return false;
    if (target.closest('dialog, [role="dialog"], input, textarea, select, [contenteditable="true"]')) return true;
    for (let el = target; el && el !== document.body; el = el.parentElement) {
      if (el.scrollHeight > el.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(el).overflowY)) return true;
    }
    return false;
  }
  addEventListener('wheel', event => {
    // Reverse scrolling, pinch zoom, keyboard navigation and touch stay native.
    if (!event.cancelable || event.defaultPrevented || event.ctrlKey || event.metaKey ||
        event.deltaY <= 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        reduce.matches || document.documentElement.classList.contains('loading') || ownsScroll(event.target)) {
      last = 0;
      return;
    }
    const height = story.querySelector('.geo-stage').clientHeight;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    const rect = story.getBoundingClientRect();
    // Leave scrolling outside the pinned story untouched, including its final exit.
    if (rect.top > delta || rect.bottom <= height + 1) { last = 0; return; }
    const now = performance.now();
    const intro = window.earthScroll?.().intro;
    const rate = height * (intro > 0 && intro < 1 ? 1.1 : 2.6);
    const capacity = height * .30;
    budget = !last || now - last > 240 ? capacity : Math.min(capacity, budget + (now - last) * rate / 1000);
    last = now;
    const allowed = Math.min(delta, budget);
    budget -= allowed;
    if (allowed + .5 >= delta) return;
    event.preventDefault();
    if (allowed > 0) scrollBy({ top: allowed, behavior: 'instant' });
  }, { passive: false });
})();
