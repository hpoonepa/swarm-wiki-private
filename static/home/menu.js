(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const at = (id, p = 0) => { const el = document.getElementById(id); return el.getBoundingClientRect().top + scrollY + (id === 'honeycomb-earth' ? window.earthOffset(p) : (el.offsetHeight - innerHeight) * p); };
  const destinations = {
    top: () => 0, statement: () => at('statement', .12), earth: () => at('honeycomb-earth', .04),
    usa: () => at('honeycomb-earth', .16), atlanta: () => at('honeycomb-earth', .26), 'hive-arrival': () => at('honeycomb-earth', .385), hive: () => at('honeycomb-earth', .455), flower: () => at('honeycomb-earth', .455),
    bee: () => at('honeycomb-earth', .585), minibinders: () => at('honeycomb-earth', .775), 'rna-intro': () => at('honeycomb-earth', 1.38), rnai: () => at('honeycomb-earth', 1.54),
    dwv: () => at('honeycomb-earth') + window.earthDiseaseOffset(.44), 'bee-comparison': () => at('honeycomb-earth') + window.earthDiseaseOffset(.82),
    together: () => at('together', .55), explore: () => at('explore')
  };
  function followHash() {
    const hash = location.hash.slice(1), key = hash === 'honeycomb-earth' ? 'earth' : hash;
    if (destinations[key]) scrollTo({ top: destinations[key](), behavior: 'instant' });
  }
  addEventListener('swarm-ready', followHash);
  addEventListener('hashchange', followHash);
  document.addEventListener('swarm-navigate', event => {
    const destination = destinations[event.detail];
    if (!destination) return;
    history.replaceState(null, '', '#' + event.detail);
    scrollTo({ top: destination(), behavior: reduce.matches ? 'auto' : 'smooth' });
  });
})();
