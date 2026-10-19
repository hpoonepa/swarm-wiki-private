/**
 * Molecular illustration and scroll composition adapted from Denmark-GA iGEM 2026.
 * Source: https://gitlab.igem.org/2026/denmark-ga/-/blob/dc4433b64faf5b2edc50ee04191403abf611eb85/static/home-v2.js
 * CC BY 4.0: https://creativecommons.org/licenses/by/4.0/
 * Changes: Swarm's existing coordinates, palette, scroll integration, accessible
 * disclosure cards, demand-driven rendering, responsive framing and SVG fallback.
 * Display geometry only. This code does not predict or modify a protein structure.
 */
import * as T from 'three';

const clamp = n => Math.max(0, Math.min(1, n));
const ramp = (p, a, b) => clamp((p - a) / (b - a));
const ease = n => { const t = clamp(n); return t * t * (3 - 2 * t); };
const TARGET = '#56834b';
const PALETTE = ['#f6c644', '#f0b62d', '#f8d66c'];
const SVG = 'http://www.w3.org/2000/svg';

// Four solid pigment bands: a deeper shade follows the underside of each curve.
// The saved molecular coordinates stay untouched.
function paperMaterial(color, leaf=false) {
  return new T.ShaderMaterial({
    uniforms: {
      pigment: {value:new T.Color(color)},
      shade: {value:new T.Color(leaf?'#3e663d':'#d99830')},
      deepShade: {value:new T.Color(leaf?'#2f5535':'#b97b23')},
      highlight: {value:new T.Color(leaf?'#84aa5e':'#ffe69b')},
      uOpacity: {value:1}
    },
    vertexShader: `
      varying vec3 vPaperNormal;
      varying vec3 vPaperPosition;
      varying vec3 vPaperColor;
      void main() {
        vec3 p=position,n=normal;
        vPaperPosition=position;
        vPaperColor=vec3(1.0);
        #ifdef USE_INSTANCING
          p=(instanceMatrix*vec4(p,1.0)).xyz;
          n=mat3(instanceMatrix)*n;
        #endif
        #ifdef USE_INSTANCING_COLOR
          vPaperColor=instanceColor;
        #endif
        vPaperNormal=normalize(normalMatrix*n);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 pigment,shade,deepShade,highlight;
      uniform float uOpacity;
      varying vec3 vPaperNormal;
      varying vec3 vPaperPosition;
      varying vec3 vPaperColor;
      void main() {
        vec3 n=normalize(vPaperNormal);
        float light=dot(n,normalize(vec3(-.48,.68,.56)));
        float edge=.045*sin(vPaperPosition.x*2.4+vPaperPosition.y*1.7);
        float darkPatch=1.0-smoothstep(-.27,-.24,light+edge);
        float palePatch=smoothstep(.88,.91,light+edge);
        vec3 color=mix(pigment*vPaperColor,shade,darkPatch);
        color=mix(color,highlight,palePatch);
        // A fourth flat pigment sits below the existing shadow. Its boundary
        // follows the same curved surface, so the shape gains definition
        // without a drawn contour around its silhouette.
        float deepPatch=1.0-smoothstep(-.57,-.54,light+edge);
        color=mix(color,deepShade,deepPatch);
        gl_FragColor=vec4(color,uOpacity);
        #include <colorspace_fragment>
      }
    `
  });
}

