import { mix, RAD, FOG } from './dwv-paper.js?v=2603809d7ca4';

export const OUTLINE = {
  fore: [[0,.02],[.08,.05],[.2,.075],[.35,.09],[.5,.105],[.62,.115],[.72,.118],[.82,.11],[.9,.09],[.95,.065],[.985,.03],[1,0],[.99,-.035],[.96,-.07],[.9,-.11],[.8,-.15],[.68,-.18],[.55,-.2],[.42,-.2],[.3,-.18],[.2,-.14],[.12,-.09],[.05,-.045],[0,-.01]],
  hind: [[0,.01],[.15,.035],[.35,.06],[.55,.075],[.68,.08],[.8,.075],[.9,.06],[.97,.035],[1,0],[.98,-.04],[.9,-.09],[.78,-.13],[.62,-.15],[.45,-.15],[.32,-.13],[.26,-.1],[.22,-.12],[.14,-.11],[.07,-.07],[0,-.02]]
};

const V = (pts, w0, w1, a = 1) => ({ pts, w0, w1, a });
export const VEINS = {
  fore: {
    veins: [
      V([[0, .012], [.1, .036], [.22, .058], [.34, .074], [.45, .087]], 1.25, .8),
      V([[.45, .087], [.55, .078], [.66, .072], [.77, .077], [.86, .088], [.91, .089]], .8, .45),
      V([[0, -.006], [.16, .006], [.32, .02], [.48, .028], [.63, .036], [.76, .048]], 1.05, .4),
      V([[.2, .008], [.33, -.014], [.47, -.04], [.6, -.058]], .8, .35),
      V([[.48, .085], [.46, .055], [.47, .027]], .6, .5)
    ],
    stigma: [[.442, .091], [.48, .099], [.515, .103], [.507, .092], [.472, .086]]
  },
  hind: {
    veins: [
      V([[0, .01], [.16, .034], [.34, .055], [.5, .068], [.62, .075]], 1.05, .4),
      V([[0, -.012], [.14, -.018], [.28, -.024], [.42, -.026]], .9, .35)
    ],
    stigma: null
  }
};

function catmull(points, n) {
  if (points.length < 3) return Array.from({ length: n + 1 }, (_, i) => [mix(points[0][0], points[1][0], i / n), mix(points[0][1], points[1][1], i / n)]);
  const p = [points[0], ...points, points[points.length - 1]], out = [];
  for (let i = 1; i < p.length - 2; i++) for (let j = 0; j < n; j++) {
    const t = j / n, t2 = t * t, t3 = t2 * t, [a, b, c, d] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    out.push([0, 1].map(k => .5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t3)));
  }
  out.push(points[points.length - 1]);
  return out;
}

function edgeCurve(T, points) {
  const dense = new T.CatmullRomCurve3(points.map(([x, y]) => new T.Vector3(x, y, 0)), false, 'centripetal').getPoints(240);
  return x => {
    for (let i = 1; i < dense.length; i++) if (dense[i].x >= x) {
      const a = dense[i - 1], b = dense[i], k = b.x - a.x > 1e-6 ? (x - a.x) / (b.x - a.x) : 0;
      return mix(a.y, b.y, k);
    }
    return dense[dense.length - 1].y;
  };
}

function wingGeometry(T, outline, length) {
  const tip = outline.reduce((best, p, i) => p[0] > outline[best][0] ? i : best, 0);
  const lead = edgeCurve(T, outline.slice(0, tip + 1));
  const trail = edgeCurve(T, outline.slice(tip).concat([outline[0]]).reverse());
  const cols = 48, rows = 10, pos = [], wing = [], uv = [], index = [];
  for (let i = 0; i <= cols; i++) {
    const x = (1 - Math.cos(Math.PI * i / cols)) / 2, yl = lead(x), yt = trail(x);
    for (let j = 0; j <= rows; j++) {
      const y = mix(yt, yl, j / rows);
      pos.push(x * length, 0, y * length);
      wing.push(x, y);
      uv.push(x, j / rows);
    }
  }
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const a = i * (rows + 1) + j, b = a + rows + 1;
    index.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('aWing', new T.Float32BufferAttribute(wing, 2));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeBoundingSphere();
  g.boundingSphere.radius *= 1.3;
  return g;
}

