/* One smooth scroll coordinate drives the bee and its honey wake.
   Cubic tangents join continuously; the same bee settles onto the final flower. */
(() => {
  const clamp=n=>Math.max(0,Math.min(1,n));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=n=>{const t=clamp(n);return t*t*t*(t*(6*t-15)+10);};
  const layer=document.querySelector('.bee-flight');
  const svg=layer.querySelector('.bee-flight__trail');
  const track=svg.querySelector('.bee-flight__track');
  const strokes=[...svg.querySelectorAll('[data-honey-stroke]')];
  const reveal=svg.querySelector('.bee-flight__reveal');
  const bee=layer.querySelector('.bee-flight__bee');
  const art=bee.querySelector('.bee-flight__art');
  const earth=document.getElementById('honeycomb-earth');
  const rnaIntro=document.getElementById('rna-intro');
  const rna=document.getElementById('rnai');
  const together=document.getElementById('together');
  const landing=together.querySelector('.together-bee');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const protectedCopy=[...document.querySelectorAll('.geo-panel > *,.globe-location,.journey-copy > *,.journey-protein .mechanism-copy > *,.rna-intro h2,.rna-intro h3,.rna-intro p,.rna-intro a,.rna-layout .mechanism-copy > *,.rna-player__copy p,.rna-player__controls,.together-heading > *,.together-approach > *')].map(element=>{
    const group=document.createElementNS('http://www.w3.org/2000/svg','g');
    group.setAttribute('fill','black');
    const range=document.createRange();range.selectNodeContents(element);
    svg.querySelector('mask').append(group);return {element,group,range};
  });
  let width=1,height=1,start=0,landingStart=0,landingEnd=1,small=48,large=240;
  let keys=[],slopes=[],samples=[],length=1,shown=scrollY,frame=0,last=performance.now(),bank=0;

  fetch('assets/journey/bee.svg').then(r=>r.text()).then(text=>{
    const original=new DOMParser().parseFromString(text,'image/svg+xml').documentElement;
    if(original.localName==='svg') {
      original.setAttribute('aria-hidden','true');
      art.replaceChildren(document.importNode(original,true));
    }
  }).catch(()=>{});

  function pose(s) {
    s=Math.max(start,Math.min(landingEnd,s));
    let i=keys.findIndex(k=>k[0]>=s);i=i<=0?0:i-1;
    i=Math.min(i,keys.length-2);
    const a=keys[i],b=keys[i+1],span=b[0]-a[0],t=clamp((s-a[0])/span);
    const value=k=>(2*t*t*t-3*t*t+1)*a[k]+(t*t*t-2*t*t+t)*span*slopes[i][k-1]+(-2*t*t*t+3*t*t)*b[k]+(t*t*t-t*t)*span*slopes[i+1][k-1];
    const landingT=ease((s-landingStart)/(landingEnd-landingStart));
    const grow=ease(((s-landingStart)/(landingEnd-landingStart)-.68)/.32);
    return {x:value(1)*width,screenY:value(2)*height,y:s+value(2)*height,size:mix(small,large,grow),landingT};
  }
  function measure() {
    width=document.documentElement.clientWidth;height=innerHeight;
    const mobile=width<=760;
    small=mobile?34:Math.min(67,Math.max(56,width*.051));large=landing.offsetWidth;
    bee.style.width=`${small}px`;
    start=document.querySelector('.hero').offsetHeight-height*.18;
    const e=earth.offsetTop,el=earth.offsetHeight-height,r=rna.offsetTop,rl=rna.offsetHeight-height;
    landingStart=together.offsetTop-height*.80;landingEnd=together.offsetTop+height*.43;
    const dest=landing.getBoundingClientRect(),stage=together.querySelector('.stage').getBoundingClientRect();
    const lx=(dest.left+dest.width/2)/width,ly=(dest.top-stage.top+dest.height/2)/height;
    const intro=e-start;
    // Screen height can rise between sections while document height keeps moving
    // downward. This lets the bee use the middle of each scene, not the bottom edge.
    keys=[
      [start,.90,.28],[start+intro*.28,.75,.39],[start+intro*.64,.93,.47],[e,.84,.41],
      [e+el*.045,.95,.46],[e+el*.09,.83,.55],[e+el*.14,.94,.48],
      [e+el*.19,.81,.38],[e+el*.24,.95,.46],[e+el*.29,.83,.56],
      [e+el*.34,.70,.51],[e+el*.39,.55,.43],[e+el*.44,.47,.50],
      [e+el*.49,.55,.59],[e+el*.54,.45,.55],[e+el*.59,.53,.43],
      [e+el*.64,.46,.36],[e+el*.69,.54,.43],[e+el*.74,.44,.54],
      [e+el*.79,.53,.59],[e+el*.84,.44,.49],[e+el*.89,.54,.39],
      [e+el*.94,.67,.44],
      [rnaIntro.offsetTop,.955,.42],[rnaIntro.offsetTop+rnaIntro.offsetHeight*.50,.955,.50],[r,.90,.50],
      [r+rl*.10,.81,.40],[r+rl*.21,.94,.46],[r+rl*.32,.84,.58],
      [r+rl*.43,.95,.53],[r+rl*.54,.83,.40],[r+rl*.65,.94,.46],
      [r+rl*.76,.85,.59],[r+rl*.87,.94,.55],[landingStart,.89,.47]
    ];
    if(mobile) keys=keys.map((k,i)=>{
      const y=k[0]>=r?mix(.47,.61,ease((k[2]-.36)/.23)):Math.max(.38,Math.min(.58,k[2]));
      const besideProject=k[0]>=e+el*.49&&k[0]<e+el*.71;
      return [k[0],i<8?mix(.87,.94,i%2):Math.max(.82,Math.min(.94,k[1])),besideProject?Math.max(.54,y):y];
    });
    const span=landingEnd-landingStart;
    // Stay small outside the entering headline, then turn into the flower's gap.
    keys.push([landingStart+span*.35,mobile?.93:.95,.37],
      [landingStart+span*.60,.90,.34],
      [landingStart+span*.76,lx+.035,mobile?ly-.09:.40],
      [landingStart+span*.90,lx,ly-.05],[landingEnd,lx,ly]);
    // Monotone Hermite slopes give smooth turns without overshooting the gutters.
    slopes=keys.map((key,i)=>[1,2].map(k=>{
      if(i===0||i===keys.length-1)return 0;
      const before=(key[k]-keys[i-1][k])/(key[0]-keys[i-1][0]);
      const after=(keys[i+1][k]-key[k])/(keys[i+1][0]-key[0]);
      return before*after<=0?0:2*before*after/(before+after);
    }));
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const mask=svg.querySelector('mask');
    mask.setAttribute('x','-20');mask.setAttribute('y','0');
    mask.setAttribute('width',String(width+40));mask.setAttribute('height',String(landingEnd+height*2));
    // Draw the exact same cubic curves used by pose(), with continuous tangents.
    let d=`M${keys[0][1]*width} ${keys[0][0]+keys[0][2]*height}`;
    for(let i=0;i<keys.length-1;i++) {
      const a=keys[i],b=keys[i+1],dt=(b[0]-a[0])/3;
      d+=` C${(a[1]+slopes[i][0]*dt)*width} ${a[0]+a[2]*height+dt*(1+slopes[i][1]*height)} ${
        (b[1]-slopes[i+1][0]*dt)*width} ${b[0]+b[2]*height-dt*(1+slopes[i+1][1]*height)} ${b[1]*width} ${b[0]+b[2]*height}`;
    }
    strokes.forEach(path=>path.setAttribute('d',d));reveal.setAttribute('d',d);
    samples=[];length=0;
    const count=Math.ceil((landingEnd-start)/8);
    for(let i=0;i<=count;i++) {
      const s=mix(start,landingEnd,i/count),p=pose(s),prev=samples[i-1];
      if(prev)length+=Math.hypot(p.x-prev.x,p.y-prev.y);
      samples.push({...p,distance:length});
    }
    paint(0);kick();
  }
  function distanceAt(s) {
    const p=clamp((s-start)/(landingEnd-start))*(samples.length-1);
    const i=Math.min(samples.length-2,Math.floor(p));
    return mix(samples[i].distance,samples[i+1].distance,p-i);
  }
  function paint(dt) {
    const p=pose(shown),settled=shown>=landingEnd-.1;
    layer.dataset.visible=String(shown>=start-height*.05&&!reduced.matches);
    track.setAttribute('transform',`translate(0 ${-shown})`);
    const drawn=Math.max(0,distanceAt(shown)-Math.max(34,p.size*.72));
    reveal.style.strokeDasharray=`${drawn} ${length+1}`;
    for(const {element,group,range} of protectedCopy) {
      const b=element.getBoundingClientRect();
      const hidden=Number(getComputedStyle(element).opacity)<.05||element.closest('[inert],[aria-hidden="true"]:not(.globe-location)');
      const visible=b.bottom>0&&b.top<height&&!hidden;
      if(visible)range.selectNodeContents(element);
      const boxes=visible?(element.classList.contains('rna-player__controls')?[b]:[...range.getClientRects()]):[];
      while(group.children.length<boxes.length)group.append(document.createElementNS('http://www.w3.org/2000/svg','rect'));
      [...group.children].forEach((rect,i)=>{
        const box=boxes[i];rect.setAttribute('width',box?String(box.width+16):'0');
        if(box) {
          rect.setAttribute('x',String(box.left-8));rect.setAttribute('y',String(box.top+shown-8));
          rect.setAttribute('height',String(box.height+16));rect.setAttribute('rx','8');
        }
      });
    }
    let x=p.x,y=p.screenY,size=p.size;
    if(settled) {
      const target=landing.getBoundingClientRect();
      x=target.left+target.width/2;y=target.top+target.height/2;size=target.width;
    }
    const next=pose(Math.min(landingEnd,shown+20));
    const targetBank=settled?0:Math.max(-11,Math.min(11,(next.x-p.x)*.55))*(1-p.landingT);
    bank=mix(bank,targetBank,1-Math.exp(-dt*9));
    // No sprite flipping, vertical buzzing, or sudden changes of image width.
    bee.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${bank}deg) scale(${size/small})`;
    bee.dataset.flying=String(!settled&&shown>=start);
    layer.dataset.drawn=(drawn/length).toFixed(4);
    layer.dataset.scroll=shown.toFixed(1);
    layer.dataset.landing=p.landingT.toFixed(4);
    together.dataset.arrived=String(settled||reduced.matches);
  }
  function tick(now) {
    frame=0;if(document.hidden)return;
    const dt=Math.min(.05,(now-last)/1000);last=now;
    shown=reduced.matches?scrollY:mix(shown,scrollY,1-Math.exp(-dt*10));
    if(Math.abs(shown-scrollY)<.1)shown=scrollY;
    paint(dt);
    if(shown!==scrollY||Math.abs(bank)>.1&&shown>=landingEnd)frame=requestAnimationFrame(tick);
  }
  function kick() {if(!frame&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
  addEventListener('scroll',kick,{passive:true});addEventListener('resize',measure);
  addEventListener('swarm-ready',()=>{shown=scrollY;measure();});
  document.addEventListener('visibilitychange',kick);reduced.addEventListener('change',measure);
  measure();
})();
