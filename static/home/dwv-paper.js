export const clamp = n => Math.max(0, Math.min(1, n));
export const smooth = n => { const t = clamp(n); return t * t * t * (t * (6 * t - 15) + 10); };
export const span = (v, a, b) => smooth((v - a) / (b - a));
export const mix = (a, b, t) => a + (b - a) * t;
export const TAU = Math.PI * 2, RAD = Math.PI / 180;
export const FOG = { color: '#ffffff', near: { value: 15 }, far: { value: 40 } };

export function random(seed) {
  return () => {
    seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function paper(T, [pigment, shade, deep, highlight], transparent = false) {
  return new T.ShaderMaterial({
    transparent,
    extensions: { derivatives: true },
    uniforms: {
      pigment: { value: new T.Color(pigment) },
      shade: { value: new T.Color(shade) },
      deepShade: { value: new T.Color(deep) },
      highlight: { value: new T.Color(highlight) },
      uOpacity: { value: 1 },
      fogColor: { value: new T.Color(FOG.color) },
      fogNear: FOG.near,
      fogFar: FOG.far
    },
    vertexShader: `
      varying vec3 vPaperNormal;
      varying vec3 vPaperPosition;
      varying vec3 vPaperColor;
      varying float vDepth;
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
        vec4 view=modelViewMatrix*vec4(p,1.0);
        vDepth=-view.z;
        gl_Position=projectionMatrix*view;
      }
    `,
    fragmentShader: `
      uniform vec3 pigment,shade,deepShade,highlight,fogColor;
      uniform float uOpacity,fogNear,fogFar;
      varying vec3 vPaperNormal;
      varying vec3 vPaperPosition;
      varying vec3 vPaperColor;
      varying float vDepth;
      float band(float x,float at){float w=max(fwidth(x)*.8,.004);return smoothstep(at-w,at+w,x);}
      void main() {
        float light=dot(normalize(vPaperNormal),normalize(vec3(-.48,.68,.56)))+.03*sin(vPaperPosition.x*14.0+vPaperPosition.y*10.0);
        vec3 color=mix(shade*vPaperColor,pigment*vPaperColor,band(light,-.255));
        color=mix(color,highlight,band(light,.895));
        color=mix(deepShade*vPaperColor,color,band(light,-.555));
        color=mix(color,fogColor,smoothstep(fogNear,fogFar,vDepth));
        gl_FragColor=vec4(color,uOpacity);
        #include <colorspace_fragment>
      }
    `
  });
}

export function ellipsoid(T, radius, scale, material, detail = [48, 32]) {
  const mesh = new T.Mesh(new T.SphereGeometry(radius, detail[0], detail[1]), material);
  mesh.scale.set(...scale);
  return mesh;
}

export function limb(T, radius, length, material, tip = radius) {
  const geometry = new T.CylinderGeometry(tip, radius, length, 12, 1);
  geometry.translate(0, -length / 2, 0);
  const mesh = new T.Mesh(geometry, material);
  const knuckle = new T.Mesh(new T.SphereGeometry(radius, 12, 8), material);
  mesh.add(knuckle);
  return mesh;
}
