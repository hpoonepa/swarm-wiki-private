/* Shared scroll mapping: pause for the yearly data, then for the DWV comparison. */
(() => {
  const HOLD_AT = .16, DWV_AT = .285;
  function parts() {
    const section = document.getElementById('honeycomb-earth');
    const height = section.querySelector('.geo-stage').clientHeight;
    return { top: section.getBoundingClientRect().top + scrollY, unit: height * 10, hold: height * 1.8, dwvHold: height * 4 };
  }
  window.earthScroll = (position = scrollY) => {
    const {top, unit, hold, dwvHold} = parts();
    const distance = Math.max(0, position - top), start = HOLD_AT * unit;
    if (distance < start) return {p: distance / unit, years: 0, disease: 0};
    if (distance < start + hold) return {p: HOLD_AT, years: (distance - start) / hold, disease: 0};
    const afterYears = distance - hold, dwvStart = DWV_AT * unit;
    if (afterYears < dwvStart) return {p: afterYears / unit, years: 1, disease: 0};
    if (afterYears < dwvStart + dwvHold) return {p: DWV_AT, years: 1, disease: (afterYears-dwvStart)/dwvHold};
    return {p: (afterYears - dwvHold) / unit, years: 1, disease: 1};
  };
  window.earthOffset = p => {
    const {unit, hold, dwvHold} = parts();
    return p * unit + (p > HOLD_AT ? hold : 0) + (p > DWV_AT ? dwvHold : 0);
  };
  window.earthDiseaseOffset = progress => { const {unit, hold, dwvHold} = parts(); return DWV_AT*unit + hold + Math.max(0,Math.min(1,progress))*dwvHold; };
})();