function principal(points) {
  const m = [[0,0,0], [0,0,0], [0,0,0]];
  for (const v of points) {
    const a = v.toArray();
    for (let i=0; i<3; i++) for (let j=0; j<3; j++) m[i][j] += a[i]*a[j];
  }
  const top = matrix => {
    const v = new T.Vector3(.8,.5,.3).normalize();
    let lam = 1;
    for (let k=0; k<80; k++) {
      const a = v.toArray();
      v.set(...matrix.map(row => row.reduce((sum, n, i) => sum+n*a[i], 0)));
      lam = v.length() || 1; v.multiplyScalar(1/lam);
    }
    return {v,lam};
  };
  const a=top(m), av=a.v.toArray();
  const b=top(m.map((row,i)=>row.map((n,j)=>n-a.lam*av[i]*av[j])));
  b.v.sub(a.v.clone().multiplyScalar(a.v.dot(b.v))).normalize();
  if (points[0].dot(a.v)>points.at(-1).dot(a.v)) {a.v.negate(); b.v.negate();}
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(a.v,b.v,new T.Vector3().crossVectors(a.v,b.v)).transpose());
}

function backbone(pdb) {
  const chains = {A:[], B:[]};
  for (const line of pdb.split('\n')) {
    if (!line.startsWith('ATOM') || line.slice(12,16).trim()!=='CA') continue;
    const chain=line[21];
    if (!chains[chain] || ![' ','A'].includes(line[16])) continue;
    const xyz=[line.slice(30,38),line.slice(38,46),line.slice(46,54)].map(Number);
    if (xyz.every(Number.isFinite)) chains[chain].push(new T.Vector3(...xyz));
  }
  if (chains.A.length<3 || chains.B.length<3) throw new Error('The saved illustration coordinates are incomplete.');
  const center=chains.A.reduce((sum,p)=>sum.add(p),new T.Vector3()).divideScalar(chains.A.length);
  Object.values(chains).forEach(points=>points.forEach(p=>p.sub(center)));
  return chains;
}