function veinTexture(T, spec, [y0, y1]) {
  const W = 1024, H = Math.round((y1 - y0) * W), scale = 5.6;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighten';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const at = ([x, y]) => [x * W, (y1 - y) * W];
  for (const { pts, w0, w1, a } of spec.veins) {
    const line = catmull(pts, 18);
    ctx.strokeStyle = `rgb(${Math.round(255 * a)},0,0)`;
    for (let i = 1; i < line.length; i++) {
      const [ax, ay] = at(line[i - 1]), [bx, by] = at(line[i]);
      ctx.lineWidth = mix(w0, w1, i / (line.length - 1)) * scale;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    }
  }
  if (spec.stigma) {
    ctx.beginPath();
    catmull([...spec.stigma, spec.stigma[0]], 8).forEach((p, i) => { const [x, y] = at(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.closePath();
    ctx.fillStyle = '#00ff00';
    ctx.fill();
  }
  const tex = new T.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

export function buildWing(T, { outline, veins, length, fore, seed }) {
  const ys = outline.map(p => p[1]), range = [Math.min(...ys) - .015, Math.max(...ys) + .012];
  const uniforms = {
    uMap: { value: veinTexture(T, veins, range) }, uRange: { value: new T.Vector2(...range) },
    uLen: { value: length }, uSeed: { value: seed }, uSev: { value: 0 },
    uTime: { value: 0 }, uAmp: { value: 0 }, uHz: { value: 5 }, uPhase: { value: 0 },
    uMembrane: { value: new T.Color('#eef3f2') }, uShade: { value: new T.Color('#dde6e5') },
    uVein: { value: new T.Color('#7a5c48') }, uStigma: { value: new T.Color('#5a3f30') }, uEdge: { value: new T.Color('#b6ab9c') },
    fogColor: { value: new T.Color(FOG.color) }, fogNear: FOG.near, fogFar: FOG.far
  };
  const material = new T.ShaderMaterial({
    transparent: true, depthWrite: false, side: T.DoubleSide,
    extensions: { derivatives: true },
    uniforms,
    vertexShader: `
      attribute vec2 aWing;
      uniform float uLen,uSeed,uSev,uTime,uAmp,uHz,uPhase;
      varying vec2 vWing;
      varying vec2 vUv;
      varying vec3 vView;
      vec3 rx(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
      vec3 rz(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
      void main() {
        float x=aWing.x,y=aWing.y,s=uSev*(uSeed>.5?1.0:.78),k=1.0-.52*s*pow(x,.6);
        float rough=s*x*x*(.05*sin(x*23.0+uSeed*9.0)+.03*sin(y*41.0+uSeed*5.0));
        float px=x*k,py=y*(1.0-.38*s*x)*(1.0+rough);
        float pleat=s*.045*x*sin(y*62.0+uSeed*6.0)*(.6+.4*sin(x*9.0+uSeed));
        float curl=s*1.3*pow(max(0.0,x-.35)/.65,2.0);
        vec3 p=vec3(px-sin(curl)*.08*s,pleat-(1.0-cos(curl))*.22*x+s*.06*sin(x*7.0+uSeed*3.0),py)*uLen;
        float span=clamp(x,0.0,1.0),ph=6.2831853*uHz*uTime+uPhase,lag=1.1*pow(span,1.4),r=uAmp/.14;
        float flap=uAmp*sin(ph-lag)*smoothstep(0.0,.35,span)+.02*r*span*sin(2.0*ph-1.6*lag);
        p=rz(rx(p,-.22*r*span*cos(ph-.6*lag)*smoothstep(0.0,.5,span)),flap);
        vec4 view=modelViewMatrix*vec4(p,1.0);
        vWing=aWing;
        vUv=uv;
        vView=view.xyz;
        gl_Position=projectionMatrix*view;
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec2 uRange;
      uniform vec3 uMembrane,uShade,uVein,uStigma,uEdge,fogColor;
      uniform float fogNear,fogFar;
      varying vec2 vWing;
      varying vec2 vUv;
      varying vec3 vView;
      void main() {
        vec3 n=normalize(cross(dFdx(vView),dFdy(vView))),v=normalize(-vView);
        if(dot(n,v)<0.0)n=-n;
        float light=dot(n,normalize(vec3(-.48,.68,.56))),facing=dot(n,v);
        vec3 col=mix(uShade,uMembrane,smoothstep(-.27,-.24,light));
        float alpha=mix(.62,.26,smoothstep(.15,.75,facing))*mix(.18,1.0,smoothstep(.03,.3,vWing.x));
        vec4 m=texture2D(uMap,vec2(vWing.x,(vWing.y-uRange.x)/(uRange.y-uRange.x)));
        col=mix(col,uVein,m.r);
        alpha=mix(alpha,.92,m.r);
        col=mix(col,uStigma,m.g);
        alpha=mix(alpha,.95,m.g);
        float e=min(vUv.y,1.0-vUv.y)/max(fwidth(vUv.y),1e-5);
        float line=(1.0-smoothstep(.7,1.7,e))*smoothstep(.02,.12,vWing.x);
        col=mix(col,uEdge,line*.85);
        alpha=max(alpha,line*.75);
        col=mix(col,fogColor,smoothstep(fogNear,fogFar,-vView.z));
        gl_FragColor=vec4(col,alpha);
        #include <colorspace_fragment>
      }
    `
  });
  const mesh = new T.Mesh(wingGeometry(T, outline, length), material);
  mesh.renderOrder = fore ? 2.1 : 2;
  const qa = new T.Quaternion(), Y = new T.Vector3(0, 1, 0), Z = new T.Vector3(0, 0, 1);
  return {
    mesh,
    set({ t, lift, sweep, amp, hz, phase, sev }) {
      mesh.quaternion.setFromAxisAngle(Y, sweep * RAD).multiply(qa.setFromAxisAngle(Z, lift * RAD));
      uniforms.uTime.value = t;
      uniforms.uAmp.value = amp;
      uniforms.uHz.value = hz;
      uniforms.uPhase.value = phase;
      uniforms.uSev.value = sev;
    }
  };
}
