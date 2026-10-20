const TONE = '#9C8460', MITE = [.27, .2];

export function buildGround(T, scene) {
  const uniforms = {
    uTone: { value: new T.Color(TONE) },
    uBee: { value: new T.Vector4(0, 0, 1.6, .7) },
    uAxis: { value: new T.Vector3(1, 0, 0) },
    uMite: { value: new T.Vector3(0, 0, 0) }
  };
  const geometry = new T.PlaneGeometry(60, 60);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new T.Mesh(geometry, new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vXZ;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vXZ = w.xz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      uniform vec3 uTone, uAxis, uMite;
      uniform vec4 uBee;
      varying vec2 vXZ;
      float bands(vec2 q, float k) {
        float r = dot(q, q), f = fwidth(r) * .75 + .002;
        return k * (.55 * (1.0 - smoothstep(1.0 - f, 1.0 + f, r)) + .45 * (1.0 - smoothstep(.36 - f, .36 + f, r)));
      }
      void main() {
        vec2 d = vXZ - uBee.xy;
        float s = bands(vec2(dot(d, uAxis.xy), dot(d, vec2(-uAxis.y, uAxis.x))) / uBee.zw, uAxis.z);
        s = max(s, bands((vXZ - uMite.xy) / vec2(${MITE[0]}, ${MITE[1]}), uMite.z));
        if (s < .003) discard;
        gl_FragColor = vec4(uTone, s);
        #include <colorspace_fragment>
      }
    `
  }));
  mesh.renderOrder = -2;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return {
    shadow(x, z, yaw, lift, presence) {
      const ax = Math.sin(yaw), az = Math.cos(yaw), k = .4 + lift;
      uniforms.uBee.value.set(x - .25 * ax + .14 * k, z - .25 * az - .1 * k, 1.55 + .5 * lift, .66 + .32 * lift);
      uniforms.uAxis.value.set(ax, az, (.26 - .1 * lift) * Math.max(0, Math.min(1, presence)));
    },
    mite(contact) {
      if (contact) uniforms.uMite.value.set(contact.x, contact.z, .22 * contact.ground);
      else uniforms.uMite.value.z = 0;
    }
  };
}
