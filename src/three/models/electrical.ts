/**
 * Electrical: a copper busbar feeding a breaker → motor, and a second
 * feeder to a lamp. Copper current pulses run down the feeders; the motor's fan turns
 * and the lamp brightens as each pulse arrives.
 */
import {
  BoxGeometry,
  Color,
  CurvePath,
  CylinderGeometry,
  Group,
  LineCurve3,
  Mesh,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { at, palette, smoothstep, type ModelBuilder } from '../kit';

function polyline(points: Array<[number, number, number]>): CurvePath<Vector3> {
  const path = new CurvePath<Vector3>();
  for (let i = 1; i < points.length; i++) {
    path.add(new LineCurve3(new Vector3(...points[i - 1]), new Vector3(...points[i])));
  }
  return path;
}

/** A cable as a thin cylinder between two points on the same vertical or horizontal line. */
function cableGeometry(length: number): CylinderGeometry {
  return new CylinderGeometry(0.028, 0.028, length, 10);
}

export const electrical: ModelBuilder = (kit) => {
  const root = new Group();
  const busY = 1.25;
  const z = 0.16;
  const zc = z + 0.1; // Cables run down the front face of the busbar.

  // Busbar.
  root.add(at(kit.mesh(new BoxGeometry(2.7, 0.12, 0.16), kit.copper()), 0, busY, z));

  const cable = kit.steel(palette.steel700);
  const xMotor = -0.45;
  const xLamp = 0.85;

  // Feeder 1: busbar → breaker → motor.
  root.add(at(kit.mesh(cableGeometry(0.48), cable, false), xMotor, 0.95, zc));
  const breaker = new Group();
  breaker.add(kit.mesh(new RoundedBoxGeometry(0.46, 0.62, 0.3, 3, 0.04), kit.steel(palette.steel700)));
  const lever = kit.mesh(new RoundedBoxGeometry(0.1, 0.2, 0.12, 2, 0.02), kit.copper(palette.copper300));
  lever.rotation.x = -0.35;
  breaker.add(at(lever, 0, 0.06, 0.19));
  root.add(at(breaker, xMotor, 0.4, z));
  root.add(at(kit.mesh(cableGeometry(0.34), cable, false), xMotor, -0.08, zc));

  // Motor: finned body lying along x, on a foot, with a fan on its shaft.
  const motor = new Group();
  const body = kit.mesh(new CylinderGeometry(0.3, 0.3, 0.62, 32), kit.steel());
  body.rotation.z = Math.PI / 2;
  motor.add(body);
  const fin = kit.steel(palette.steel700);
  for (let i = -2; i <= 2; i++) {
    const ring = new Mesh(new TorusGeometry(0.305, 0.022, 8, 40), fin);
    ring.rotation.y = Math.PI / 2;
    motor.add(at(ring, i * 0.11, 0, 0));
  }
  motor.add(at(kit.mesh(new BoxGeometry(0.5, 0.12, 0.4), kit.steel(palette.steel700)), 0, -0.34, 0));
  const shaft = kit.mesh(new CylinderGeometry(0.035, 0.035, 0.22, 12), kit.steel(palette.steel300), false);
  shaft.rotation.z = Math.PI / 2;
  motor.add(at(shaft, 0.41, 0, 0));
  const fan = new Group();
  const bladeMat = kit.copper();
  for (let i = 0; i < 4; i++) {
    const blade = kit.mesh(new BoxGeometry(0.02, 0.36, 0.08), bladeMat);
    blade.rotation.x = (i * Math.PI) / 4;
    fan.add(blade);
  }
  motor.add(at(fan, 0.5, 0, 0));
  root.add(at(motor, xMotor, -0.55, zc));

  // Feeder 2: busbar → lamp in a cage.
  root.add(at(kit.mesh(cableGeometry(0.92), cable, false), xLamp, 0.73, zc));
  const lampGlow = kit.glow(palette.copper300);
  const lampDim = new Color(palette.copper300).multiplyScalar(0.72);
  const lampLit = new Color(palette.copper100);
  const bulb = new Mesh(new SphereGeometry(0.15, 24, 16), lampGlow);
  root.add(at(bulb, xLamp, 0.02, zc));
  const cageMat = kit.steel(palette.steel700);
  for (const r of [0, Math.PI / 2]) {
    const hoop = new Mesh(new TorusGeometry(0.2, 0.014, 8, 40), cageMat);
    hoop.rotation.y = r;
    root.add(at(hoop, xLamp, 0.02, zc));
  }
  root.add(at(kit.mesh(new CylinderGeometry(0.09, 0.11, 0.1, 20), cageMat), xLamp, 0.24, zc));

  // Current pulses: a bright core and a soft halo, travelling along each feeder.
  const routes = [
    { path: polyline([[-1.3, busY, zc], [xMotor, busY, zc], [xMotor, -0.24, zc]]), offset: 0 },
    { path: polyline([[-1.3, busY, zc], [xLamp, busY, zc], [xLamp, 0.17, zc]]), offset: 0.5 },
  ];
  const coreGeo = new SphereGeometry(0.05, 16, 12);
  const haloGeo = new SphereGeometry(0.11, 16, 12);
  const coreMat = kit.glow(palette.copper200);
  const haloMat = kit.glow(palette.copper300, 0.35);
  const pulses = routes.map(() => {
    const g = new Group();
    g.add(new Mesh(coreGeo, coreMat), new Mesh(haloGeo, haloMat));
    root.add(g);
    return g;
  });

  const period = 2.6; // Seconds per pulse on each route.
  return {
    root,
    frame: { center: [0, 0.18, 0.2], radius: 1.7, floor: -0.95 },
    update(t) {
      let lampHit = 0;
      routes.forEach((route, i) => {
        const u = (t / period + route.offset) % 1;
        const travel = Math.min(1, u / 0.7); // Travels for 70% of the period, then rests.
        const g = pulses[i];
        g.visible = u < 0.7;
        route.path.getPointAt(travel, g.position);
        if (i === 1) lampHit = smoothstep(0.62, 0.7, u) * (1 - smoothstep(0.7, 1, u));
      });
      // Lamp: dim copper, brightening as the pulse arrives.
      lampGlow.color.copy(lampDim).lerp(lampLit, lampHit);
      bulb.scale.setScalar(1 + lampHit * 0.08);
      fan.rotation.x = t * 9;
    },
  };
};