export async function mountBinderScene(host, {progress=0, reduced=false}={}) {
  const response=await fetch(new URL('../assets/protein/l79_s469532_mpnn9.pdb', import.meta.url));
  if (!response.ok) throw new Error('The saved structure could not load.');
  const points=backbone(await response.text());
  const viewport=host.querySelector('.protein-viewport');
  const board=host.closest('.binder-board');
  const intro=board.querySelector('.binder-copy--intro');
  const headline=board.querySelector('.binder-copy--result');
  const cards=[...board.querySelectorAll('.binder-fact')];
  const leaders=board.querySelector('.binder-leaders');
  const lines=[...leaders.querySelectorAll('g')];
  const canvas=document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true'); viewport.append(canvas);
  let renderer, fallback;
  try {
    renderer=new T.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1,2));
  } catch {
    canvas.remove(); fallback=document.createElementNS(SVG,'svg');
    fallback.setAttribute('aria-hidden','true'); viewport.append(fallback);
  }
  const scene=new T.Scene();
  const camera=new T.OrthographicCamera(-1,1,1,-1,1,4000);
  camera.position.z=1000;
  const root=new T.Group(); scene.add(root);
  const materials=[], geometries=[];
  const material=(color,leaf=false)=> {
    const m=paperMaterial(color,leaf);
    materials.push(m); return m;
  };
  const tube=(list,radius,color,leaf=false)=> {
    const group=new T.Group();
    const curve=new T.CatmullRomCurve3(list);
    const geometry=new T.TubeGeometry(curve,list.length*5,radius,leaf?10:12,false);
    geometries.push(geometry);
    const mesh=new T.Mesh(geometry,material(color,leaf));
    group.add(mesh);
    return group;
  };
  const target=tube(points.B,.82,TARGET,true); root.add(target);
  const binder=tube(points.A,.48,'#eeb738'); root.add(binder);
  // Every saved C-alpha position is represented; the colors are illustrative.
  const colors=points.A.map((_,i)=> {
    return new T.Color(PALETTE[Math.min(PALETTE.length-1,Math.floor(i/points.A.length*PALETTE.length))]);
  });
  const beadGeometry=new T.SphereGeometry(1.23,32,20);
  // Slightly irregular paper silhouettes, while every bead stays centered on
  // its original saved C-alpha position.
  const positions=beadGeometry.attributes.position;
  for(let i=0;i<positions.count;i++) {
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
    const warp=1+.035*Math.sin(x*2.1+y*1.4)+.025*Math.cos(y*2.7-z*1.9);
    positions.setXYZ(i,x*warp,y*warp,z*warp);
  }
  beadGeometry.computeVertexNormals();
  geometries.push(beadGeometry);
  const beads=new T.InstancedMesh(beadGeometry,material('#ffffff'),points.A.length);
  const matrix=new T.Matrix4(), beadTurn=new T.Quaternion(), beadScale=new T.Vector3();
  points.A.forEach((p,i)=> {
    beadTurn.setFromEuler(new T.Euler(0,0,i*.71));
    beadScale.set(1.04+.025*Math.sin(i*1.7),.96+.025*Math.cos(i*1.3),1);
    matrix.compose(p,beadTurn,beadScale); beads.setMatrixAt(i,matrix); beads.setColorAt(i,colors[i]);
  });
  binder.add(beads);
  const endQ=principal(points.A);
  const allPoints=[...points.A,...points.B];
  const bounds=(list,q)=>new T.Box3().setFromPoints(list.map(p=>p.clone().applyQuaternion(q))).expandByScalar(2);
  const flat=points.A.map(p=>p.clone().applyQuaternion(endQ));
  const sorted=flat.map((_,i)=>i).sort((a,b)=>flat[a].x-flat[b].x);
  const k=Math.max(2,Math.round(sorted.length*.4)), left=sorted.slice(0,k), right=sorted.slice(-k);
  const extreme=(list,top)=>list.reduce((a,b)=>(top?flat[b].y>flat[a].y:flat[b].y<flat[a].y)?b:a);
  const anchors=[extreme(left,true),extreme(right,true),extreme(left,false),extreme(right,false)];
  let width=0,height=0,current=progress,dead=false,yaw=0,pitch=0,down=null,queued=0;
  const scratch=new T.Vector3(), turn=new T.Quaternion(), orbit=new T.Quaternion();
  const startCenter=new T.Vector3(),endCenter=new T.Vector3(),startSize=new T.Vector3(),endSize=new T.Vector3();
  function size() {
    const w=viewport.clientWidth, h=viewport.clientHeight;
    if (!w || !h) return false;
    if (w!==width || h!==height) {
      width=w; height=h;
      renderer?.setSize(w,h,false);
      fallback?.setAttribute('viewBox',`0 0 ${w} ${h}`);
      camera.left=-w/2; camera.right=w/2; camera.top=h/2; camera.bottom=-h/2; camera.updateProjectionMatrix();
    }
    return true;
  }
  const project=p=>p.clone().applyMatrix4(root.matrixWorld).project(camera);
  function svgFallback(fade) {
    const segments=[];
    for (const [list,color,opacity,radius] of [[points.B,TARGET,1-fade,.82],[points.A,'#eeb738',1,.48]]) {
      const positions=list.map(project);
      for (let i=1;i<positions.length;i++) {
        const a=positions[i-1],b=positions[i];
        segments.push({z:(a.z+b.z)/2,markup:`<path d="M${(a.x+1)*width/2} ${(1-a.y)*height/2}L${(b.x+1)*width/2} ${(1-b.y)*height/2}" stroke="${color}" stroke-width="${radius*root.scale.x*2}"/>`,opacity});
      }
    }
    points.A.forEach((p,i)=> {
      const v=project(p),tone=Math.min(PALETTE.length-1,Math.floor(i/points.A.length*PALETTE.length));
      segments.push({z:v.z,opacity:1,markup:`<g transform="translate(${(v.x+1)*width/2} ${(1-v.y)*height/2}) scale(${1.23*root.scale.x})"><path d="M0 -1C.61 -1.06 1.04 -.55 1 .04C.96 .65 .47 1.04 -.06 1C-.67 .96 -1.05 .48 -1 -.1C-.97 -.65 -.57 -1 0 -1Z" fill="${PALETTE[tone]}"/><path d="M-.72 .67C-.16 .85 .56 .42 .84 -.28C1.18 .26 .86 .85 .23 .97C-.16 1.05 -.49 .91 -.72 .67Z" fill="#d99830"/><path d="M-.72 -.4C-.72 -.73 -.41 -.92 -.11 -.85C.06 -.65 -.31 -.34 -.72 -.4Z" fill="#ffe69b"/><path d="M-.46 .88C.12 .94 .69 .65 .96 .23C.87 .69 .52 .95 .12 1C-.12 1.02 -.31 .96 -.46 .88Z" fill="#b97b23"/></g>`});
    });
    fallback.innerHTML=segments.sort((a,b)=>b.z-a.z).map(s=>`<g opacity="${s.opacity}" fill="none" stroke-linecap="round" stroke-linejoin="round">${s.markup}</g>`).join('');
  }
  function drawLeaders(amounts) {
    const rect=board.getBoundingClientRect(), view=viewport.getBoundingClientRect();
    leaders.setAttribute('viewBox',`0 0 ${rect.width} ${rect.height}`);
    leaders.style.visibility=width<=760?'hidden':'visible';
    lines.forEach((line,i)=> {
      const v=project(points.A[anchors[i]]), card=cards[i].getBoundingClientRect();
      const x=(v.x+1)*width/2+view.left-rect.left, y=(1-v.y)*height/2+view.top-rect.top;
      const tx=(i%2===0?card.right:card.left)-rect.left, ty=card.top+card.height*(i<2?.65:.35)-rect.top;
      const path=line.querySelector('path');
      const bend=(tx-x)*.42;
      path.setAttribute('d',`M${x.toFixed(2)} ${y.toFixed(2)}C${(x+bend).toFixed(2)} ${y.toFixed(2)} ${(tx-bend*.7).toFixed(2)} ${ty.toFixed(2)} ${tx.toFixed(2)} ${ty.toFixed(2)}`);
      path.style.strokeDashoffset=String(1-amounts[i]);
      line.querySelector('circle').setAttribute('cx',x); line.querySelector('circle').setAttribute('cy',y);
      line.style.opacity=amounts[i];
    });
  }
  function paint(value=current) {
    if (dead) return;
    current=clamp(Number.isFinite(value)?value:0);
    if (!size()) return;
    const p=reduced?1:current;
    const move=ease(ramp(p,.34,.64)), fade=ease(ramp(p,.35,.56));
    const align=ease(ramp(p,.44,.68)), spin=ease(ramp(p,.16,.54));
    const narrow=width<=760;
    // One model stays in view: turn the bound pair, let the target recede,
    // then bring the same binder forward into its reading pose.
    orbit.setFromEuler(new T.Euler(.24+.08*spin,.38+.9*spin,-.15+.1*spin));
    root.quaternion.copy(orbit).slerp(endQ,align);
    turn.setFromEuler(new T.Euler(pitch,yaw,0)); root.quaternion.premultiply(turn);
    const opening=bounds(allPoints,root.quaternion), ending=bounds(points.A,root.quaternion);
    opening.getCenter(startCenter); opening.getSize(startSize);
    ending.getCenter(endCenter); ending.getSize(endSize);
    const startScale=Math.min(width*(narrow?.84:.50)/startSize.x,height*(narrow?.78:.68)/startSize.y);
    const endScale=Math.min(width*(narrow?.84:.44)/endSize.x,height*(narrow?.78:.51)/endSize.y);
    const scale=T.MathUtils.lerp(startScale,endScale,move);
    root.scale.setScalar(scale);
    scratch.copy(startCenter).lerp(endCenter,move).multiplyScalar(-scale);
    root.position.copy(scratch);
    root.position.x+=narrow?0:width*.19*(1-move);
    root.position.y-=height*(narrow?.03:.045);
    target.position.set(fade*8,-fade*3,-fade*18);
    board.style.setProperty('--binder-focus',move.toFixed(4));
    // Explain minibinders beside the bound pair; reserve the result headline
    // for the centered model and its four callouts.
    for (const [copy,amount] of [[intro,1-ease(ramp(p,.34,.48))],[headline,ease(ramp(p,.52,.65))]]) {
      if (!copy) continue;
      copy.style.opacity=amount.toFixed(4);
      copy.style.visibility=amount>.001?'visible':'hidden';
      copy.setAttribute('aria-hidden',String(amount<.5));
    }
    target.visible=fade<.999;
    target.children.forEach(child=> {
      child.material.transparent=fade>0; child.material.opacity=1-fade; child.material.depthWrite=fade===0;
      child.material.uniforms.uOpacity.value=1-fade;
    });
    const amounts=cards.map((card,i)=> {
      const t=ease(ramp(p,.65+i*.035,.76+i*.035));
      board.style.setProperty(`--callout-${i+1}`,t.toFixed(4));
      card.inert=t<.6; card.setAttribute('aria-hidden',String(t<.01));
      card.style.pointerEvents=t>.6?'auto':'none'; return t;
    });
    board.style.setProperty('--callouts',Math.max(...amounts).toFixed(4));
    root.updateMatrixWorld(true); camera.updateMatrixWorld();
    renderer?renderer.render(scene,camera):svgFallback(fade);
    drawLeaders(cards.map((_,i)=>ease(ramp(p,.61+i*.035,.73+i*.035))));
    host.dataset.progress=current.toFixed(3); host.dataset.target=String(fade<.5);
  }
  const queue=()=>{if(!dead&&!queued)queued=requestAnimationFrame(()=>{queued=0;paint();});};
  const reset=()=>{yaw=pitch=0;paint();};
  const onDown=e=> {
    if (e.pointerType!=='mouse'||e.button!==0) return;
    down={x:e.clientX,y:e.clientY}; host.setPointerCapture(e.pointerId); host.dataset.dragging='true';
  };
  const onMove=e=> {
    if (!down) return; yaw+=(e.clientX-down.x)*.006; pitch+=(e.clientY-down.y)*.006;
    down={x:e.clientX,y:e.clientY}; queue();
  };
  const onUp=()=>{down=null;delete host.dataset.dragging;};
  const onKey=e=> {
    if (e.key.toLowerCase()==='r') { e.preventDefault(); reset();return; }
    const delta={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,-.16],ArrowDown:[0,.16]}[e.key];
    if (!delta) return; e.preventDefault(); yaw+=delta[0];pitch+=delta[1];paint();
  };
  const resetButton=board.querySelector('[data-protein-reset]');
  resetButton?.addEventListener('click',reset);
  for(const [event,handler] of [['pointerdown',onDown],['pointermove',onMove],['pointerup',onUp],['pointercancel',onUp],['lostpointercapture',onUp],['keydown',onKey]])host.addEventListener(event,handler);
  cards.forEach(card=>card.addEventListener('toggle',queue));
  const resize=new ResizeObserver(queue); resize.observe(viewport); cards.forEach(card=>resize.observe(card));
  document.fonts?.ready.then(queue);
  host.dataset.ready=''; host.dataset.binder='l79_s469532_mpnn9';
  paint();
  return {
    backend:renderer?'webgl-ink':'svg-ink', setProgress:paint,
    setReduced(value){reduced=value;paint();},
    destroy(){
      if(dead)return;dead=true;cancelAnimationFrame(queued);resize.disconnect();
      resetButton?.removeEventListener('click',reset);cards.forEach(card=>card.removeEventListener('toggle',queue));
      for(const [event,handler] of [['pointerdown',onDown],['pointermove',onMove],['pointerup',onUp],['pointercancel',onUp],['lostpointercapture',onUp],['keydown',onKey]])host.removeEventListener(event,handler);
      materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());renderer?.dispose();
      canvas.remove();fallback?.remove();
    }
  };
}
