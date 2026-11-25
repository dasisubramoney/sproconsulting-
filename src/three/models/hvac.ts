/**
 * HVAC: a see-through duct run elbowing down into a louvred ceiling diffuser. Copper
 * airflow streaks travel the duct, turn the elbow and fan out of the diffuser.
 */
import {
  BoxGeometry,
  CapsuleGeometry,
  CurvePath,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  LineCurve3,
  Matrix4,
  QuadraticBezierCurve3,
  Quaternion,
  Vector3,
} from 'three';
import { at, palette, seeded, smoothstep, tmp, type Kit, type ModelBuilder } from '../kit';

const COUNT = 64;
const SPEED = 0.85; // Units per second.
const EXIT = 1.0; // Length of the path outside the diffuser.

/** A square frame of four bars lying flat (y up): outer size `w`, bar width `b`. */
function flatFrame(kit: Kit, w: number, b: number, h: number, material: ReturnType<Kit['steel']>): Group {
  const g = new Group();
  const half = (w - b) / 2;
  g.add(at(kit.mesh(new BoxGeometry(w, h, b), material), 0, 0, half));
  g.add(at(kit.mesh(new BoxGeometry(w, h, b), material), 0, 0, -half));
  g.add(at(kit.mesh(new BoxGeometry(b, h, w - 2 * b), material), half, 0, 0));
  g.add(at(kit.mesh(new BoxGeometry(b, h, w - 2 * b), material), -half, 0, 0));
  return g;
}

/** A collar around the duct: a square ring standing across the duct axis. */
function collar(kit: Kit, size: number, material: ReturnType<Kit['steel']>, axis: 'x' | 'y'): Group {
  const g = flatFrame(kit, size, 0.06, 0.05, material);
  if (axis === 'x') g.rotation.z = Math.PI / 2;
  return g;
}

export const hvac: ModelBuilder = (kit) => {
  const root = new Group();
  const shell = kit.glass(0.2, palette.steel200);
  const metal = kit.steel(palette.steel500);

  const y = 0.95; // Duct centreline.
  const x = 0.75; // Drop centreline.
  const h = 0.55; // Duct height (y) and width (x of the drop).
  const d = 0.6; // Duct depth (z).

  // Horizontal run and the drop, as see-through sheet metal with strong outlines.
  root.add(at(kit.mesh(new BoxGeometry(1.6 + x + h / 2, h, d), shell, 'strong'), (x + h / 2 - 1.6) / 2, y, 0));
  root.add(at(kit.mesh(new BoxGeometry(h, 0.85, d), shell, 'strong'), x, y - h / 2 - 0.425, 0));
  for (const cx of [-1.6, -0.55]) root.add(at(collar(kit, 0.74, metal, 'x'), cx, y, 0));
  root.add(at(collar(kit, 0.74, metal, 'y'), x, 0.2, 0));

  // Diffuser: stepped louvre frames under the drop.
  const louvre = kit.steel(palette.steel300);
  root.add(at(flatFrame(kit, 1.2, 0.12, 0.05, louvre), x, -0.24, 0));
  root.add(at(flatFrame(kit, 0.92, 0.1, 0.04, louvre), x, -0.29, 0));
  root.add(at(flatFrame(kit, 0.66, 0.09, 0.04, louvre), x, -0.33, 0));
  root.add(at(kit.mesh(new BoxGeometry(0.4, 0.03, 0.4), louvre), x, -0.37, 0));

  // Airflow path inside the duct (the exit beyond the diffuser is worked out per streak).
  const path = new CurvePath<Vector3>();
  path.add(new LineCurve3(new Vector3(-1.6, y, 0), new Vector3(x - 0.25, y, 0)));
  path.add(new QuadraticBezierCurve3(new Vector3(x - 0.25, y, 0), new Vector3(x, y, 0), new Vector3(x, y - 0.25, 0)));
  path.add(new LineCurve3(new Vector3(x, y - 0.25, 0), new Vector3(x, -0.3, 0)));
  const inside = path.getLength();
  const total = inside + EXIT;
  const end = new Vector3(x, -0.3, 0);

  const rand = seeded(11);
  const streaks = Array.from({ length: COUNT }, () => ({
    phase: rand() * total,
    lane: (rand() - 0.5) * 0.34, // Offset across the duct, in the plane of the bend.
    depth: (rand() - 0.5) * 0.4, // Offset in z.
    heading: Math.floor(rand() * 4) * (Math.PI / 2) + (rand() - 0.5) * 0.9,
    size: 0.75 + rand() * 0.5,
  }));

  const air = new InstancedMesh(new CapsuleGeometry(0.016, 0.13, 4, 8), kit.glow(palette.copper300), COUNT);
  air.instanceMatrix.setUsage(DynamicDrawUsage);
  air.frustumCulled = false;
  root.add(air);

  const m = new Matrix4();
  const p = new Vector3();
  const dir = new Vector3();
  const s = new Vector3();
  const q = new Quaternion();

  return {
    root,
    frame: { center: [-0.25, 0.4, 0], radius: 1.9, floor: -0.85 },
    view: { azimuth: 34, elevation: 20 },
    update(t) {
      streaks.forEach((k, i) => {
        const dist = (t * SPEED + k.phase) % total;
        let fade = smoothstep(0, 0.35, dist);
        if (dist < inside) {
          const u = dist / inside;
          path.getPointAt(u, p);
          // Tangent from two nearby points (CurvePath.getTangentAt allocates per call).
          path.getPointAt(Math.min(1, u + 0.002), dir);
          path.getPointAt(Math.max(0, u - 0.002), tmp.b);
          dir.sub(tmp.b).normalize();
          // Normal in the plane of the bend (the path stays in z = 0), plus a z offset.
          tmp.a.set(-dir.y, dir.x, 0).multiplyScalar(k.lane);
          p.add(tmp.a);
          p.z += k.depth;
        } else {
          const e = (dist - inside) / EXIT;
          const out = e * 1.05;
          const spread = Math.min(1, e * 3);
          p.set(
            end.x + Math.cos(k.heading) * out + k.lane * (1 - spread),
            end.y - 0.12 * e - 0.35 * e * e,
            end.z + Math.sin(k.heading) * out + k.depth * (1 - spread),
          );
          dir.set(Math.cos(k.heading) * 1.05, -0.12 - 0.7 * e, Math.sin(k.heading) * 1.05).normalize();
          fade *= 1 - smoothstep(0.45, 1, e);
        }
        q.setFromUnitVectors(tmp.up, dir);
        s.set(k.size * fade, k.size * (0.4 + 0.6 * fade), k.size * fade);
        air.setMatrixAt(i, m.compose(p, q, s));
      });
      air.instanceMatrix.needsUpdate = true;
    },
  };
};
