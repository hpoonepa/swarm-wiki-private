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
`,v={Team:{cells:[[0,1],[1,1]],pocket:[[0,0],[1,0]]},Project:{cells:[[3,1],[4,1],[5,1],[4,2]],pocket:[[3,0],[4,0],[5,0]]},Drylab:{cells:[[8,1],[9,1],[10,1]],pocket:[[8,0],[9,0],[10,0]]},Wetlab:{cells:[[0,4],[1,4],[2,4],[3,4],[0,5],[1,5],[2,5]],pocket:[[0,3],[1,3],[2,3]]},"Human Practices":{cells:[[6,4],[7,4],[8,4],[6,5],[7,5],[8,5]],pocket:[[6,3],[7,3],[8,3],[9,3]]}},w=12,k=7,j=[11,0],B=["#FEC341","#F5B827","#E5B144","#EDAA22","#D98E14"],Y=["#FFD65C","#FFCF45","#F9C640","#FFDA6B"],S=(e,a,t,r)=>e[Math.floor($(a,t,r)*e.length)],$=(e,a,t)=>{let r=Math.imul(e,374761393)+Math.imul(a,668265263)+Math.imul(t,2246822519)|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296},L=(e,a)=>{const t=e-(a-(a&1))/2;return[t,a,-t-a]},z=(e,a)=>{const t=L(...e),r=L(...a);return Math.max(Math.abs(t[0]-r[0]),Math.abs(t[1]-r[1]),Math.abs(t[2]-r[2]))},A=(e,a,t)=>Array.from({length:6},(r,o)=>{const d=Math.PI/180*(60*o+30);return`${(e+t*Math.cos(d)).toFixed(1)},${(a+t*Math.sin(d)).toFixed(1)}`}).join(" "),N=(e,a)=>{const t=[""];for(const r of e.split(" ")){const o=t[t.length-1];o&&(o+" "+r).length>a?t.push(r):t[t.length-1]=o?o+" "+r:r}return t},F=(e,a,t)=>(.04+z([e,a],t)*.032).toFixed(3)+"s",P=e=>e.split(" ").flatMap(a=>a.length>15?[a.slice(0,8)+"-",a.slice(8)]:[a]),R=(()=>{let e;return(a,t)=>(e||=document.createElement("canvas").getContext("2d"),e.font=`650 ${t}px 'Space Grotesk Variable', 'Space Grotesk', Inter, sans-serif`,e.measureText(a).width)})(),q=(e,a)=>{const t=Math.max(...e.flatMap(([,r])=>r.flatMap(([o])=>P(o).map(d=>R(d,100)))));return Math.min(.215*a,1.56*a*100/t)};function M(e,a,t,r,o={}){const d=Math.sqrt(3)*t,m=d*(e+(a&1)*.5)+d/2,p=1.5*t*a+t,h=F(e,a,o.seed||j);if(r==="wax"){const l=((.1+.14*$(e,a,2))*(o.fade??1)).toFixed(3),c=$(e,a,3)<.16;return`<g class="cell cell--wax${c?" is-wall":""}" style="--d:${h}"><polygon points="${A(m,p,t*.92)}" ${c?"stroke":"fill"}="${S(B,e,a,4)}" ${c?`stroke-opacity="${(+l+.18).toFixed(2)}"`:`fill-opacity="${l}"`}/></g>`}const[g,f]=o.page,b=f===o.current,n=o.fs,s=N(P(g).join(" "),11).slice(0,3),i=s.map((l,c)=>`<tspan x="${m.toFixed(1)}" dy="${c?"1.15em":`${(-(s.length-1)*.575).toFixed(2)}em`}">${l}</tspan>`).join("");let u="";if(b){const l=t*.92,c=x=>`${(m+l*Math.cos(Math.PI/180*x)).toFixed(1)} ${(p+l*Math.sin(Math.PI/180*x)).toFixed(1)}`,y=(3*l).toFixed(1),E=`M${c(270)}L${c(330)}L${c(30)}L${c(90)}`,_=`M${c(270)}L${c(210)}L${c(150)}L${c(90)}`,H=(t*.14).toFixed(1),C=(t*.045).toFixed(1),D=`${(l*.45).toFixed(1)} ${y}`;u=`<g class="honey" style="--L:${y}px;--d:${h}">${[E,_].map(x=>`<path class="honey__stream" d="${x}" stroke-width="${H}" stroke-dasharray="${y}" stroke-dashoffset="${y}"/>`).join("")}${[E,_].map(x=>`<path class="honey__sheen" d="${x}" stroke-width="${C}" stroke-dasharray="${D}" stroke-dashoffset="${y}"/>`).join("")}</g>`}return`<a class="cell cell--page${b?" cell--current":""}" href="/lambert-ga/${f}/" style="--d:${h}"${b?' aria-current="page"':""}><polygon points="${A(m,p,t*.92)}" fill="${S(Y,e,a,6)}"/><text x="${m.toFixed(1)}" y="${p.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="${n.toFixed(1)}">${i}</text>${u}</a>`}function V(e,a){const t=Math.max(40,Math.min(60,(innerWidth-96)/(w+.5)/Math.sqrt(3),(innerHeight-120)/(1.5*(k-1)+2))),r=Math.sqrt(3)*t,o=r*(w+.5),d=1.5*t*(k-1)+2*t,m=new Set,p=[];for(const n in v)v[n].cells.forEach(s=>{m.add(s.join()),p.push(s)}),v[n].pocket.forEach(s=>m.add(s.join()));const h=q(e,t);let g="",f="";for(let n=0;n<k;n++)for(let s=0;s<w;s++){if(m.has([s,n].join()))continue;const i=Math.min(...p.map(u=>z([s,n],u)));g+=M(s,n,t,"wax",{fade:[1,1,.62,.34,.16][Math.min(i,4)]})}for(const[n,s]of e)v[n].cells.forEach(([i,u],l)=>{if(!s[l])return;const c=M(i,u,t,"page",{page:s[l],current:a,fs:h});s[l][1]===a?f=c:g+=c});const b=e.map(([n])=>{const[s,i]=v[n].pocket[0];return`<h3 class="title" style="left:${(r*(s+(i&1)*.5)+r*.12).toFixed(1)}px;top:${(1.5*t*i+t).toFixed(1)}px;--ts:${(t*.58).toFixed(1)}px">${n}</h3>`}).join("");return`<div class="comb" style="--w:${o.toFixed(1)}px;--h:${d.toFixed(1)}px;--dmax:${F(0,k-1,j)}"><svg viewBox="0 0 ${o.toFixed(1)} ${d.toFixed(1)}"><g class="comb__cells">${g}${f}</g></svg>${b}</div>`}function Z(e,a){const t=Math.min(52,(innerWidth-36)/3.5/Math.sqrt(3)),r=Math.sqrt(3)*t,o=3,d=q(e,t);return`<div class="stack">${e.map(([m,p])=>{const h=Math.ceil(p.length/o),g=r*(o+.5),f=1.5*t*(h-1)+2*t,b=p.map((n,s)=>M(s%o,Math.floor(s/o),t,"page",{page:n,current:a,fs:d,seed:[o-1,0]})).join("");return`<section><h3 class="title" style="--ts:${(t*.56).toFixed(1)}px">${m}</h3><div class="comb" style="--w:${g.toFixed(1)}px;--h:${f.toFixed(1)}px;--dmax:${F(0,h-1,[o-1,0])}"><svg viewBox="0 0 ${g.toFixed(1)} ${f.toFixed(1)}"><g class="comb__cells">${b}</g></svg></div></section>`}).join("")}</div>`}function G(e,{sections:a,current:t,onToggle:r}){const o=document.createElement("div");o.className="map",o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.setAttribute("aria-label","Project map"),o.innerHTML='<div class="map__veil"></div><div class="map__stage"></div>',e.append(o);const d=o.querySelector(".map__stage");let m=0;const p=()=>o.classList.contains("is-open"),h=()=>{d.innerHTML=innerWidth<=760?Z(a,t):V(a,t)},g=()=>{p()||(clearTimeout(m),h(),o.classList.remove("is-closing"),o.classList.add("is-open"),e.host.removeAttribute("data-dark"),r(!0),requestAnimationFrame(()=>(o.querySelector(".cell--current")||o.querySelector(".cell--page"))?.focus({preventScroll:!0})))},f=()=>{p()&&(o.classList.remove("is-open"),o.classList.add("is-closing"),r(!1),dispatchEvent(new Event("scroll")),m=setTimeout(()=>{o.classList.remove("is-closing"),d.innerHTML=""},640))};return o.addEventListener("keydown",b=>{if(b.key!=="Tab")return;const n=[...o.querySelectorAll(".cell--page")],s=n[0],i=n[n.length-1];b.shiftKey&&e.activeElement===s?(b.preventDefault(),i.focus()):!b.shiftKey&&e.activeElement===i&&(b.preventDefault(),s.focus())}),addEventListener("resize",()=>{p()&&h()}),{open:g,close:f,isOpen:p}}const K=`
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
`;typeof window<"u"&&!customElements.get("swarm-nav")&&customElements.define("swarm-nav",class extends HTMLElement{connectedCallback(){if(this.shadowRoot)return;const e=this.attachShadow({mode:"open"}),a=location.pathname.replace(/\/$/,"").split("/").pop(),r=/^\/lambert-ga(?:\/home)?(?:\/index\.html)?\/?$/.test(location.pathname)?{src:"https://static.igem.wiki/teams/6185/wiki/homepage/logo.webp",width:1202,height:1354}:{src:"/lambert-ga/brand/swarm-logo.svg",width:488,height:550},o=i=>i.map(([u,l])=>Array.isArray(l)?`<details class="subgroup"><summary>${u}</summary><div>${o(l)}</div></details>`:`<a href="/lambert-ga/${l}/"${l===a?' aria-current="page"':""}>${u}</a>`).join("");e.innerHTML=`<style>${K}</style><div class="bar">
        <a class="brand" href="/lambert-ga/home/" aria-label="SWARM home"><img src="${r.src}" alt="SWARM" width="${r.width}" height="${r.height}" decoding="async"></a>
        <button class="mobile-toggle glass" aria-expanded="false" aria-controls="wiki-links"><span>Menu</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
        <nav class="glass" id="wiki-links" aria-label="Main"><div class="items">
        ${T.map(([i,u])=>`<details class="group"><summary>${i}</summary><div class="dropdown glass">${o(u)}</div></details>`).join("")}
        </div></nav></div>
        <button class="honey-toggle" aria-label="Open the project map" aria-expanded="false" aria-haspopup="dialog" title="Project map"><svg viewBox="0 0 48 52" aria-hidden="true"><path d="m24 2 10 6v12l-10 6-10-6V8Z" fill="#ffd75c" stroke="#c58a1c" stroke-width="1.6"/><path d="m14 20 10 6v12l-10 6-10-6V26Z" fill="#fbc438" stroke="#c58a1c" stroke-width="1.6"/><path d="m34 20 10 6v12l-10 6-10-6V26Z" fill="#f4b324" stroke="#c58a1c" stroke-width="1.6"/><path d="m24 8 5 3v6l-5 3-5-3v-6Zm-10 18 5 3v6l-5 3-5-3v-6Zm20 0 5 3v6l-5 3-5-3v-6Z" fill="none" stroke="#fff1b3" stroke-width="1.4"/></svg></button>`;const d=e.querySelector("#wiki-links"),m=e.querySelector(".mobile-toggle"),p=e.querySelector(".bar"),h=e.querySelector(".honey-toggle"),g=()=>{e.querySelectorAll("details[open]").forEach(i=>i.open=!1),d.classList.remove("expanded"),m.setAttribute("aria-expanded","false")},f=G(e,{sections:I,current:a,onToggle:i=>{this.toggleAttribute("data-map-open",i),p.inert=i||this.hasAttribute("data-hidden"),h.setAttribute("aria-expanded",String(i)),h.setAttribute("aria-label",i?"Close the project map":"Open the project map"),i||h.focus({preventScroll:!0})}});h.addEventListener("click",()=>{f.isOpen()?f.close():(g(),f.open())}),m.addEventListener("click",()=>{const i=!d.classList.contains("expanded");g(),d.classList.toggle("expanded",i),m.setAttribute("aria-expanded",String(i))}),e.querySelectorAll(".group").forEach(i=>i.addEventListener("toggle",()=>{i.open&&e.querySelectorAll(".group").forEach(u=>{u!==i&&(u.open=!1)})})),e.addEventListener("keydown",i=>{if(i.key!=="Escape")return;if(f.isOpen()){f.close(),i.stopPropagation();return}const u=e.activeElement,l=u?.closest(".group");l?.open?(l.open=!1,l.querySelector("summary").focus()):(g(),m.focus()),i.stopPropagation()}),e.addEventListener("click",i=>{i.target.closest("a")&&g()}),this.dismiss=i=>{i.composedPath().includes(this)||g()},document.addEventListener("pointerdown",this.dismiss),this.dismissFocus=i=>{i.composedPath().includes(this)||g()},document.addEventListener("focusin",this.dismissFocus);const b=this.getAttribute("dark-over");let n=scrollY,s=!1;this.syncScroll=()=>{const i=scrollY,u=i-n;if(n=i,i<80?s=!1:u>6?s=!0:u<-6&&(s=!1),b){const c=document.querySelector(b);this.toggleAttribute("data-dark",!!c&&c.getBoundingClientRect().bottom>90)}if(this.hasAttribute("data-hidden")===s)return;this.toggleAttribute("data-hidden",s),p.inert=s||f.isOpen(),p.setAttribute("aria-hidden",String(s));const l=e.activeElement;g(),s&&p.contains(l)&&h.focus({preventScroll:!0}),this.dispatchEvent(new CustomEvent("swarm-nav-state",{detail:{hidden:s},bubbles:!0,composed:!0}))},addEventListener("scroll",this.syncScroll,{passive:!0}),this.syncScroll()}disconnectedCallback(){document.removeEventListener("pointerdown",this.dismiss),document.removeEventListener("focusin",this.dismissFocus),removeEventListener("scroll",this.syncScroll)}});function U({className:e}){return W.createElement("swarm-nav",{class:e})}export{U as default};
