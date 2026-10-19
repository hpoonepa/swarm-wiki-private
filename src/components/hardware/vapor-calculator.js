export function initVaporCalculator(root) {
if (root.dataset.initialized) return;
root.dataset.initialized = 'true';
// ===================== VALIDATION DATA =====================
// From the "Hardware graph" sheet. Masses in grams; bowl = empty steel bowl weight.
const ORIGINAL_DATA = {
  units: 'g',
  times: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
  runs: [
    { label: '40 C', temp: 40, bowl: 3.715, vals: [3.815, 3.806, 3.799, 3.793, 3.786, 3.780, 3.772, 3.765, 3.758, 3.751, 3.746, 3.739] },
    { label: '50 C', temp: 50, bowl: 3.716, vals: [3.814, 3.807, 3.798, 3.789, 3.779, 3.770, 3.762, 3.753, 3.746, 3.739, 3.732, 3.725] },
    { label: '60 C', temp: 60, bowl: 3.715, vals: [3.816, 3.802, 3.789, 3.777, 3.764, 3.750, 3.737, 3.725, 3.715, 3.715, 3.715, 3.715] },
    { label: '70 C', temp: 70, bowl: 3.716, vals: [3.815, 3.799, 3.787, 3.770, 3.757, 3.743, 3.735, 3.723, 3.716, 3.716, 3.716, 3.716] }
  ]
};
// ===================== MODEL SETTINGS =====================
const MODEL = {
  tareNoiseMg: 1.5,      // readings within this of the bowl weight count as "dry" and are left out of the fit
  scanMin: 25,           // lowest temperature the solver will suggest (room temp, heater off)
  scanMax: 90,           // highest temperature the solver will try
  volumeWarnFactor: 3,   // warn when the sample is more than 3x bigger or smaller than the tested amount
  stopTemps: [40, 50, 60, 70] // color ramp anchors (match --t40..--t70)
};
// ===========================================================================================

const $ = id => root.querySelector('#vapor-calc-' + id);
const DATA = ORIGINAL_DATA;
const M = analyze(DATA);
let mode = 'time';
let COLORS = {};
let last = null;

function mean(a){ return a.reduce((s, v) => s + v, 0) / a.length; }

function linfit(p){
  if (p.length < 2) return null;
  const mx = mean(p.map(q => q.t)), my = mean(p.map(q => q.m));
  let sxx = 0, sxy = 0, syy = 0;
  p.forEach(q => { sxx += (q.t - mx) ** 2; sxy += (q.t - mx) * (q.m - my); syy += (q.m - my) ** 2; });
  if (sxx === 0) return null;
  const slope = sxy / sxx, icpt = my - slope * mx;
  let sse = 0; p.forEach(q => { sse += (q.m - (icpt + slope * q.t)) ** 2; });
  return { rate: -slope, intercept: icpt, r2: syy ? 1 - sse / syy : 1, n: p.length };
}

function analyze(data){
  const k = data.units === 'mg' ? 1 : 1000;
  const runs = data.runs.map(r => {
    const pts = data.times.map((t, i) => ({ t, m: Number.isFinite(r.vals[i]) ? Math.max(0, (r.vals[i] - r.bowl) * k) : NaN })).filter(p => Number.isFinite(p.m));
    const fit = linfit(pts.filter(p => p.m > MODEL.tareNoiseMg));
    return { ...r, pts, fit };
  }).filter(r => r.fit && r.fit.rate > 0);
  const byT = new Map();
  runs.forEach(r => { if (!byT.has(r.temp)) byT.set(r.temp, []); byT.get(r.temp).push(r.fit.rate); });
  const curve = [...byT].map(([T, rs]) => ({ T, rate: mean(rs), n: rs.length })).sort((a, b) => a.T - b.T);
  const starts = runs.map(r => r.pts[0] && r.pts[0].m).filter(Number.isFinite);
  return { runs, curve, startAmt: starts.length ? mean(starts) : 100 };
}

function rateAt(T){
  const c = M.curve;
  if (c.length === 1) return c[0].rate;
  let i;
  if (T <= c[0].T) i = 0;
  else if (T >= c[c.length - 1].T) i = c.length - 2;
  else { i = 0; while (T > c[i + 1].T) i++; }
  const a = c[i], b = c[i + 1];
  const r = a.rate + (b.rate - a.rate) * (T - a.T) / (b.T - a.T);
  return Math.max(r, 0.1 * Math.min(...c.map(p => p.rate)));
}
const tLo = () => M.curve[0].T, tHi = () => M.curve[M.curve.length - 1].T;
const isExtrap = T => T < tLo() - 0.05 || T > tHi() + 0.05;

function solveTemp(req){
  let maxRate = 0, maxT = MODEL.scanMin;
  if (rateAt(MODEL.scanMin) >= req) return { T: MODEL.scanMin, status: 'room' };
  for (let k = 0; k <= (MODEL.scanMax - MODEL.scanMin) * 10; k++) {
    const T = MODEL.scanMin + k / 10, r = rateAt(T);
    if (r > maxRate) { maxRate = r; maxT = T; }
    if (r >= req) return { T, status: 'ok' };
  }
  return { T: null, status: 'unreachable', maxRate, maxT };
}

// ---------- colors ----------
function hexToRgb(h){ h = h.replace('#', '').trim(); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function readColors(){ const cs = getComputedStyle(root); MODEL.stopTemps.forEach(T => { COLORS[T] = hexToRgb(cs.getPropertyValue('--t' + T)); }); }
function tempColor(T, a = 1){
  const s = MODEL.stopTemps; let c;
  if (T <= s[0]) c = COLORS[s[0]];
  else if (T >= s[s.length - 1]) c = COLORS[s[s.length - 1]];
  else { let i = 0; while (T > s[i + 1]) i++; const f = (T - s[i]) / (s[i + 1] - s[i]); const A = COLORS[s[i]], B = COLORS[s[i + 1]]; c = A.map((v, k) => Math.round(v + (B[k] - v) * f)); }
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

// ---------- formatting ----------
const fv = v => v <= 0 ? '0' : v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '');
const fT = T => Math.abs(T - Math.round(T)) < 0.05 ? String(Math.round(T)) : T.toFixed(1);
function fmtTimeText(min){
  if (!Number.isFinite(min)) return '--';
  if (min < 1) return `${Math.round(min * 60)} s`;
  if (min < 90) return `${min.toFixed(1)} min`;
  const h = Math.floor(min / 60), m = Math.round(min - h * 60);
  return `${h} h ${m} min`;
}
function fmtTimeParts(min){
  if (min < 1) return { v: String(Math.round(min * 60)), u: 's' };
  if (min < 90) return { v: min.toFixed(1), u: 'min' };
  const h = Math.floor(min / 60), m = Math.round(min - h * 60);
  return { v: `${h}:${String(m).padStart(2, '0')}`, u: 'h:mm' };
}
const fmtClock = sec => { sec = Math.max(0, Math.ceil(sec)); const m = Math.floor(sec / 60), s = sec % 60; return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
const rangeText = () => `${fT(tLo())}–${fT(tHi())} °C`;

// ---------- compute ----------
const num = id => { const v = parseFloat($(id).value); return Number.isFinite(v) ? v : NaN; };
function compute(){
  const r = { mode, m0: num('in-start'), T: num('in-temp'), tIn: num('in-time'), tgt: num('in-target'), err: null };
  if (!(r.m0 > 0)) { r.err = 'Enter a starting amount above 0 µL.'; return r; }
  if (mode !== 'left') {
    if (!(r.tgt >= 0)) { r.err = 'Enter a target of 0 µL or more.'; return r; }
    if (r.tgt >= r.m0) { r.err = 'The target has to be less than the starting amount.'; return r; }
  }
  if (mode !== 'time' && !(r.tIn > 0)) { r.err = 'Enter a drying time above 0 minutes.'; return r; }
  if (mode !== 'temp' && !Number.isFinite(r.T)) { r.err = 'Enter a temperature.'; return r; }
  if (mode === 'time') { r.Tuse = r.T; r.rate = rateAt(r.T); r.t = (r.m0 - r.tgt) / r.rate; }
  else if (mode === 'left') { r.Tuse = r.T; r.rate = rateAt(r.T); r.t = r.tIn; r.left = Math.max(0, r.m0 - r.rate * r.tIn); }
  else {
    r.t = r.tIn; r.req = (r.m0 - r.tgt) / r.tIn;
    const s = solveTemp(r.req); r.status = s.status;
    if (s.T != null) { r.Tsol = s.T; r.Tuse = s.T; r.rate = rateAt(s.T); }
    else { r.Tuse = null; r.rate = s.maxRate; r.tMin = (r.m0 - r.tgt) / s.maxRate; }
  }
  r.tDry = r.m0 / r.rate;
  r.extrap = r.Tuse != null && isExtrap(r.Tuse);
  r.volWarn = r.m0 > M.startAmt * MODEL.volumeWarnFactor || r.m0 < M.startAmt / MODEL.volumeWarnFactor;
  return r;
}

// ---------- readout ----------
const KEYS = { time: 'Time to reach target', left: 'Liquid left', temp: 'Temperature needed' };
const tgtText = r => r.tgt > 0 ? `${fv(r.tgt)} µL` : 'fully dry';

function renderReadout(r){
  $('ro-k').textContent = KEYS[mode];
  $('oled').classList.toggle('err', !!r.err);
  let big = '--', u = '', line = r.err || '';
  if (!r.err) {
    if (mode === 'time') {
      const p = fmtTimeParts(r.t); big = p.v; u = p.u;
    } else if (mode === 'left') {
      big = fv(r.left); u = 'µL';
    } else {
      u = '°C';
      if (r.status === 'ok') big = String(Math.ceil(r.Tsol - 1e-6));
      else if (r.status === 'room') big = '≤' + MODEL.scanMin;
      else line = `Outside the model's range. Minimum estimated time: ${fmtTimeText(r.tMin)}.`;
    }
  }
  $('ro-big').textContent = big;
  $('ro-u').textContent = u;
  $('ro-line').textContent = line;
  $('ro-line').hidden = !line;

  const chips = [];
  if (!r.err && r.extrap) chips.push(`<span class="chip warn">Outside measured ${rangeText()} range</span>`);
  if (!r.err && r.volWarn) chips.push(`<span class="chip warn">Volume differs from the ${fv(Math.round(M.startAmt))} µL test runs</span>`);
  $('chips').innerHTML = chips.join('');
  $('chips').hidden = !chips.length;

  if (!timer || timer.done) {
    const ok = !r.err && Number.isFinite(r.t) && r.t > 0;
    $('btn-timer').disabled = !ok;
    $('btn-timer').textContent = 'Start timer';
  }
}

// ---------- charts ----------
function niceStep(range, count){ const raw = range / count; const p = Math.pow(10, Math.floor(Math.log10(raw))); const f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }
function niceMax(v, count){ const s = niceStep(v, count); return Math.ceil(v / s - 1e-9) * s; }
const tickLbl = v => Math.abs(v - Math.round(v)) < 1e-6 ? String(Math.round(v)) : v.toFixed(1);

function renderMain(r){
  const box = $('chart-main');
  const W = Math.max(220, Math.floor(box.clientWidth)); const H = Math.round(Math.min(400, Math.max(250, W * 0.52)));
  const pad = { l: 46, r: 18, t: 16, b: 40 };
  const ok = !r.err && r.rate > 0;
  const m0 = ok ? r.m0 : M.startAmt;
  const maxMeas = Math.max(...M.runs.flatMap(run => run.pts.map(p => p.m)));
  const lastT = Math.max(...DATA.times);
  const xMax = niceMax(Math.max(lastT, ok ? r.t * 1.12 : 0), 6);
  const yMax = niceMax(Math.max(m0, maxMeas) * 1.06, 5);
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const X = t => pad.l + iw * t / xMax, Y = m => pad.t + ih * (1 - m / yMax);
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Liquid left versus time for measured runs and your sample">`;
  s += `<defs><clipPath id="clip-main"><rect x="${pad.l}" y="${pad.t - 4}" width="${iw + 4}" height="${ih + 8}"/></clipPath></defs>`;
  const ys = niceStep(yMax, 5);
  for (let v = 0; v <= yMax + 1e-9; v += ys) { s += `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${pad.l - 8}" y="${Y(v) + 4}" text-anchor="end">${tickLbl(v)}</text>`; }
  const xs = niceStep(xMax, 6);
  for (let v = 0; v <= xMax + 1e-9; v += xs) { s += `<line class="grid" x1="${X(v)}" x2="${X(v)}" y1="${pad.t}" y2="${H - pad.b}" opacity=".5"/><text x="${X(v)}" y="${H - pad.b + 16}" text-anchor="middle">${tickLbl(v)}</text>`; }
  s += `<line class="axis" x1="${pad.l}" x2="${W - pad.r}" y1="${Y(0)}" y2="${Y(0)}"/>`;
  s += `<text x="${W - pad.r}" y="${H - 6}" text-anchor="end">minutes</text>`;
  s += `<text x="12" y="${pad.t + ih / 2}" text-anchor="middle" transform="rotate(-90 12 ${pad.t + ih / 2})">liquid left (µL)</text>`;
  s += `<g clip-path="url(#clip-main)">`;
  M.runs.forEach(run => {
    const c = tempColor(run.temp);
    s += `<polyline fill="none" stroke="${c}" stroke-width="1.5" stroke-opacity=".45" points="${run.pts.map(p => `${X(p.t)},${Y(p.m)}`).join(' ')}"/>`;
    run.pts.forEach(p => { s += `<circle cx="${X(p.t)}" cy="${Y(p.m)}" r="3" fill="${c}"/>`; });
  });
  if (ok) {
    const c = r.Tuse != null ? tempColor(r.Tuse) : 'var(--muted)';
    const tSolid = mode === 'left' ? Math.min(r.t, r.tDry) : r.t;
    const mSolid = Math.max(0, r.m0 - r.rate * tSolid);
    if (mode !== 'left' && r.tgt > 0) {
      s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(r.tgt)}" y2="${Y(r.tgt)}" stroke="var(--ink)" stroke-opacity=".5" stroke-dasharray="2 4"/>`;
      s += `<text class="halo" x="${W - pad.r - 4}" y="${Y(r.tgt) - 6}" text-anchor="end">target ${fv(r.tgt)} µL</text>`;
    }
    s += `<line x1="${X(0)}" y1="${Y(r.m0)}" x2="${X(tSolid)}" y2="${Y(mSolid)}" stroke="${c}" stroke-width="4" stroke-linecap="round"${r.status === 'unreachable' ? ' stroke-dasharray="8 6"' : ''}/>`;
    if (mSolid > 0) s += `<line x1="${X(tSolid)}" y1="${Y(mSolid)}" x2="${X(r.tDry)}" y2="${Y(0)}" stroke="${c}" stroke-width="2" stroke-dasharray="5 5" stroke-opacity=".7"/>`;
    if (mode === 'left' && r.tDry < r.t) s += `<line x1="${X(r.tDry)}" y1="${Y(0)}" x2="${X(r.t)}" y2="${Y(0)}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
    const mx = mode === 'left' ? r.t : tSolid, my = mode === 'left' ? r.left : mSolid;
    s += `<line x1="${X(mx)}" x2="${X(mx)}" y1="${Y(my)}" y2="${Y(0)}" stroke="var(--ink)" stroke-opacity=".35" stroke-dasharray="2 3"/>`;
    s += `<circle cx="${X(mx)}" cy="${Y(my)}" r="7" fill="var(--surface)" stroke="${c}" stroke-width="3"/>`;
    const lbl = mode === 'time' ? fmtTimeText(r.t) : mode === 'left' ? `${fv(r.left)} µL left` : r.status === 'unreachable' ? `best case ${fv(my)} µL` : `${r.status === 'room' ? '≤' : ''}${Math.ceil(r.Tsol - 1e-6)} °C`;
    const right = X(mx) > pad.l + iw * 0.68;
    const ly = Math.max(pad.t + 12, Y(my) - 14);
    s += `</g><text class="t-strong halo" x="${X(mx) + (right ? -12 : 12)}" y="${ly}" text-anchor="${right ? 'end' : 'start'}" style="font-size:12px">${lbl}</text>`;
  } else s += `</g>`;
  s += `</svg>`;
  box.innerHTML = s;
}

function renderRate(r){
  const box = $('chart-rate'); const c = M.curve;
  const W = Math.max(220, Math.floor(box.clientWidth)); const H = Math.round(Math.min(300, Math.max(220, W * 0.6)));
  const pad = { l: 40, r: 14, t: 22, b: 36 };
  const lo = Math.min(MODEL.scanMin, tLo() - 5), hi = Math.max(MODEL.scanMax, tHi() + 5);
  let peak = 0; for (let T = lo; T <= hi; T += 0.5) peak = Math.max(peak, rateAt(T));
  const yMax = niceMax(Math.max(peak, r.req || 0) * 1.18, 4);
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const X = T => pad.l + iw * (T - lo) / (hi - lo), Y = v => pad.t + ih * (1 - v / yMax);
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Drying rate versus temperature">`;
  s += `<defs><linearGradient id="thermal" gradientUnits="userSpaceOnUse" x1="${X(40)}" x2="${X(70)}" y1="0" y2="0">`;
  MODEL.stopTemps.forEach(T => { s += `<stop offset="${(T - 40) / 30}" stop-color="${tempColor(T)}"/>`; });
  s += `</linearGradient></defs>`;
  s += `<rect x="${X(lo)}" y="${pad.t}" width="${X(tLo()) - X(lo)}" height="${ih}" fill="var(--surface-2)"/>`;
  s += `<rect x="${X(tHi())}" y="${pad.t}" width="${X(hi) - X(tHi())}" height="${ih}" fill="var(--surface-2)"/>`;
  if (X(tLo()) - X(lo) > 70) s += `<text x="${(X(lo) + X(tLo())) / 2}" y="${pad.t + 13}" text-anchor="middle" style="font-size:10px">extrapolated</text>`;
  if (X(hi) - X(tHi()) > 70) s += `<text x="${(X(hi) + X(tHi())) / 2}" y="${pad.t + 13}" text-anchor="middle" style="font-size:10px">extrapolated</text>`;
  const ys = niceStep(yMax, 4);
  for (let v = 0; v <= yMax + 1e-9; v += ys) s += `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${pad.l - 7}" y="${Y(v) + 4}" text-anchor="end">${tickLbl(v)}</text>`;
  for (let T = Math.ceil(lo / 10) * 10; T <= hi; T += 10) s += `<text x="${X(T)}" y="${H - pad.b + 16}" text-anchor="middle">${T}</text>`;
  s += `<line class="axis" x1="${pad.l}" x2="${W - pad.r}" y1="${Y(0)}" y2="${Y(0)}"/>`;
  s += `<text x="${W - pad.r}" y="${H - 5}" text-anchor="end">°C</text><text x="${pad.l}" y="${pad.t - 7}" text-anchor="start" style="font-size:10px">µL/min</text>`;
  const path = (a, b) => { let d = ''; for (let T = a; T <= b + 1e-9; T += 0.5) d += (d ? 'L' : 'M') + X(Math.min(T, b)).toFixed(1) + ',' + Y(rateAt(Math.min(T, b))).toFixed(1); return d; };
  s += `<path d="${path(lo, tLo())}" fill="none" stroke="url(#thermal)" stroke-width="2" stroke-dasharray="5 5"/>`;
  s += `<path d="${path(tHi(), hi)}" fill="none" stroke="url(#thermal)" stroke-width="2" stroke-dasharray="5 5"/>`;
  if (c.length > 1) s += `<path d="${path(tLo(), tHi())}" fill="none" stroke="url(#thermal)" stroke-width="3" stroke-linejoin="round"/>`;
  if (r.req && mode === 'temp') {
    s += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(r.req)}" y2="${Y(r.req)}" stroke="var(--ink)" stroke-opacity=".55" stroke-dasharray="2 4"/>`;
    s += `<text class="halo" x="${X(tLo()) + 4}" y="${Y(r.req) - 6}">needed ${r.req.toFixed(2)}</text>`;
  }
  c.forEach(p => {
    s += `<circle cx="${X(p.T)}" cy="${Y(p.rate)}" r="5" fill="${tempColor(p.T)}" stroke="var(--surface)" stroke-width="2"/>`;
    s += `<text class="halo" x="${X(p.T)}" y="${Y(p.rate) + 18}" text-anchor="middle" style="font-size:10px">${p.rate.toFixed(2)}</text>`;
  });
  if (!r.err && r.Tuse != null) {
    const T = r.Tuse, v = rateAt(T);
    s += `<line x1="${X(T)}" x2="${X(T)}" y1="${pad.t}" y2="${Y(0)}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    s += `<circle cx="${X(T)}" cy="${Y(v)}" r="6" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
    const right = X(T) > pad.l + iw * 0.75;
    s += `<text class="t-strong halo" x="${X(T) + (right ? -6 : 6)}" y="${pad.t + 12}" text-anchor="${right ? 'end' : 'start'}">${fT(T)} °C</text>`;
  }
  s += `</svg>`;
  box.innerHTML = s;
}

function renderCompare(r){
  const ok = !r.err;
  const m0 = ok ? r.m0 : M.startAmt;
  const tgt = ok && mode !== 'left' ? r.tgt : 0;
  const rows = M.curve.map(p => ({ T: p.T, rate: p.rate, n: p.n, measured: true }));
  const cur = ok ? r.Tuse : null;
  if (cur != null && !rows.some(x => Math.abs(x.T - cur) < 0.05)) rows.push({ T: cur, rate: rateAt(cur), measured: false });
  rows.sort((a, b) => a.T - b.T);
  const times = rows.map(x => (m0 - tgt) / x.rate);
  const mx = Math.max(...times);
  $('cmp').innerHTML = rows.map((x, i) => {
    const isCur = cur != null && Math.abs(x.T - cur) < 0.05;
    const col = tempColor(x.T);
    return `<div class="crow${isCur ? ' cur' : ''}">
      <span class="ct"><i style="background:${col}"></i>${fT(x.T)} °C</span>
      <span class="cbar"><b style="width:${(100 * times[i] / mx).toFixed(1)}%;background:${col}"></b></span>
      <span class="cv">${fmtTimeText(times[i])}</span>
    </div>`;
  }).join('');
}

// ---------- chart labels ----------
function renderLabels(){
  $('legend-main').innerHTML = M.curve.map(p => `<span><i class="dot" style="background:${tempColor(p.T)}"></i>${fT(p.T)} °C</span>`).join('')
    + `<span><i style="background:var(--ink);height:4px"></i>Estimate</span>`;
  const ticks = [MODEL.scanMin, ...M.curve.map(p => p.T).filter(T => T > MODEL.scanMin && T < MODEL.scanMax), MODEL.scanMax];
  $('ticks').innerHTML = ticks.map(T => `<span class="${M.curve.some(p => p.T === T) ? 'm' : ''}" style="left:${(100 * (T - MODEL.scanMin) / (MODEL.scanMax - MODEL.scanMin)).toFixed(1)}%">${fT(T)}</span>`).join('');
}

// ---------- render ----------
function render(){
  const r = compute(); last = r;
  renderReadout(r); renderMain(r); renderRate(r); renderCompare(r);
}

function setMode(m){
  mode = m;
  root.querySelectorAll('#vapor-calc-modes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  $('f-temp').hidden = m === 'temp';
  $('f-time').hidden = m === 'time';
  $('f-target').hidden = m === 'left';
  render();
}

// ---------- timer ----------
let timer = null, audio = null;
function beep(){
  try {
    if (!audio) return;
    [0, 0.35, 0.7].forEach(d => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
      const t0 = audio.currentTime + d; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      o.start(t0); o.stop(t0 + 0.28);
    });
  } catch (e) {}
}
function tick(){
  const left = timer.end - Date.now();
  if (left <= 0) {
    clearInterval(timer.iv); timer.done = true;
    $('timer-clock').textContent = '00:00'; $('timer-bar').style.width = '100%';
    $('timer-label').textContent = 'Done. Check the bowl.'; beep();
    if (timer.lock) timer.lock.release().catch(() => {});
    renderReadout(last); return;
  }
  $('timer-clock').textContent = fmtClock(left / 1000);
  $('timer-bar').style.width = (100 * (1 - left / timer.total)).toFixed(2) + '%';
}
$('btn-timer').addEventListener('click', () => {
  if (timer && !timer.done) {
    clearInterval(timer.iv); if (timer.lock) timer.lock.release().catch(() => {});
    timer = null; $('timer').hidden = true; renderReadout(last); return;
  }
  const r = last; if (!r || r.err || !(r.t > 0)) return;
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume && audio.resume(); } catch (e) {}
  const total = r.t * 60000;
  timer = { end: Date.now() + total, total, done: false, iv: setInterval(tick, 250) };
  try { navigator.wakeLock && navigator.wakeLock.request('screen').then(l => { if (timer) timer.lock = l; }).catch(() => {}); } catch (e) {}
  $('timer-label').textContent = `${KEYS[mode].toLowerCase()} · ${$('ro-big').textContent} ${$('ro-u').textContent}`;
  $('timer').hidden = false; $('btn-timer').textContent = 'Stop timer'; tick();
});

// ---------- copy ----------
function summary(r){
  if (r.err) return '';
  let s;
  if (mode === 'time') s = `${fv(r.m0)} µL at ${fT(r.T)} °C reaches ${tgtText(r)} in ${fmtTimeText(r.t)} (rate ${r.rate.toFixed(2)} µL/min).`;
  else if (mode === 'left') s = `${fv(r.m0)} µL at ${fT(r.T)} °C for ${fmtTimeText(r.t)} leaves ${fv(r.left)} µL (rate ${r.rate.toFixed(2)} µL/min).`;
  else if (r.status === 'unreachable') s = `${fv(r.m0)} µL to ${tgtText(r)} in ${fmtTimeText(r.t)} is faster than any tested setting; minimum time is ${fmtTimeText(r.tMin)}.`;
  else s = `To take ${fv(r.m0)} µL to ${tgtText(r)} in ${fmtTimeText(r.t)}, set at least ${r.status === 'room' ? MODEL.scanMin : Math.ceil(r.Tsol - 1e-6)} °C.`;
  return `VAPOR-X model (${M.runs.length} runs): ${s}${r.extrap ? ' Extrapolated beyond tested temperatures.' : ''}`;
}
$('btn-copy').addEventListener('click', () => {
  const text = summary(last); const btn = $('btn-copy');
  if (!text) return;
  const done = msg => { btn.textContent = msg; setTimeout(() => { btn.textContent = 'Copy result'; }, 1600); };
  const fallback = () => {
    try { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const okc = document.execCommand('copy'); ta.remove(); done(okc ? 'Copied' : 'Copy failed'); }
    catch (e) { done('Copy failed'); }
  };
  try { navigator.clipboard.writeText(text).then(() => done('Copied'), fallback); } catch (e) { fallback(); }
});

// ---------- inputs ----------
root.querySelectorAll('#vapor-calc-modes button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
['in-start', 'in-time', 'in-target'].forEach(id => $(id).addEventListener('input', render));
$('in-temp').addEventListener('input', () => { const v = num('in-temp'); if (Number.isFinite(v)) $('in-temp-range').value = Math.min(MODEL.scanMax, Math.max(MODEL.scanMin, v)); render(); });
$('in-temp-range').addEventListener('input', () => { $('in-temp').value = $('in-temp-range').value; render(); });
// ---------- resize + theme ----------
let lastW = 0, resizeFrame = 0;
const ro = new ResizeObserver(() => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    const w = $('chart-main').clientWidth + $('chart-rate').clientWidth;
    if (w !== lastW) {
      lastW = w;
      if (last) { renderMain(last); renderRate(last); }
    }
  });
});
ro.observe($('chart-main')); ro.observe($('chart-rate'));
const retheme = () => { readColors(); renderLabels(); render(); };
try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', retheme); } catch (e) {}
new MutationObserver(retheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

readColors();
renderLabels();
setMode('time');
}
