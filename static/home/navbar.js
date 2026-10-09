/* Shared navigation for the static SWARM story and the wiki's React layouts. */
const groups = [
  ['Team', [['Team', 'team'], ['Attributions', 'attributions']]],
  ['Project', [['Description', 'description'], ['Contribution', 'contribution'], ['Engineering', 'engineering'], ['Implementation', 'implementation']]],
  ['Wetlab', [['Diagnostics', [['Overview', 'diagnosticsoverview'], ['PDL', 'diagnostics-pdl'], ['RPA', 'diagnostics-rpa'], ['CRISPR-Cas12a', 'diagnostics-cas12']]], ['Therapeutics', [['Overview', 'therapeutics-overview'], ['CRISPRi', 'therapeutics-crispri'], ['LNPs', 'therapeutics-lnps']]], ['Parts library', 'parts-library'], ['Experiments', 'experiments'], ['Notebook', 'notebook'], ['Results', 'results']]],
  ['Drylab', [['Software', 'software'], ['Model', 'model'], ['Hardware', 'hardware']]],
  ['Human Practices', [['Integrated human practices', 'human-practices'], ['Education', 'education'], ['Entrepreneurship', 'hp-entre'], ['Safety', 'safety']]],
];
const story = [['Home', 'top'], ['Why bees matter', 'statement'], ['Worldwide', 'earth'], ['United States', 'usa'], ['Why colony loss?', 'atlanta'], ['Deformed wing virus', 'dwv'], ['What happens to the bee', 'bee-comparison'], ['Introducing SWARM', 'hive'], ['The bee', 'bee'], ['Minibinders', 'minibinders'], ['Why RNAi?', 'rna-intro'], ['RNAi mechanism', 'rnai'], ['Together', 'together'], ['Explore SWARM', 'explore']];
const styles = `
  :host { position: fixed; top: 26px; left: 50%; transform: translateX(-50%); width: min(1320px, calc(100% - 80px)); z-index: 70; font-family: 'Inter', 'Inter Variable', sans-serif; color: #fff9e9; pointer-events: none; }
  * { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
  button, summary { font: inherit; color: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button { border: 0; }
  :is(a, button, summary):focus-visible { outline: 2px solid #fcc42f; outline-offset: 4px; }
  .bar { display: flex; align-items: flex-start; justify-content: flex-end; gap: 24px; }
  .glass { background: rgba(21, 63, 54, .84); border: 1px solid rgba(255, 248, 224, .22); box-shadow: 0 8px 28px rgba(10, 36, 28, .10), inset 0 1px 0 rgba(255,255,255,.06); backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%); }
  nav { pointer-events: auto; border-radius: 999px; padding: 7px; }
  .items { display: flex; align-items: center; gap: 2px; }
  .group { position: relative; }
  summary { list-style: none; }
  summary::-webkit-details-marker { display: none; }
  .group > summary, .solo { display: flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 15px; border-radius: 999px; font-size: 13px; font-weight: 650; letter-spacing: -.015em; white-space: nowrap; transition: background .18s, color .18s; }
  .group > summary::after { content: ''; width: 4px; height: 4px; margin-top: -3px; border-right: 1px solid currentColor; border-bottom: 1px solid currentColor; transform: rotate(45deg); opacity: .65; transition: transform .18s; }
  .group[open] > summary::after { transform: translateY(2px) rotate(225deg); }
  .group[open] > summary, .group > summary:hover, .solo:hover { background: rgba(255, 244, 204, .12); color: #ffda68; }
  .dropdown { position: absolute; top: calc(100% + 16px); left: 0; min-width: 218px; padding: 10px; border-radius: 21px; background: rgba(21, 63, 54, .94); }
  .group:nth-last-child(-n+3) .dropdown { left: auto; right: 0; }
  .dropdown a, .subgroup > summary { display: block; padding: 12px 13px; border-radius: 12px; font-size: 13px; font-weight: 550; line-height: 1.4; transition: background .16s, color .16s; }
  .dropdown a:hover, .dropdown a[aria-current='page'], .subgroup > summary:hover { background: rgba(255, 244, 204, .10); color: #ffda68; }
  .subgroup > summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .subgroup > summary::after { content: '+'; color: #fcc42f; font-size: 17px; }
  .subgroup[open] > summary::after { content: '−'; }
  .subgroup > div { margin: 2px 0 5px 14px; padding-left: 7px; border-left: 1px solid #ffffff24; }
  .subgroup a { padding-block: 9px; }
  .story-group { margin-left: 4px; border-left: 1px solid #ffffff24; padding-left: 5px; }
  .story-group > summary { gap: 7px; padding-inline: 12px; }
  .story-group svg { width: 15px; height: 15px; }
  .story-group .dropdown { width: 400px; }
  .story-links { display: grid; grid-template-columns: 1fr 1fr; }
  .story-links a { font-size: 12px; }
  .mobile-toggle { display: none; pointer-events: auto; align-items: center; gap: 10px; border-radius: 999px; min-height: 50px; padding: 0 18px; font-size: 13px; font-weight: 650; }
  .mobile-toggle svg { width: 18px; height: 18px; }
  @media (max-width: 1100px) {
    :host { top: 16px; width: calc(100% - 32px); }
    .mobile-toggle { display: flex; }
    nav { display: none; position: absolute; top: 64px; right: 0; width: min(380px,100%); max-height: calc(100dvh - 98px); overflow-y: auto; border-radius: 24px; padding: 12px; background: rgba(21,63,54,.95); }
    nav.expanded { display: block; }
    .items { display: block; }
    .group > summary, .solo { min-height: 48px; justify-content: space-between; font-size: 15px; border-radius: 13px; }
    .dropdown { position: static; min-width: 0; width: auto !important; margin: 4px 0 10px; padding: 4px 8px 4px 13px; border: 0; border-radius: 0; background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
    .dropdown a { padding-block: 11px; }
    .story-group { margin: 6px 0 0; padding: 6px 0 0; border-left: 0; border-top: 1px solid #ffffff24; }
    .story-group > summary { justify-content: flex-start; }
    .story-group > summary::after { margin-left: auto; }
  }
  :host([story]) { inset: 0; width: auto; transform: none; }
  :host([story]) .bar { position: absolute; top: 26px; left: 50%; width: min(1320px,calc(100% - 80px)); padding-right: 28px; transform: translateX(-50%); transition: opacity .22s,transform .22s,visibility .22s; }
  :host([story][data-scrolled]) .bar { opacity: 0; visibility: hidden; transform: translate(-50%,-14px); pointer-events: none; }
  .honey-toggle { position: absolute; top: 10px; right: 10px; width: 72px; height: 78px; padding: 0; background: transparent; pointer-events: auto; border-radius: 12px; filter: drop-shadow(0 2px 2px #94611225); transition: transform .2s; }
  .honey-toggle:hover { transform: translateY(-2px); }
  .honey-toggle[aria-expanded='true'] { filter: drop-shadow(0 2px 5px #94611255); }
  .honey-toggle svg { display: block; width: 100%; height: 100%; }
  .honey-panel[hidden] { display: none; }
  .honey-panel { position: absolute; top: 90px; right: 94px; width: min(420px,calc(100vw - 112px)); max-height: calc(100dvh - 112px); overflow-y: auto; overscroll-behavior: contain; pointer-events: auto; padding: 20px; border: 1px solid #e4c76c; border-radius: 18px; background: #fffdf6; box-shadow: 0 12px 38px #153f3624; color: #153f36; }
  .honey-panel__heading { display: flex; align-items: center; justify-content: space-between; padding: 0 0 12px; border-bottom: 1px solid #e7ddbb; }
  .honey-panel__heading > a { font-size: 23px; font-weight: 800; letter-spacing: -.04em; }
  .honey-close { display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border-radius: 50%; color: #153f36; background: #f6edce; font-size: 25px; }
  .honey-panel nav { display: block; position: static; width: auto; max-height: none; overflow: visible; padding: 9px 0 0; background: transparent; border-radius: 0; }
  .honey-group > summary { display: flex; align-items: center; justify-content: space-between; padding: 13px 5px; font-size: 15px; font-weight: 650; }
  .honey-group > summary::after { content: '+'; color: #a46b13; font-size: 20px; line-height: 1; }
  .honey-group[open] > summary::after { content: '−'; }
  .honey-group + .honey-group { border-top: 1px solid #eee6cc; }
  .honey-group > div { padding: 0 0 8px 8px; }
  .honey-panel nav a,.honey-panel .subgroup > summary { display: block; padding: 10px; font-size: 13px; line-height: 1.4; border-radius: 8px; }
  .honey-panel nav a:hover,.honey-panel nav a[aria-current='page'],.honey-panel .subgroup > summary:hover { color: #724612; background: #f7edcb; }
  .honey-panel .subgroup > summary { display: flex; }
  .honey-panel .subgroup > summary::after { color: #a46b13; }
  .honey-panel .subgroup > div { border-color: #e7d49e; }
  .honey-panel .honey-awards { font-size: 15px; font-weight: 650; padding: 13px 5px; border-top: 1px solid #eee6cc; border-radius: 0; }
  @media(max-width:1100px) { :host([story]) .bar { top: 16px; width: calc(100% - 32px); padding-right: 72px; } }
  @media(max-width:760px) { .honey-toggle { top: 8px; right: 6px; width: 56px; height: 62px; } .honey-panel { top: 78px; right: 70px; width: calc(100vw - 84px); padding: 16px; max-height: calc(100dvh - 94px); } }
  @media (prefers-reduced-motion: reduce) { *, *::after { transition: none !important; } }
`;
if (typeof window !== 'undefined' && !customElements.get('swarm-nav')) {
  customElements.define('swarm-nav', class extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root=this.attachShadow({mode:'open'});
      const links=items=>items.map(([title,destination])=>Array.isArray(destination)
        ? `<details class="subgroup"><summary>${title}</summary><div>${links(destination)}</div></details>`
        : `<a href="/lambert-ga/${destination}/"${location.pathname.replace(/\/$/,'')===`/lambert-ga/${destination}`?' aria-current="page"':''}>${title}</a>`).join('');
      root.innerHTML=`<style>${styles}</style><div class="bar">
        <button class="mobile-toggle glass" aria-expanded="false" aria-controls="wiki-links"><span>Menu</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
        <nav class="glass" id="wiki-links" aria-label="Main"><div class="items">
        ${groups.map(([title,items])=>`<details class="group"><summary>${title}</summary><div class="dropdown glass">${links(items)}</div></details>`).join('')}
        <a class="solo" href="/lambert-ga/awards/">Awards</a>
        ${this.hasAttribute('story')?`<details class="group story-group"><summary aria-label="Story sections"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 4h9M5 8h9M5 12h9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M1.5 4h.1M1.5 8h.1M1.5 12h.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Story</summary><div class="dropdown glass story-links">${story.map(([title,key])=>`<a href="#${key}" data-go="${key}">${title}</a>`).join('')}</div></details>`:''}
        </div></nav></div>
        ${this.hasAttribute('story')?`<button class="honey-toggle" aria-label="Open honeycomb navigation" aria-expanded="false" aria-controls="honey-pages" title="Explore the wiki"><svg viewBox="0 0 48 52" aria-hidden="true"><path d="m24 2 10 6v12l-10 6-10-6V8Z" fill="#ffd75c" stroke="#c58a1c" stroke-width="1.6"/><path d="m14 20 10 6v12l-10 6-10-6V26Z" fill="#fbc438" stroke="#c58a1c" stroke-width="1.6"/><path d="m34 20 10 6v12l-10 6-10-6V26Z" fill="#f4b324" stroke="#c58a1c" stroke-width="1.6"/><path d="m24 8 5 3v6l-5 3-5-3v-6Zm-10 18 5 3v6l-5 3-5-3v-6Zm20 0 5 3v6l-5 3-5-3v-6Z" fill="none" stroke="#fff1b3" stroke-width="1.4"/></svg></button>
        <div class="honey-panel" id="honey-pages" hidden>
          <div class="honey-panel__heading"><a href="/lambert-ga/home/">SWARM</a><button class="honey-close" aria-label="Close navigation">×</button></div>
          <nav aria-label="Wiki pages">
            ${groups.map(([title,items])=>`<details class="honey-group"><summary>${title}</summary><div>${links(items)}</div></details>`).join('')}
            <a class="honey-awards" href="/lambert-ga/awards/">Awards</a>
            <details class="honey-group"><summary>On this page</summary><div class="story-links">${story.map(([title,key])=>`<a href="#${key}" data-go="${key}">${title}</a>`).join('')}</div></details>
          </nav>
        </div>`:''}`;
      const nav=root.querySelector('#wiki-links'), toggle=root.querySelector('.mobile-toggle');
      const honeyToggle=root.querySelector('.honey-toggle'), honeyPanel=root.querySelector('.honey-panel');
      const close=()=>{
        root.querySelectorAll('details[open]').forEach(el=>el.open=false);
        nav.classList.remove('expanded');toggle.setAttribute('aria-expanded','false');
        if(honeyPanel){honeyPanel.hidden=true;honeyToggle.setAttribute('aria-expanded','false');honeyToggle.setAttribute('aria-label','Open honeycomb navigation');}
      };
      honeyToggle?.addEventListener('click',()=>{
        const open=honeyPanel.hidden;close();honeyPanel.hidden=!open;
        honeyToggle.setAttribute('aria-expanded',String(open));
        honeyToggle.setAttribute('aria-label',open?'Close honeycomb navigation':'Open honeycomb navigation');
      });
      root.querySelector('.honey-close')?.addEventListener('click',()=>{close();honeyToggle.focus({preventScroll:true});});
      toggle.addEventListener('click',()=>{const open=!nav.classList.contains('expanded');close();nav.classList.toggle('expanded',open);toggle.setAttribute('aria-expanded',String(open));});
      root.querySelectorAll('.group').forEach(group=>group.addEventListener('toggle',()=>{if(group.open)root.querySelectorAll('.group').forEach(other=>{if(other!==group)other.open=false;});}));
      root.addEventListener('keydown',event=>{
        if(event.key!=='Escape')return;
        if(honeyPanel&&!honeyPanel.hidden){close();honeyToggle.focus({preventScroll:true});event.stopPropagation();return;}
        const active=root.activeElement, group=active?.closest('.group');
        if(group?.open){group.open=false;group.querySelector('summary').focus();}
        else{close();toggle.focus();}
        event.stopPropagation();
      });
      root.addEventListener('click',event=>{
        const link=event.target.closest('a');
        if(!link)return;
        if(link.dataset.go){event.preventDefault();this.dispatchEvent(new CustomEvent('swarm-navigate',{detail:link.dataset.go,bubbles:true,composed:true}));}
        close();
      });
      this.dismiss=event=>{if(!event.composedPath().includes(this))close();};
      document.addEventListener('pointerdown',this.dismiss);
      this.dismissFocus=event=>{if(!event.composedPath().includes(this))close();};
      document.addEventListener('focusin',this.dismissFocus);
      if(this.hasAttribute('story')){
        const bar=root.querySelector('.bar');
        this.syncScroll=()=>{
          const scrolled=scrollY>80;
          if(this.hasAttribute('data-scrolled')===scrolled)return;
          this.toggleAttribute('data-scrolled',scrolled);
          bar.inert=scrolled;bar.setAttribute('aria-hidden',String(scrolled));
          if(scrolled&&bar.contains(root.activeElement)){close();honeyToggle.focus({preventScroll:true});}
        };
        addEventListener('scroll',this.syncScroll,{passive:true});this.syncScroll();
      }
    }
    disconnectedCallback() {
      document.removeEventListener('pointerdown',this.dismiss);
      document.removeEventListener('focusin',this.dismissFocus);
      if(this.syncScroll)removeEventListener('scroll',this.syncScroll);
    }
  });
}
