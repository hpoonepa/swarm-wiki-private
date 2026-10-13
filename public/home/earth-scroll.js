/* Shared scroll mapping: pause for the yearly data, the DWV comparison, then the SWARM introduction. */
(() => {
  // [progress where the pause happens, name of its own 0-1 progress, length in screen heights]
  const HOLDS = [[.16, 'years', 1.2], [.285, 'disease', 6.4], [.325, 'intro', 3.2]];
  function parts() {
    const section = document.getElementById('honeycomb-earth');
    const height = section.querySelector('.geo-stage').clientHeight;
    return { top: section.getBoundingClientRect().top + scrollY, unit: height * 10, height };
  }
  window.earthScroll = (position = scrollY) => {
    const {top, unit, height} = parts();
    const distance = Math.max(0, position - top), out = {years: 0, disease: 0, intro: 0};
    let shift = 0;
    for (const [at, key, length] of HOLDS) {
      const start = at * unit + shift, hold = length * height;
      if (distance < start) return {...out, p: (distance - shift) / unit};
      if (distance < start + hold) return {...out, p: at, [key]: (distance - start) / hold};
      out[key] = 1; shift += hold;
    }
    return {...out, p: (distance - shift) / unit};
  };
  window.earthOffset = p => {
    const {unit, height} = parts();
    return HOLDS.reduce((sum, [at, , length]) => sum + (p > at ? length * height : 0), p * unit);
  };
  // Scroll offset of a point inside one of the pauses.
  const holdOffset = (name, progress) => {
    const {unit, height} = parts(); let shift = 0;
    for (const [at, key, length] of HOLDS) { if (key === name) return at * unit + shift + Math.max(0, Math.min(1, progress)) * length * height; shift += length * height; }
  };
  window.earthDiseaseOffset = progress => holdOffset('disease', progress);
  window.earthIntroOffset = progress => holdOffset('intro', progress);
})();
