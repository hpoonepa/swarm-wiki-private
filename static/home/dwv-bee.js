import { buildWing, OUTLINE, VEINS } from './dwv-wing.js?v=aea204f80804';
import { mix, TAU, RAD, FOG, paper, ellipsoid, limb } from './dwv-paper.js?v=2603809d7ca4';

export const SEGMENTS = [[-.3, .03, .5, 'yellow'], [-.63, -.01, .56, 'red'], [-.96, -.06, .54, 'yellow'], [-1.26, -.12, .45, 'red'], [-1.53, -.19, .32, 'yellow']];
export const SEGMENT_SCALE = [1, .92, .95];

const SHOULDER = [.255, .455, .25], SHOULDER_SIZE = [.075, .075, .13];
const LANDED = { fore: [8, 80], hind: [5, 86] };
const LEG_POSES = {
  dangle: [[58, -74, -52, -30], [62, -66, -40, -22], [52, -30, -6, 8]],
  stand: [[18, 150, -6, -70], [16, 152, -4, -70], [14, 158, 0, -72]],
  slump: [[95, 200, -60, 10], [95, 200, -60, 10], [92, 200, -56, 10]]
};
const LEG_SWING = { dangle: [-4, 38, 74], stand: [-16, -2, 14], slump: [-14, 0, 12] };
const LEG_SIZE = [.8, .9, 1.1];

function eyeMaterial(T) {
  return new T.ShaderMaterial({
    extensions: { derivatives: true },
    uniforms: {
      uLook: { value: new T.Vector3(0, 0, 1) }, uDensity: { value: 13 },
      cShade: { value: new T.Color('#2e2e2e') }, cBase: { value: new T.Color('#454545') }, cRim: { value: new T.Color('#5c5c5c') }, cPupil: { value: new T.Color('#141414') },
      fogColor: { value: new T.Color(FOG.color) }, fogNear: FOG.near, fogFar: FOG.far
    },
    vertexShader: `
      varying vec3 vN;
      varying vec3 vV;
      varying float vDepth;
      void main() {
        vec4 view=modelViewMatrix*vec4(position,1.0);
        vN=normalize(normalMatrix*normal);
        vV=normalize(-view.xyz);
        vDepth=-view.z;
        gl_Position=projectionMatrix*view;
      }
    `,
    fragmentShader: `
      uniform vec3 uLook,cShade,cBase,cRim,cPupil,fogColor;
      uniform float fogNear,fogFar;
      varying vec3 vN;
      varying vec3 vV;
      varying float vDepth;
      float band(float x,float at){float w=max(fwidth(x)*.8,.003);return smoothstep(at-w,at+w,x);}
      void main() {
        vec3 n=normalize(vN),v=normalize(vV),L=normalize(vec3(-.48,.68,.56));
        vec3 col=mix(cShade,cBase,band(dot(n,L),-.1));
        col=mix(col,cRim,band(1.0-abs(dot(n,v)),.8)*.8);
        col=mix(col,cPupil,band(dot(n,normalize(uLook)),.955));
        col=mix(col,vec3(1.0),band(dot(reflect(-v,n),L),.965));
        col=mix(col,fogColor,smoothstep(fogNear,fogFar,vDepth));
        gl_FragColor=vec4(col,1.0);
        #include <colorspace_fragment>
      }
    `
  });
}

function mergeMeshes(T, root, material) {
  root.updateMatrixWorld(true);
  const inv = new T.Matrix4().copy(root.matrixWorld).invert(), m = new T.Matrix4(), nm = new T.Matrix3(), v = new T.Vector3();
  const pos = [], nor = [], index = [];
  root.traverse(o => {
    if (!o.isMesh) return;
    m.multiplyMatrices(inv, o.matrixWorld);
    nm.getNormalMatrix(m);
    const g = o.geometry, p = g.attributes.position, n = g.attributes.normal, base = pos.length / 3;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m); pos.push(v.x, v.y, v.z);
      v.fromBufferAttribute(n, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z);
    }
    const idx = g.index ? g.index.array : Array.from({ length: p.count }, (_, i) => i);
    for (const i of idx) index.push(base + i);
  });
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
  g.setIndex(index);
  return new T.Mesh(g, material);
}

