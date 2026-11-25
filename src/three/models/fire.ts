/**
 * Fire: a branch line with a pendent sprinkler (frame arms, glass bulb, deflector)
 * throwing an umbrella of droplets that fall under gravity.
 */
import {
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import { at, palette, seeded, smoothstep, type ModelBuilder } from '../kit';

const COUNT = 120;
const GRAVITY = 2.6;

export const fire: ModelBuilder = (kit) => {
  const root = new Group();
  const steel = kit.steel();
  const brass = kit.copper();

  // Branch line along x, with a drop to the head.
  const main = kit.mesh(new CylinderGeometry(0.13, 0.13, 2.6, 32), steel);
  main.rotation.z = Math.PI / 2;
  root.add(at(main, 0, 1.45, 0));
  const tee = kit.mesh(new CylinderGeometry(0.17, 0.17, 0.3, 32), kit.steel(palette.steel700));
  tee.rotation.z = Math.PI / 2;
  root.add(at(tee, 0, 1.45, 0));
  for (const x of [-1.1, 1.1]) {
    const flange = kit.mesh(new CylinderGeometry(0.17, 0.17, 0.06, 32), kit.steel(palette.steel700));
    flange.rotation.z = Math.PI / 2;
    root.add(at(flange, x, 1.45, 0));
  }
  root.add(at(kit.mesh(new CylinderGeometry(0.075, 0.075, 0.34, 24), steel), 0, 1.2, 0));

  // Sprinkler head: hex body, two frame arms, glass bulb, deflector.
  root.add(at(kit.mesh(new CylinderGeometry(0.12, 0.12, 0.12, 6), brass), 0, 0.99, 0));
  for (const x of [-0.085, 0.085]) {
    root.add(at(kit.mesh(new BoxGeometry(0.035, 0.32, 0.05), brass), x, 0.78, 0));
  }
  root.add(at(kit.mesh(new CylinderGeometry(0.03, 0.05, 0.05, 16), brass), 0, 0.63, 0));
  root.add(at(kit.mesh(new CapsuleGeometry(0.034, 0.14, 6, 12), kit.glass(0.85, palette.copper300), false), 0, 0.8, 0));
  root.add(at(kit.mesh(new CylinderGeometry(0.24, 0.22, 0.02, 24), brass), 0, 0.6, 0));

  // Spray: instanced droplets, each with a fixed direction, speed, lifetime and start offset.
  const rand = seeded(7);
  const drops = Array.from({ length: COUNT }, () => ({
    phi: rand() * Math.PI * 2,
    speed: 0.55 + rand() * 0.9,
    down: 0.1 + rand() * 0.45,
    life: 0.75 + rand() * 0.3,
    offset: rand() * 10,
    size: 0.7 + rand() * 0.6,
  }));
  const spray = new InstancedMesh(new SphereGeometry(0.024, 8, 6), kit.water(1, palette.water), COUNT);
  spray.instanceMatrix.setUsage(DynamicDrawUsage);
  spray.frustumCulled = false;
  root.add(spray);

  const m = new Matrix4();
  const p = new Vector3();
  const s = new Vector3();
  const q = new Quaternion();

  return {
    root,
    frame: { center: [0, 0.2, 0], radius: 1.75, floor: -1 },
    view: { azimuth: 30, elevation: 16 },
    update(t) {
      drops.forEach((d, i) => {
        const age = (t + d.offset) % d.life;
        const k = age / d.life;
        const r = 0.22 + d.speed * age;
        p.set(Math.cos(d.phi) * r, 0.59 - d.down * age - 0.5 * GRAVITY * age * age, Math.sin(d.phi) * r);
        const grow = smoothstep(0, 0.12, k) * (1 - smoothstep(0.7, 1, k));
        s.setScalar(d.size * grow);
        spray.setMatrixAt(i, m.compose(p, q, s));
      });
      spray.instanceMatrix.needsUpdate = true;
    },
  };
};
