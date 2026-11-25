/**
 * Wet services: an inlet pipe with a gate valve feeding a see-through storage tank. A
 * stream falls from the inlet, ripples spread on the surface, and the level rises and
 * falls, tracked by a copper marker on the sight gauge.
 */
import {
  BoxGeometry,
  CircleGeometry,
  CurvePath,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  LineCurve3,
  Matrix4,
  Mesh,
  QuadraticBezierCurve3,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from 'three';
import { at, palette, seeded, smoothstep, type ModelBuilder } from '../kit';

const TANK = { x: 0.55, r: 0.72, base: -0.85, height: 1.6 };
const INLET_X = 0.4;
const DROPS = 26;
const RIPPLES = 3;
const CYCLE = 12; // Seconds for the level to rise and fall.

export const wetServices: ModelBuilder = (kit) => {
  const root = new Group();
  const top = TANK.base + TANK.height;
  const steel = kit.steel();
  const dark = kit.steel(palette.steel700);

  // Tank: see-through wall, bands, lid and plinth.
  const wallMat = kit.glass(0.16, palette.steel100);
  wallMat.side = DoubleSide;
  const wall = kit.mesh(new CylinderGeometry(TANK.r, TANK.r, TANK.height, 48, 1, true), wallMat, false);
  root.add(at(wall, TANK.x, TANK.base + TANK.height / 2, 0));
  const bandMat = kit.steel(palette.steel300);
  for (const y of [TANK.base + 0.02, TANK.base + TANK.height / 2, top - 0.02]) {
    const band = new Mesh(new TorusGeometry(TANK.r + 0.006, 0.011, 8, 64), bandMat);
    band.rotation.x = Math.PI / 2;
    root.add(at(band, TANK.x, y, 0));
  }
  root.add(at(kit.mesh(new CylinderGeometry(TANK.r + 0.03, TANK.r + 0.03, 0.06, 48), steel), TANK.x, top + 0.03, 0));
  root.add(at(kit.mesh(new CylinderGeometry(TANK.r + 0.1, TANK.r + 0.12, 0.1, 48), kit.panel(palette.steel300)), TANK.x, TANK.base - 0.05, 0));

  // Water: a unit-height cylinder scaled to the level, with a lighter surface.
  const waterGeo = new CylinderGeometry(TANK.r - 0.03, TANK.r - 0.03, 1, 48);
  waterGeo.translate(0, 0.5, 0);
  const water = new Mesh(waterGeo, kit.water(0.78));
  root.add(at(water, TANK.x, TANK.base, 0));
  const surface = new Mesh(new CircleGeometry(TANK.r - 0.03, 48), kit.water(0.9, palette.water300));
  surface.rotation.x = -Math.PI / 2;
  root.add(surface);

  // Inlet pipe: along x, over the bend, down through the lid.
  const pipePath = new CurvePath<Vector3>();
  const run = top + 0.42;
  pipePath.add(new LineCurve3(new Vector3(-1.75, run, 0), new Vector3(INLET_X - 0.25, run, 0)));
  pipePath.add(
    new QuadraticBezierCurve3(new Vector3(INLET_X - 0.25, run, 0), new Vector3(INLET_X, run, 0), new Vector3(INLET_X, run - 0.25, 0)),
  );
  pipePath.add(new LineCurve3(new Vector3(INLET_X, run - 0.25, 0), new Vector3(INLET_X, top - 0.05, 0)));
  root.add(kit.mesh(new TubeGeometry(pipePath, 96, 0.07, 20, false), steel, false));
  for (const x of [-1.45, -0.05]) {
    const flange = kit.mesh(new CylinderGeometry(0.12, 0.12, 0.05, 28), dark);
    flange.rotation.z = Math.PI / 2;
    root.add(at(flange, x, run, 0));
  }

  // Gate valve with a copper handwheel.
  const vx = -0.75;
  const body = kit.mesh(new CylinderGeometry(0.13, 0.13, 0.3, 28), dark);
  body.rotation.z = Math.PI / 2;
  root.add(at(body, vx, run, 0));
  root.add(at(kit.mesh(new BoxGeometry(0.16, 0.22, 0.16), dark), vx, run + 0.16, 0));
  root.add(at(kit.mesh(new CylinderGeometry(0.02, 0.02, 0.2, 10), steel, false), vx, run + 0.35, 0));
  const brass = kit.copper();
  const wheel = new Group();
  const rim = new Mesh(new TorusGeometry(0.16, 0.022, 10, 40), brass);
  rim.rotation.x = Math.PI / 2;
  wheel.add(rim);
  for (const a of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
    const spoke = new Mesh(new BoxGeometry(0.32, 0.018, 0.018), brass);
    spoke.rotation.y = a;
    wheel.add(spoke);
  }
  root.add(at(wheel, vx, run + 0.45, 0));

  // Sight gauge on the front of the tank, with tick marks and a copper level marker.
  const gaugeA = (140 * Math.PI) / 180;
  const gx = TANK.x + Math.cos(gaugeA) * (TANK.r + 0.1);
  const gz = Math.sin(gaugeA) * (TANK.r + 0.1);
  const tubeMat = kit.glass(0.35, palette.steel200);
  root.add(at(kit.mesh(new CylinderGeometry(0.03, 0.03, TANK.height - 0.1, 12), tubeMat, false), gx, TANK.base + TANK.height / 2, gz));
  for (let i = 1; i <= 4; i++) {
    root.add(at(kit.mesh(new BoxGeometry(0.1, 0.012, 0.012), dark, false), gx, TANK.base + (i * TANK.height) / 5, gz));
  }
  const marker = new Mesh(new SphereGeometry(0.05, 16, 12), kit.glow(palette.copper500));
  root.add(marker);

  // Stream from the inlet: instanced droplets falling to the surface.
  const rand = seeded(3);
  const drops = Array.from({ length: DROPS }, () => ({ offset: rand(), dx: (rand() - 0.5) * 0.05, dz: (rand() - 0.5) * 0.05 }));
  const stream = new InstancedMesh(new SphereGeometry(0.03, 8, 6), kit.water(1, palette.water300), DROPS);
  stream.instanceMatrix.setUsage(DynamicDrawUsage);
  stream.frustumCulled = false;
  root.add(stream);

  // Ripples spreading from where the stream lands.
  const ripples = Array.from({ length: RIPPLES }, () => {
    const mat = kit.glow(palette.water300, 0.7);
    const ring = new Mesh(new TorusGeometry(1, 0.012, 6, 48), mat);
    ring.rotation.x = Math.PI / 2;
    root.add(ring);
    return { ring, mat };
  });

  const m = new Matrix4();
  const p = new Vector3();
  const s = new Vector3();
  const q = new Quaternion();
  const fall = 0.55; // Seconds a droplet takes from the inlet to the surface (at full fall).

  return {
    root,
    frame: { center: [-0.25, 0.15, 0], radius: 1.85, floor: TANK.base - 0.1, shadowAt: [TANK.x - 0.2, 0] },
    view: { azimuth: 28, elevation: 17 },
    update(t) {
      // Level: 15% → 85% of the tank and back, eased at the ends.
      const wave = 0.5 - 0.5 * Math.cos((t / CYCLE) * Math.PI * 2);
      const level = TANK.height * (0.15 + 0.7 * wave);
      const surfaceY = TANK.base + level;
      water.scale.y = level;
      surface.position.set(TANK.x, surfaceY + 0.002, 0);
      marker.position.set(gx, surfaceY, gz);

      const drop = top - 0.05 - surfaceY;
      const g = (2 * drop) / (fall * fall);
      drops.forEach((d, i) => {
        const age = ((t / fall + d.offset) % 1) * fall;
        p.set(INLET_X + d.dx, top - 0.05 - 0.5 * g * age * age, d.dz);
        s.set(1, 1.6, 1);
        stream.setMatrixAt(i, m.compose(p, q, s));
      });
      stream.instanceMatrix.needsUpdate = true;

      ripples.forEach(({ ring, mat }, i) => {
        const k = (t / 1.5 + i / RIPPLES) % 1;
        ring.position.set(INLET_X, surfaceY + 0.004, 0);
        ring.scale.setScalar(0.06 + k * 0.44);
        mat.opacity = 0.7 * (1 - smoothstep(0.2, 1, k));
      });
    },
  };
};