export function buildBee(T) {
  const root = new T.Group(), body = new T.Group();
  root.add(body);
  const mats = {
    head: paper(T, ['#FCC42F', '#D99830', '#B97B23', '#FFE69B']),
    face: paper(T, ['#ECAA5C', '#CF8A40', '#A96A2C', '#F6CF95']),
    thorax: paper(T, ['#62172F', '#4A1023', '#360A19', '#83304B']),
    yellow: paper(T, ['#FCC42F', '#D99830', '#B97B23', '#FFE69B']),
    red: paper(T, ['#C94607', '#A8380A', '#86290A', '#E2733A']),
    leg: paper(T, ['#6E1B41', '#541331', '#3D0D24', '#8C3360']),
    dark: paper(T, ['#461021', '#331018', '#22080F', '#62172F'])
  };
  const thorax = ellipsoid(T, .46, [1, .98, .96], mats.thorax);
  thorax.position.set(0, .08, .32);
  {
    const g = new T.SphereGeometry(.46, 72, 54), pos = g.attributes.position, v = new T.Vector3(), b = new T.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      b.copy(v).multiply(thorax.scale).add(thorax.position);
      let lift = 0;
      for (const side of [-1, 1]) {
        const dx = (b.x - side * SHOULDER[0]) / SHOULDER_SIZE[0], dy = (b.y - SHOULDER[1]) / SHOULDER_SIZE[1], dz = (b.z - SHOULDER[2]) / SHOULDER_SIZE[2];
        lift += .055 * Math.exp(-(dx * dx + dy * dy + dz * dz));
      }
      v.multiplyScalar(1 + lift / .46);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    thorax.geometry.dispose();
    thorax.geometry = g;
  }
  const waist = ellipsoid(T, .13, [1, .9, 1.2], mats.thorax, [24, 16]);
  waist.position.set(0, .02, -.16);
  body.add(thorax, waist);
  const abdomen = new T.Group(), segments = SEGMENTS;
  for (const [z, y, r, tone] of segments) {
    const seg = ellipsoid(T, r, SEGMENT_SCALE, mats[tone], [40, 26]);
    seg.position.set(0, y, z);
    abdomen.add(seg);
  }
  const sting = new T.Mesh(new T.ConeGeometry(.06, .22, 14), mats.dark);
  sting.rotation.x = -Math.PI / 2 - .25;
  sting.position.set(0, -.25, -1.84);
  abdomen.add(sting);
  body.add(abdomen);

  const head = new T.Group();
  head.position.set(0, .14, .96);
  body.add(head);
  head.add(ellipsoid(T, .44, [1, .93, .62], mats.head, [40, 28]));
  const clypeus = ellipsoid(T, .12, [1.3, .62, .42], mats.face, [24, 16]);
  clypeus.position.set(0, -.25, .22);
  head.add(clypeus);
  const eyes = [], eyeBase = eyeMaterial(T);
  for (const side of [-1, 1]) {
    const mesh = new T.Mesh(new T.SphereGeometry(1, 40, 28), side < 0 ? eyeBase : eyeBase.clone());
    const zAxis = new T.Vector3(side * .86, .06, .5).normalize(), up = new T.Vector3(0, 1, 0);
    const yAxis = up.clone().addScaledVector(zAxis, -up.dot(zAxis)).normalize(), xAxis = new T.Vector3().crossVectors(yAxis, zAxis);
    mesh.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(xAxis, yAxis, zAxis));
    mesh.position.set(side * .31, .04, .05);
    mesh.scale.set(.19, .34, .16);
    head.add(mesh);
    eyes.push({ mesh, side });
  }
  const antennae = [];
  for (const side of [-1, 1]) {
    const socket = new T.Group();
    socket.position.set(side * .075, .13, .265);
    head.add(socket);
    const down = new T.Vector3(0, -1, 0), rise = new T.Vector3(side * .12, .72, .68).normalize(), reach = new T.Vector3(side * .42, -.52, .74).normalize();
    const scape = limb(T, .026, .25, mats.leg, .022);
    scape.quaternion.setFromUnitVectors(down, rise);
    socket.add(scape);
    const elbow = new T.Group();
    elbow.position.y = -.25;
    elbow.quaternion.copy(scape.quaternion).invert().multiply(new T.Quaternion().setFromUnitVectors(down, reach));
    scape.add(elbow);
    let joint = elbow;
    for (let i = 0; i < 10; i++) {
      const piece = limb(T, .022, .05, mats.leg, .021);
      const next = new T.Group();
      next.position.y = -.05;
      next.rotation.x = .035;
      joint.add(piece);
      piece.add(next);
      joint = next;
    }
    const merged = mergeMeshes(T, socket, mats.leg);
    socket.clear();
    socket.add(merged);
    antennae.push({ socket, side });
  }

  const legs = [], parts = [];
  for (const [row, z] of [[0, .52], [1, .34], [2, .14]]) for (const side of [-1, 1]) {
    const k = LEG_SIZE[row], hip = new T.Group();
    hip.position.set(side * .22, -.3, z);
    body.add(hip);
    const lengths = [.45 * k, .55 * k, .36 * k, .2 * k], radii = [.05, .045 + (row === 2 ? .012 : 0), .038, .022];
    const joints = [hip];
    let parent = hip;
    lengths.forEach((len, i) => {
      const piece = new T.Group();
      parent.add(piece);
      parts.push({ piece, len, radius: radii[i], wide: i === 2 && row === 2 });
      const next = new T.Group();
      next.position.y = -len;
      piece.add(next);
      joints.push(next);
      parent = next;
    });
    legs.push({ joints, side, row, tip: joints[4] });
  }
  const segmentGeo = new T.CylinderGeometry(.82, 1, 1, 12, 1);
  segmentGeo.translate(0, -.5, 0);
  const legSegments = new T.InstancedMesh(segmentGeo, mats.leg, parts.length), legKnuckles = new T.InstancedMesh(new T.SphereGeometry(1, 12, 8), mats.leg, parts.length);
  for (const mesh of [legSegments, legKnuckles]) { mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(T.DynamicDrawUsage); body.add(mesh); }
  const chain = new T.Matrix4(), part = new T.Matrix4(), scaleM = new T.Matrix4();
  function placeLegs() {
    parts.forEach(({ piece, len, radius, wide }, i) => {
      chain.identity();
      for (let o = piece; o && o !== body; o = o.parent) { o.updateMatrix(); chain.premultiply(o.matrix); }
      legSegments.setMatrixAt(i, part.multiplyMatrices(chain, scaleM.makeScale(radius * (wide ? 1.8 : 1), len, radius * (wide ? .6 : 1))));
      legKnuckles.setMatrixAt(i, part.multiplyMatrices(chain, scaleM.makeScale(radius, radius, radius)));
    });
    legSegments.instanceMatrix.needsUpdate = legKnuckles.instanceMatrix.needsUpdate = true;
  }

  const wingSet = [];
  for (const [fore, length, hinge, flight, phase] of [[false, 1.4, [.255, .47, .21], [55, 50], 1.2], [true, 2.05, [.262, .478, .3], [62, 40], 0]]) {
    for (const side of [-1, 1]) {
      const key = fore ? 'fore' : 'hind';
      const wing = buildWing(T, { outline: OUTLINE[key], veins: VEINS[key], length, fore, seed: fore ? (side < 0 ? .21 : .77) : (side < 0 ? .43 : .91) });
      const hingeGroup = new T.Group();
      hingeGroup.position.set(side * hinge[0], hinge[1], hinge[2]);
      hingeGroup.scale.x = side;
      hingeGroup.add(wing.mesh);
      body.add(hingeGroup);
      wingSet.push({ wing, fore, flight, landed: LANDED[key], phase });
    }
  }

  const v3 = new T.Vector3(), rest = {};
  function wings({ t, pose, flutter, boost, sev }) {
    const k = pose * pose * (3 - 2 * pose), amp = .14 * flutter + .105 * boost;
    for (const w of wingSet) w.wing.set({ t, lift: mix(w.flight[0], w.landed[0], k), sweep: mix(w.flight[1], w.landed[1], k), amp, hz: 5, phase: w.phase, sev });
  }
  function stance(from, to, k) {
    for (const leg of legs) {
      const a = LEG_POSES[from][leg.row], b = LEG_POSES[to][leg.row];
      const ang = a.map((v, i) => mix(v, b[i], k)), swing = mix(LEG_SWING[from][leg.row], LEG_SWING[to][leg.row], k);
      leg.joints[0].rotation.set(swing * RAD, 0, leg.side * ang[0] * RAD);
      for (let i = 1; i < 4; i++) leg.joints[i].rotation.z = leg.side * (ang[i] - ang[i - 1]) * RAD;
    }
    placeLegs();
  }
  function restHeight(name) {
    if (rest[name] !== undefined) return rest[name];
    const saved = legs.map(leg => leg.joints.slice(0, 4).map(j => j.rotation.clone()));
    const p = root.position.clone(), r = root.rotation.clone(), pitch = body.rotation.x;
    root.position.set(0, 0, 0); root.rotation.set(0, 0, 0); body.rotation.x = 0;
    stance(name, name, 0);
    root.updateMatrixWorld(true);
    let low = Infinity;
    for (const leg of legs) { leg.tip.getWorldPosition(v3); low = Math.min(low, v3.y); }
    legs.forEach((leg, i) => leg.joints.slice(0, 4).forEach((j, k) => j.rotation.copy(saved[i][k])));
    root.position.copy(p); root.rotation.copy(r); body.rotation.x = pitch;
    root.updateMatrixWorld(true);
    return rest[name] = -low;
  }
  function look(gaze, camera, ease) {
    body.worldToLocal(v3.copy(gaze)).sub(head.position);
    const yaw = Math.atan2(v3.x, v3.z), pitch = Math.atan2(v3.y, Math.hypot(v3.x, v3.z));
    head.userData.yaw = mix(head.userData.yaw || 0, Math.max(-.6, Math.min(.6, yaw * .45)), ease);
    head.userData.pitch = mix(head.userData.pitch || 0, Math.max(-.3, Math.min(.35, pitch * .5)), ease);
    head.rotation.set(-head.userData.pitch, head.userData.yaw, 0);
    head.updateMatrixWorld(true);
    for (const eye of eyes) {
      eye.mesh.getWorldPosition(v3);
      const look = eye.mesh.material.uniforms.uLook.value.copy(gaze).sub(v3).transformDirection(camera.matrixWorldInverse);
      look.lerp(v3.applyMatrix4(camera.matrixWorldInverse).negate().normalize(), .4).normalize();
    }
  }
  function antennaSway(t, air) {
    for (const a of antennae) a.socket.rotation.set(air * .08 * Math.sin(t * TAU * .7 + a.side * 2), 0, air * .06 * Math.sin(t * TAU * .5 + a.side));
  }
  function detail(narrow) {
    for (const eye of eyes) eye.mesh.material.uniforms.uDensity.value = narrow ? 11 : 13;
  }
  wings({ t: 0, pose: 0, flutter: 0, boost: 0, sev: 0 });
  stance('dangle', 'dangle', 0);
  return { root, body, head, wings, stance, restHeight, look, antennaSway, detail };
}
