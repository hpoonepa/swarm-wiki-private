import{R as W}from"./index.CUdgKIr_.js";/* empty css                              */import"./_commonjsHelpers.CqkleIqs.js";const T=[["Team",[["Team","team"],["Attributions","attributions"]]],["Project",[["Description","description"],["Contribution","contribution"],["Engineering Success","engineering"],["Implementation","implementation"]]],["Wetlab",[["Minibinder",[["Overview","minibinder"],["Design","minibinder-design"],["Experimentation","minibinder-experimentation"]]],["RNAi",[["Overview","rnai"],["Design","rnai-design"],["Experimentation","rnai-experimentation"]]],["Parts Roster","parts"],["Notebook",[["Minibinder","notebook"],["RNAi","notebook-rnai"]]],["Results","results"],["Experiments","experiments"]]],["Drylab",[["Hardware","hardware"],["Software","software"],["Modeling","model"],["Minibinder viewer","minibinder-viewer"]]],["Human Practices",[["Education",[["Overview","education"],["Modeling Instructional","model-instructional"]]],["Integrated Human Practices","human-practices"],["Inclusivity","inclusivity"],["Sustainability","sustainability"],["Entrepreneurship","entrepreneurship"],["Safety","safety"]]]],I=[["Team",[["Team","team"],["Attributions","attributions"]]],["Project",[["Description","description"],["Contribution","contribution"],["Engineering Success","engineering"],["Implementation","implementation"]]],["Drylab",[["Hardware","hardware"],["Software","software"],["Modeling","model"],["Minibinder viewer","minibinder-viewer"]]],["Wetlab",[["Minibinder","minibinder"],["RNAi","rnai"],["Experiments","experiments"],["Parts","parts"],["Notebook","notebook"],["Results","results"]]],["Human Practices",[["Education","education"],["Integrated Human Practices","human-practices"],["Inclusivity","inclusivity"],["Sustainability","sustainability"],["Entrepreneurship","entrepreneurship"],["Safety","safety"]]]],O=`
  :host([data-map-open]) { z-index: 900; }
  .map { position: absolute; inset: 0; z-index: 1; display: none; overflow: auto; overscroll-behavior: contain; color: #1a322a; pointer-events: auto; --ease-out: cubic-bezier(.22, 1, .36, 1); --ease-in: cubic-bezier(.7, 0, .84, 0); }
  .map.is-open, .map.is-closing { display: block; }
  .map.is-closing { pointer-events: none; }
  .map__veil { position: absolute; inset: 0; background: #FFFDF6; }
  .map.is-open .map__veil { animation: map-fade .22s var(--ease-out) both; }
  .map.is-closing .map__veil { animation: map-fade-out .2s var(--ease-in) both; animation-delay: .42s; }
  .map__stage { position: absolute; inset: 0; display: grid; place-items: center; padding: 72px 32px 48px; }
  .comb { position: relative; width: var(--w); height: var(--h); }
  .comb svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .comb__cells { transform-origin: 100% 0; }
  .map.is-open .comb__cells { animation: map-unfold .9s var(--ease-out) both; }
  .map.is-closing .comb__cells { animation: map-fold .58s var(--ease-in) both; }
  .cell { transform-box: fill-box; transform-origin: center; }
  .map.is-open .cell { animation: map-pop .42s var(--ease-out) both; animation-delay: var(--d); }
  .map.is-closing .cell { animation: map-pop-out .3s var(--ease-in) both; animation-delay: calc(var(--dmax) - var(--d)); }
  .cell--wax.is-wall polygon { fill: none; stroke-width: 1.6; }
  .cell--page { filter: drop-shadow(0 2px 3px rgba(26, 50, 42, .10)) drop-shadow(0 14px 26px rgba(26, 50, 42, .14)); transition: transform .18s var(--ease-out), filter .18s; }
  .cell--page polygon { transition: fill .15s; }
  .cell--page text { fill: #1a322a; font-weight: 650; letter-spacing: -.01em; pointer-events: none; }
  .cell--page:hover, .cell--page:focus-visible { transform: translateY(-3px); filter: drop-shadow(0 4px 6px rgba(26, 50, 42, .10)) drop-shadow(0 22px 34px rgba(26, 50, 42, .18)); }
  .cell--page:hover polygon { fill: #FFE38F; }
  .cell--page:focus-visible { outline: none; }
  .cell--page:focus-visible polygon { stroke: #1a322a; stroke-width: 2; }
  .cell--current polygon { fill: #FFF0BF; }
  .honey { filter: drop-shadow(0 1px 1.5px rgba(120, 70, 0, .35)); }
  .honey__stream { fill: none; stroke: #F5B827; stroke-linecap: round; stroke-linejoin: round; }
  .honey__sheen { fill: none; stroke: rgba(255, 248, 214, .9); stroke-linecap: round; stroke-linejoin: round; }
  .map.is-open .honey__stream { animation: map-pour 1.6s cubic-bezier(.45, .05, .35, 1) both; animation-delay: calc(var(--d) + .35s); }
  .map.is-open .honey__sheen { animation: map-sheen 4.5s linear infinite; animation-delay: calc(var(--d) + 2.3s); }
  .title { position: absolute; z-index: 2; margin: 0; white-space: nowrap; transform: translateY(-50%); font-size: var(--ts); line-height: .95; font-weight: 800; letter-spacing: -.045em; }
  .map.is-open .title { animation: map-rise .5s var(--ease-out) both; animation-delay: .38s; }
  .map.is-closing .title { animation: map-drop .22s var(--ease-in) both; }
  .stack { display: flex; flex-direction: column; gap: 26px; }
  .stack .title { position: static; transform: none; margin: 0 0 6px; }
  @keyframes map-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes map-fade-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes map-unfold { from { transform: scale(.18); } to { transform: scale(1); } }
  @keyframes map-fold { from { transform: scale(1); } to { transform: scale(.18); } }
  @keyframes map-pop { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
  @keyframes map-pop-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(.3); } }
  @keyframes map-rise { from { opacity: 0; transform: translateY(calc(-50% + 10px)); } to { opacity: 1; transform: translateY(-50%); } }
  @keyframes map-drop { from { opacity: 1; transform: translateY(-50%); } to { opacity: 0; transform: translateY(calc(-50% + 10px)); } }
  @keyframes map-pour { to { stroke-dashoffset: 0; } }
  @keyframes map-sheen { from { stroke-dashoffset: var(--L); } to { stroke-dashoffset: calc(var(--L) * -1); } }
  @media (max-width: 760px) {
    .map__stage { display: block; padding: 84px 18px 40px; }
    .map.is-open .comb__cells { animation: none; }
    .stack .title { animation: none !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .map.is-open .comb__cells, .map.is-open .cell, .map.is-open .title { animation: map-fade .2s var(--ease-out) both; }
    .map.is-closing .comb__cells, .map.is-closing .cell, .map.is-closing .title { animation: map-fade-out .2s var(--ease-in) both; }
    .map.is-closing .map__veil { animation-delay: 0s; }
    .map.is-open .honey__stream { animation: none; stroke-dashoffset: 0; }
    .map.is-open .honey__sheen { animation: none; }
  }
`,v={Team:{cells:[[0,1],[1,1]],pocket:[[0,0],[1,0]]},Project:{cells:[[3,1],[4,1],[5,1],[4,2]],pocket:[[3,0],[4,0],[5,0]]},Drylab:{cells:[[8,1],[9,1],[10,1]],pocket:[[8,0],[9,0],[10,0]]},Wetlab:{cells:[[0,4],[1,4],[2,4],[3,4],[0,5],[1,5],[2,5]],pocket:[[0,3],[1,3],[2,3]]},"Human Practices":{cells:[[6,4],[7,4],[8,4],[6,5],[7,5],[8,5]],pocket:[[6,3],[7,3],[8,3],[9,3]]}},w=12,k=7,j=[11,0],B=["#FEC341","#F5B827","#E5B144","#EDAA22","#D98E14"],Y=["#FFD65C","#FFCF45","#F9C640","#FFDA6B"],S=(t,i,e,r)=>t[Math.floor($(i,e,r)*t.length)],$=(t,i,e)=>{let r=Math.imul(t,374761393)+Math.imul(i,668265263)+Math.imul(e,2246822519)|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296},L=(t,i)=>{const e=t-(i-(i&1))/2;return[e,i,-e-i]},z=(t,i)=>{const e=L(...t),r=L(...i);return Math.max(Math.abs(e[0]-r[0]),Math.abs(e[1]-r[1]),Math.abs(e[2]-r[2]))},A=(t,i,e)=>Array.from({length:6},(r,o)=>{const c=Math.PI/180*(60*o+30);return`${(t+e*Math.cos(c)).toFixed(1)},${(i+e*Math.sin(c)).toFixed(1)}`}).join(" "),N=(t,i)=>{const e=[""];for(const r of t.split(" ")){const o=e[e.length-1];o&&(o+" "+r).length>i?e.push(r):e[e.length-1]=o?o+" "+r:r}return e},F=(t,i,e)=>(.04+z([t,i],e)*.032).toFixed(3)+"s",P=t=>t.split(" ").flatMap(i=>i.length>15?[i.slice(0,8)+"-",i.slice(8)]:[i]),R=(()=>{let t;return(i,e)=>(t||=document.createElement("canvas").getContext("2d"),t.font=`650 ${e}px 'Space Grotesk Variable', 'Space Grotesk', Inter, sans-serif`,t.measureText(i).width)})(),q=(t,i)=>{const e=Math.max(...t.flatMap(([,r])=>r.flatMap(([o])=>P(o).map(c=>R(c,100)))));return Math.min(.215*i,1.56*i*100/e)};function M(t,i,e,r,o={}){const c=Math.sqrt(3)*e,d=c*(t+(i&1)*.5)+c/2,n=1.5*e*i+e,m=F(t,i,o.seed||j);if(r==="wax"){const f=((.1+.14*$(t,i,2))*(o.fade??1)).toFixed(3),u=$(t,i,3)<.16;return`<g class="cell cell--wax${u?" is-wall":""}" style="--d:${m}"><polygon points="${A(d,n,e*.92)}" ${u?"stroke":"fill"}="${S(B,t,i,4)}" ${u?`stroke-opacity="${(+f+.18).toFixed(2)}"`:`fill-opacity="${f}"`}/></g>`}const[g,h]=o.page,l=h===o.current,a=o.fs,s=N(P(g).join(" "),11).slice(0,3),p=s.map((f,u)=>`<tspan x="${d.toFixed(1)}" dy="${u?"1.15em":`${(-(s.length-1)*.575).toFixed(2)}em`}">${f}</tspan>`).join("");let b="";if(l){const f=e*.92,u=x=>`${(d+f*Math.cos(Math.PI/180*x)).toFixed(1)} ${(n+f*Math.sin(Math.PI/180*x)).toFixed(1)}`,y=(3*f).toFixed(1),E=`M${u(270)}L${u(330)}L${u(30)}L${u(90)}`,_=`M${u(270)}L${u(210)}L${u(150)}L${u(90)}`,H=(e*.14).toFixed(1),C=(e*.045).toFixed(1),D=`${(f*.45).toFixed(1)} ${y}`;b=`<g class="honey" style="--L:${y}px;--d:${m}">${[E,_].map(x=>`<path class="honey__stream" d="${x}" stroke-width="${H}" stroke-dasharray="${y}" stroke-dashoffset="${y}"/>`).join("")}${[E,_].map(x=>`<path class="honey__sheen" d="${x}" stroke-width="${C}" stroke-dasharray="${D}" stroke-dashoffset="${y}"/>`).join("")}</g>`}return`<a class="cell cell--page${l?" cell--current":""}" href="/lambert-ga/${h}/" style="--d:${m}"${l?' aria-current="page"':""}><polygon points="${A(d,n,e*.92)}" fill="${S(Y,t,i,6)}"/><text x="${d.toFixed(1)}" y="${n.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="${a.toFixed(1)}">${p}</text>${b}</a>`}function V(t,i){const e=Math.max(40,Math.min(60,(innerWidth-96)/(w+.5)/Math.sqrt(3),(innerHeight-120)/(1.5*(k-1)+2))),r=Math.sqrt(3)*e,o=r*(w+.5),c=1.5*e*(k-1)+2*e,d=new Set,n=[];for(const a in v)v[a].cells.forEach(s=>{d.add(s.join()),n.push(s)}),v[a].pocket.forEach(s=>d.add(s.join()));const m=q(t,e);let g="",h="";for(let a=0;a<k;a++)for(let s=0;s<w;s++){if(d.has([s,a].join()))continue;const p=Math.min(...n.map(b=>z([s,a],b)));g+=M(s,a,e,"wax",{fade:[1,1,.62,.34,.16][Math.min(p,4)]})}for(const[a,s]of t)v[a].cells.forEach(([p,b],f)=>{if(!s[f])return;const u=M(p,b,e,"page",{page:s[f],current:i,fs:m});s[f][1]===i?h=u:g+=u});const l=t.map(([a])=>{const[s,p]=v[a].pocket[0];return`<h3 class="title" style="left:${(r*(s+(p&1)*.5)+r*.12).toFixed(1)}px;top:${(1.5*e*p+e).toFixed(1)}px;--ts:${(e*.58).toFixed(1)}px">${a}</h3>`}).join("");return`<div class="comb" style="--w:${o.toFixed(1)}px;--h:${c.toFixed(1)}px;--dmax:${F(0,k-1,j)}"><svg viewBox="0 0 ${o.toFixed(1)} ${c.toFixed(1)}"><g class="comb__cells">${g}${h}</g></svg>${l}</div>`}function Z(t,i){const e=Math.min(52,(innerWidth-36)/3.5/Math.sqrt(3)),r=Math.sqrt(3)*e,o=3,c=q(t,e);return`<div class="stack">${t.map(([d,n])=>{const m=Math.ceil(n.length/o),g=r*(o+.5),h=1.5*e*(m-1)+2*e,l=n.map((a,s)=>M(s%o,Math.floor(s/o),e,"page",{page:a,current:i,fs:c,seed:[o-1,0]})).join("");return`<section><h3 class="title" style="--ts:${(e*.56).toFixed(1)}px">${d}</h3><div class="comb" style="--w:${g.toFixed(1)}px;--h:${h.toFixed(1)}px;--dmax:${F(0,m-1,[o-1,0])}"><svg viewBox="0 0 ${g.toFixed(1)} ${h.toFixed(1)}"><g class="comb__cells">${l}</g></svg></div></section>`}).join("")}</div>`}function G(t,{sections:i,current:e,onToggle:r}){const o=document.createElement("div");o.className="map",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label","Project map"),o.innerHTML='<div class="map__veil"></div><div class="map__stage"></div>',t.append(o);const c=o.querySelector(".map__stage");let d=0;const n=()=>o.classList.contains("is-open"),m=()=>{c.innerHTML=innerWidth<=760?Z(i,e):V(i,e)},g=()=>{n()||(clearTimeout(d),m(),o.classList.remove("is-closing"),o.classList.add("is-open"),t.host.removeAttribute("data-dark"),r(!0),requestAnimationFrame(()=>(o.querySelector(".cell--current")||o.querySelector(".cell--page"))?.focus({preventScroll:!0})))},h=()=>{n()&&(o.classList.remove("is-open"),o.classList.add("is-closing"),r(!1),dispatchEvent(new Event("scroll")),d=setTimeout(()=>{o.classList.remove("is-closing"),c.innerHTML=""},640))};return o.addEventListener("keydown",l=>{if(l.key!=="Tab")return;const a=[...o.querySelectorAll(".cell--page")],s=a[0],p=a[a.length-1];l.shiftKey&&t.activeElement===s?(l.preventDefault(),p.focus()):!l.shiftKey&&t.activeElement===p&&(l.preventDefault(),s.focus())}),addEventListener("resize",()=>{n()&&m()}),{open:g,close:h,isOpen:n}}const K=`
  :host { position: fixed; inset: 0; z-index: 70; font-family: 'Space Grotesk Variable', 'Space Grotesk', 'Inter', sans-serif; color: #1a322a; pointer-events: none; }
  :host([data-dark]) { color: #fff9e9; }
  * { box-sizing: border-box; }
  :host([data-cursor-active]) * { cursor: none !important; }
  a { color: inherit; text-decoration: none; }
  button, summary { font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button { border: 0; }
  :is(a, button, summary):focus-visible { outline: 2px solid #fcc42f; outline-offset: 4px; }
  .bar { position: absolute; top: 26px; left: 50%; width: min(1320px, calc(100% - 80px)); padding-right: 56px; transform: translateX(-50%); display: flex; align-items: flex-start; justify-content: flex-end; gap: 24px; transition: transform .38s cubic-bezier(.23, 1, .32, 1), visibility .38s; }
  :host([data-hidden]) .bar { visibility: hidden; transform: translate(-50%, calc(-100% - 40px)); pointer-events: none; }
  .brand { pointer-events: auto; display: flex; align-items: center; height: 54px; margin-right: auto; border-radius: 12px; }
  .brand img { display: block; height: 58px; width: auto; filter: drop-shadow(0 2px 4px rgba(10, 36, 28, .18)); }
  .brand:hover img { transform: scale(1.04); transition: transform .16s; }
  .glass { position: relative; isolation: isolate; }
  .glass::before { content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: rgba(255, 253, 246, .5); border: 1px solid rgba(255, 255, 255, .78); box-shadow: 0 0 0 1px rgba(26, 50, 42, .06), inset 0 1px 0 rgba(255, 255, 255, .9), inset 0 -1px 0 rgba(26, 50, 42, .05), 0 1px 2px rgba(26, 50, 42, .04), 0 14px 34px rgba(26, 50, 42, .1); backdrop-filter: blur(18px) saturate(150%) brightness(1.04); -webkit-backdrop-filter: blur(18px) saturate(150%) brightness(1.04); }
  :host([data-dark]) .glass::before { background: rgba(17, 70, 57, .36); border-color: rgba(255, 248, 224, .34); box-shadow: 0 0 0 1px rgba(10, 36, 28, .14), inset 0 1px 0 rgba(255, 255, 255, .22), inset 0 -1px 0 rgba(0, 0, 0, .14), 0 14px 34px rgba(10, 36, 28, .2); backdrop-filter: blur(22px) saturate(140%) brightness(1.06); -webkit-backdrop-filter: blur(22px) saturate(140%) brightness(1.06); }
  @media (prefers-reduced-transparency: reduce) { .glass::before { background: #fffdf6; backdrop-filter: none; -webkit-backdrop-filter: none; } :host([data-dark]) .glass::before { background: #153f36; } }
  nav { pointer-events: auto; border-radius: 999px; padding: 7px; }
  .items { display: flex; align-items: center; gap: 2px; }
  .group { position: relative; }
  summary { list-style: none; }
  summary::-webkit-details-marker { display: none; }
  .group > summary, .solo { display: flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 15px; border-radius: 999px; font-size: 13px; font-weight: 650; letter-spacing: -.015em; white-space: nowrap; transition: background .18s, color .18s; }
  .group > summary::after { content: ''; width: 4px; height: 4px; margin-top: -3px; border-right: 1px solid currentColor; border-bottom: 1px solid currentColor; transform: rotate(45deg); opacity: .65; transition: transform .18s; }
  .group[open] > summary::after { transform: translateY(2px) rotate(225deg); }
  .group[open] > summary, .group > summary:hover, .solo:hover { background: rgba(26, 50, 42, .07); color: #2b4c2f; }
  :host([data-dark]) :is(.group[open] > summary, .group > summary:hover, .solo:hover) { background: rgba(255, 244, 204, .12); color: #ffda68; }
  .dropdown { position: absolute; top: calc(100% + 16px); left: 0; min-width: 218px; padding: 10px; border-radius: 21px; }
  .dropdown::before { background: rgba(255, 253, 246, .8); }
  :host([data-dark]) .dropdown::before { background: rgba(21, 63, 54, .82); }
  .group:nth-last-child(-n+3) .dropdown { left: auto; right: 0; }
  .dropdown a, .subgroup > summary { display: block; padding: 12px 13px; border-radius: 12px; font-size: 13px; font-weight: 550; line-height: 1.4; transition: background .16s, color .16s; }
  .dropdown a:hover, .dropdown a[aria-current='page'], .subgroup > summary:hover { background: rgba(26, 50, 42, .07); color: #2b4c2f; }
  :host([data-dark]) :is(.dropdown a:hover, .dropdown a[aria-current='page'], .subgroup > summary:hover) { background: rgba(255, 244, 204, .10); color: #ffda68; }
  .subgroup > summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .subgroup > summary::after { content: '+'; color: #a46b13; font-size: 17px; }
  :host([data-dark]) .subgroup > summary::after { color: #fcc42f; }
  .subgroup[open] > summary::after { content: '−'; }
  .subgroup > div { margin: 2px 0 5px 14px; padding-left: 7px; border-left: 1px solid #1a322a24; }
  .subgroup a { padding-block: 9px; }
  :host([data-dark]) .subgroup > div { border-color: #ffffff24; }
  .mobile-toggle { display: none; pointer-events: auto; align-items: center; gap: 10px; border-radius: 999px; min-height: 50px; padding: 0 18px; font-size: 13px; font-weight: 650; }
  .mobile-toggle svg { width: 18px; height: 18px; }
  .honey-toggle { position: absolute; top: 10px; right: 10px; z-index: 3; width: 72px; height: 78px; padding: 0; background: transparent; pointer-events: auto; border-radius: 12px; filter: drop-shadow(0 2px 2px #94611225); transition: transform .5s cubic-bezier(.7, 0, .84, 0), filter .4s; }
  .honey-toggle:hover { transform: translateY(-2px); }
  .honey-toggle svg { display: block; width: 100%; height: 100%; }
  :host([data-map-open]) .honey-toggle { transform: rotate(30deg); filter: drop-shadow(0 4px 14px rgba(254, 195, 65, .45)); transition: transform .3s cubic-bezier(.22, 1, .36, 1), filter .3s; }
  :host([data-map-open]) .honey-toggle:hover { transform: rotate(30deg) scale(1.06); }
  @media (max-width: 1100px) {
    .bar { top: 16px; width: calc(100% - 32px); padding-right: 72px; }
    .brand { height: 50px; } .brand img { height: 48px; }
    .mobile-toggle { display: flex; }
    nav.glass { display: none; position: absolute; top: 64px; right: 0; width: min(380px,100%); max-height: calc(100dvh - 98px); overflow-y: auto; border-radius: 24px; padding: 12px; }
    nav.glass::before { background: rgba(255,253,246,.94); }
    :host([data-dark]) nav.glass::before { background: rgba(21,63,54,.95); }
    .dropdown::before { display: none; }
    nav.expanded { display: block; }
    .items { display: block; }
    .group > summary, .solo { min-height: 48px; justify-content: space-between; font-size: 15px; border-radius: 13px; }
    .dropdown { position: static; min-width: 0; width: auto !important; margin: 4px 0 10px; padding: 4px 8px 4px 13px; border: 0; border-radius: 0; background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
    .dropdown a { padding-block: 11px; }
  }
  @media (max-width: 760px) { .bar { padding-right: 62px; } .honey-toggle { top: 8px; right: 6px; width: 56px; height: 62px; } }
  @media (prefers-reduced-motion: reduce) { *, *::after { transition: none !important; } }
  ${O}
`;typeof window<"u"&&!customElements.get("swarm-nav")&&customElements.define("swarm-nav",class extends HTMLElement{connectedCallback(){if(this.shadowRoot)return;const t=this.attachShadow({mode:"open"}),i=location.pathname.replace(/\/$/,"").split("/").pop(),e=a=>a.map(([s,p])=>Array.isArray(p)?`<details class="subgroup"><summary>${s}</summary><div>${e(p)}</div></details>`:`<a href="/lambert-ga/${p}/"${p===i?' aria-current="page"':""}>${s}</a>`).join("");t.innerHTML=`<style>${K}</style><div class="bar">
        <a class="brand" href="/lambert-ga/home/" aria-label="SWARM home"><img src="https://static.igem.wiki/teams/6185/wiki/homepage/logo.webp" alt="SWARM" width="1202" height="1354" decoding="async"></a>
        <button class="mobile-toggle glass" aria-expanded="false" aria-controls="wiki-links"><span>Menu</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
        <nav class="glass" id="wiki-links" aria-label="Main"><div class="items">
        ${T.map(([a,s])=>`<details class="group"><summary>${a}</summary><div class="dropdown glass">${e(s)}</div></details>`).join("")}
        </div></nav></div>
        <button class="honey-toggle" aria-label="Open the project map" aria-expanded="false" aria-haspopup="dialog" title="Project map"><svg viewBox="0 0 48 52" aria-hidden="true"><path d="m24 2 10 6v12l-10 6-10-6V8Z" fill="#ffd75c" stroke="#c58a1c" stroke-width="1.6"/><path d="m14 20 10 6v12l-10 6-10-6V26Z" fill="#fbc438" stroke="#c58a1c" stroke-width="1.6"/><path d="m34 20 10 6v12l-10 6-10-6V26Z" fill="#f4b324" stroke="#c58a1c" stroke-width="1.6"/><path d="m24 8 5 3v6l-5 3-5-3v-6Zm-10 18 5 3v6l-5 3-5-3v-6Zm20 0 5 3v6l-5 3-5-3v-6Z" fill="none" stroke="#fff1b3" stroke-width="1.4"/></svg></button>`;const r=t.querySelector("#wiki-links"),o=t.querySelector(".mobile-toggle"),c=t.querySelector(".bar"),d=t.querySelector(".honey-toggle"),n=()=>{t.querySelectorAll("details[open]").forEach(a=>a.open=!1),r.classList.remove("expanded"),o.setAttribute("aria-expanded","false")},m=G(t,{sections:I,current:i,onToggle:a=>{this.toggleAttribute("data-map-open",a),c.inert=a||this.hasAttribute("data-hidden"),d.setAttribute("aria-expanded",String(a)),d.setAttribute("aria-label",a?"Close the project map":"Open the project map"),a||d.focus({preventScroll:!0})}});d.addEventListener("click",()=>{m.isOpen()?m.close():(n(),m.open())}),o.addEventListener("click",()=>{const a=!r.classList.contains("expanded");n(),r.classList.toggle("expanded",a),o.setAttribute("aria-expanded",String(a))}),t.querySelectorAll(".group").forEach(a=>a.addEventListener("toggle",()=>{a.open&&t.querySelectorAll(".group").forEach(s=>{s!==a&&(s.open=!1)})})),t.addEventListener("keydown",a=>{if(a.key!=="Escape")return;if(m.isOpen()){m.close(),a.stopPropagation();return}const s=t.activeElement,p=s?.closest(".group");p?.open?(p.open=!1,p.querySelector("summary").focus()):(n(),o.focus()),a.stopPropagation()}),t.addEventListener("click",a=>{a.target.closest("a")&&n()}),this.dismiss=a=>{a.composedPath().includes(this)||n()},document.addEventListener("pointerdown",this.dismiss),this.dismissFocus=a=>{a.composedPath().includes(this)||n()},document.addEventListener("focusin",this.dismissFocus);const g=this.getAttribute("dark-over");let h=scrollY,l=!1;this.syncScroll=()=>{const a=scrollY,s=a-h;if(h=a,a<80?l=!1:s>6?l=!0:s<-6&&(l=!1),g){const b=document.querySelector(g);this.toggleAttribute("data-dark",!!b&&b.getBoundingClientRect().bottom>90)}if(this.hasAttribute("data-hidden")===l)return;this.toggleAttribute("data-hidden",l),c.inert=l||m.isOpen(),c.setAttribute("aria-hidden",String(l));const p=t.activeElement;n(),l&&c.contains(p)&&d.focus({preventScroll:!0}),this.dispatchEvent(new CustomEvent("swarm-nav-state",{detail:{hidden:l},bubbles:!0,composed:!0}))},addEventListener("scroll",this.syncScroll,{passive:!0}),this.syncScroll()}disconnectedCallback(){document.removeEventListener("pointerdown",this.dismiss),document.removeEventListener("focusin",this.dismissFocus),removeEventListener("scroll",this.syncScroll)}});function U({className:t}){return W.createElement("swarm-nav",{class:t})}export{U as default};
