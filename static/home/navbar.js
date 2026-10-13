import { groups, sections } from './nav-data.js?v=9fe18f639b5c';
import { mapStyles, mountMap } from './navmap.js?v=951a75de8fa3';
const styles = `
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
  ${mapStyles}
`;
if (typeof window !== 'undefined' && !customElements.get('swarm-nav')) {
  customElements.define('swarm-nav', class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root=this.attachShadow({mode:'open'});
      const slug=location.pathname.replace(/\/$/,'').split('/').pop();
      const links=items=>items.map(([title,destination])=>Array.isArray(destination)
        ? `<details class="subgroup"><summary>${title}</summary><div>${links(destination)}</div></details>`
        : `<a href="/lambert-ga/${destination}/"${destination===slug?' aria-current="page"':''}>${title}</a>`).join('');
      root.innerHTML=`<style>${styles}</style><div class="bar">
        <a class="brand" href="/lambert-ga/home/" aria-label="SWARM home"><img src="https://static.igem.wiki/teams/6185/wiki/homepage/logo.webp" alt="SWARM" width="1202" height="1354" decoding="async"></a>
        <button class="mobile-toggle glass" aria-expanded="false" aria-controls="wiki-links"><span>Menu</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
        <nav class="glass" id="wiki-links" aria-label="Main"><div class="items">
        ${groups.map(([title,items])=>`<details class="group"><summary>${title}</summary><div class="dropdown glass">${links(items)}</div></details>`).join('')}
        </div></nav></div>
        <button class="honey-toggle" aria-label="Open the project map" aria-expanded="false" aria-haspopup="dialog" title="Project map"><svg viewBox="0 0 48 52" aria-hidden="true"><path d="m24 2 10 6v12l-10 6-10-6V8Z" fill="#ffd75c" stroke="#c58a1c" stroke-width="1.6"/><path d="m14 20 10 6v12l-10 6-10-6V26Z" fill="#fbc438" stroke="#c58a1c" stroke-width="1.6"/><path d="m34 20 10 6v12l-10 6-10-6V26Z" fill="#f4b324" stroke="#c58a1c" stroke-width="1.6"/><path d="m24 8 5 3v6l-5 3-5-3v-6Zm-10 18 5 3v6l-5 3-5-3v-6Zm20 0 5 3v6l-5 3-5-3v-6Z" fill="none" stroke="#fff1b3" stroke-width="1.4"/></svg></button>`;
      const nav=root.querySelector('#wiki-links'), toggle=root.querySelector('.mobile-toggle'), bar=root.querySelector('.bar'), honeyToggle=root.querySelector('.honey-toggle');
      const close=()=>{
        root.querySelectorAll('details[open]').forEach(el=>el.open=false);
        nav.classList.remove('expanded');toggle.setAttribute('aria-expanded','false');
      };
      const map=mountMap(root,{sections,current:slug,onToggle:open=>{
        this.toggleAttribute('data-map-open',open);
        bar.inert=open||this.hasAttribute('data-hidden');
        honeyToggle.setAttribute('aria-expanded',String(open));
        honeyToggle.setAttribute('aria-label',open?'Close the project map':'Open the project map');
        if(!open)honeyToggle.focus({preventScroll:true});
      }});
      honeyToggle.addEventListener('click',()=>{if(map.isOpen())map.close();else{close();map.open();}});
      toggle.addEventListener('click',()=>{const open=!nav.classList.contains('expanded');close();nav.classList.toggle('expanded',open);toggle.setAttribute('aria-expanded',String(open));});
      root.querySelectorAll('.group').forEach(group=>group.addEventListener('toggle',()=>{if(group.open)root.querySelectorAll('.group').forEach(other=>{if(other!==group)other.open=false;});}));
      root.addEventListener('keydown',event=>{
        if(event.key!=='Escape')return;
        if(map.isOpen()){map.close();event.stopPropagation();return;}
        const active=root.activeElement, group=active?.closest('.group');
        if(group?.open){group.open=false;group.querySelector('summary').focus();}
        else{close();toggle.focus();}
        event.stopPropagation();
      });
      root.addEventListener('click',event=>{if(event.target.closest('a'))close();});
      this.dismiss=event=>{if(!event.composedPath().includes(this))close();};
      document.addEventListener('pointerdown',this.dismiss);
      this.dismissFocus=event=>{if(!event.composedPath().includes(this))close();};
      document.addEventListener('focusin',this.dismissFocus);
      const darkOver=this.getAttribute('dark-over');
      let lastY=scrollY, hidden=false;
      this.syncScroll=()=>{
        const y=scrollY, dy=y-lastY; lastY=y;
        if(y<80)hidden=false;else if(dy>6)hidden=true;else if(dy<-6)hidden=false;
        if(darkOver){const surface=document.querySelector(darkOver);this.toggleAttribute('data-dark',!!surface&&surface.getBoundingClientRect().bottom>90);}
        if(this.hasAttribute('data-hidden')===hidden)return;
        this.toggleAttribute('data-hidden',hidden);
        bar.inert=hidden||map.isOpen();bar.setAttribute('aria-hidden',String(hidden));
        const focused=root.activeElement;
        close();
        if(hidden&&bar.contains(focused))honeyToggle.focus({preventScroll:true});
        this.dispatchEvent(new CustomEvent('swarm-nav-state',{detail:{hidden},bubbles:true,composed:true}));
      };
      addEventListener('scroll',this.syncScroll,{passive:true});this.syncScroll();
    }
    disconnectedCallback() {
      document.removeEventListener('pointerdown',this.dismiss);
      document.removeEventListener('focusin',this.dismissFocus);
      removeEventListener('scroll',this.syncScroll);
    }
  });
}
