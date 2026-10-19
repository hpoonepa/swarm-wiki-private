/* Shared scroll mapping: pause for the yearly data, the DWV comparison, then the SWARM introduction. */
(() => {
  // [progress where the pause happens, name of its own 0-1 progress, length in screen heights]
  const HOLDS = [[.16, 'years', 1.5], [.285, 'disease', 2.8], [.325, 'intro', 2.4], [1.285, 'middle', .5]];
  // Camera moves have room to read as a sideways journey; reading and RNA playback keep
  // their original room. Both navigation and playback use this same mapping.
  // Give the protein close-up 4.2 screens: arrival, separation, then readable cards.
  const QUICK_MOVES = [[.35, .76, .52], [.76, 1.08, 2.625], [1.085, 1.53, .74]];
  const travel = p => 5 * (p - QUICK_MOVES.reduce((saved, [start, end, rate]) =>
    saved + Math.max(0, Math.min(p, end) - start) * (1 - rate), 0));
  function progressAt(distance) {
    let saved = 0;
    for (const [start, end, rate] of QUICK_MOVES) {
      const from = start * 5 - saved, length = (end - start) * 5 * rate;
      if (distance < from) return (distance + saved) / 5;
      if (distance < from + length) return start + (distance - from) / (5 * rate);
      saved += (end - start) * 5 * (1 - rate);
    }
    return (distance + saved) / 5;
  }
  document.getElementById('honeycomb-earth').style.setProperty('--journey-screens',
    String(1 + travel(2.60) + HOLDS.reduce((sum, [, , length]) => sum + length, 0)));
  function parts() {
    const section = document.getElementById('honeycomb-earth');
    const height = section.querySelector('.geo-stage').clientHeight;
    return { top: section.getBoundingClientRect().top + scrollY, unit: height * 5, height };
  }
  window.earthScroll = (position = scrollY) => {
    const {top, unit, height} = parts();
    const distance = Math.max(0, position - top), out = {years: 0, disease: 0, intro: 0};
    let shift = 0;
    for (const [at, key, length] of HOLDS) {
      const start = travel(at) * height + shift, hold = length * height;
      if (distance < start) return {...out, p: progressAt((distance - shift) / height)};
      if (distance < start + hold) return {...out, p: at, [key]: (distance - start) / hold};
      out[key] = 1; shift += hold;
    }
    return {...out, p: progressAt((distance - shift) / height)};
  };
  window.earthOffset = p => {
    const {unit, height} = parts();
    return HOLDS.reduce((sum, [at, , length]) => sum + (p > at ? length * height : 0), travel(p) * height);
  };
  // Scroll offset of a point inside one of the pauses.
  const holdOffset = (name, progress) => {
    const {unit, height} = parts(); let shift = 0;
    for (const [at, key, length] of HOLDS) { if (key === name) return travel(at) * height + shift + Math.max(0, Math.min(1, progress)) * length * height; shift += length * height; }
  };
  window.earthDiseaseOffset = progress => holdOffset('disease', progress);
  window.earthIntroOffset = progress => holdOffset('intro', progress);
})();
