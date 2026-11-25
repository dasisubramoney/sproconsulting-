/** Mechanical: a steel gear driving a copper pinion; the teeth truly mesh. */
import { CylinderGeometry, ExtrudeGeometry, Group, Path, Shape } from 'three';
import { at, palette, type ModelBuilder } from '../kit';

/** Gear outline: `teeth` trapezoid teeth on pitch radius `r`, an axle hole and optional windows. */
function gearShape(teeth: number, r: number, depth: number, hole: number, windows = 0): Shape {
  const tip = r + depth / 2;
  const root = r - depth / 2;
  const step = (Math.PI * 2) / teeth;
  const shape = new Shape();
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: Array<[number, number]> = [
      [root, a - step * 0.27],
      [tip, a - step * 0.13],
      [tip, a + step * 0.13],
      [root, a + step * 0.27],
    ];
    pts.forEach(([rad, ang], j) => {
      const x = Math.cos(ang) * rad;
      const y = Math.sin(ang) * rad;
      if (i === 0 && j === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  shape.holes.push(new Path().absarc(0, 0, hole, 0, Math.PI * 2, true));
  for (let i = 0; i < windows; i++) {
    const a = (i / windows) * Math.PI * 2 + Math.PI / windows;
    const wr = r * 0.53;
    shape.holes.push(new Path().absarc(Math.cos(a) * wr, Math.sin(a) * wr, r * 0.2, 0, Math.PI * 2, true));
  }
  return shape;
}

function gearGeometry(shape: Shape, thickness: number): ExtrudeGeometry {
  const g = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelOffset: -0.02, // Keep the bevel inside the outline, so meshing teeth never touch.
    bevelSegments: 2,
    curveSegments: 24,
  });
  g.translate(0, 0, -thickness / 2);
  return g;
}

export const mechanical: ModelBuilder = (kit) => {
  const root = new Group();

  const N1 = 18;
  const N2 = 11;
  const R1 = 1;
  const R2 = (R1 * N2) / N1; // Same tooth size, so the gears mesh.
  const theta = (38 * Math.PI) / 180; // Direction from the big gear to the pinion.
  const reach = R1 + R2;
  const pinionAt = { x: Math.cos(theta) * reach, y: Math.sin(theta) * reach };

  // Big gear (steel) and its hub.
  const big = new Group();
  big.add(kit.mesh(gearGeometry(gearShape(N1, R1, 0.2, 0.12, 5), 0.24), kit.steel()));
  root.add(big);

  // Pinion (copper).
  const pinion = new Group();
  pinion.add(kit.mesh(gearGeometry(gearShape(N2, R2, 0.2, 0.08), 0.28), kit.copper()));
  root.add(at(pinion, pinionAt.x, pinionAt.y, 0.02));

  // Axles and hub caps (they don't turn, so they read as the frame).
  const axleMat = kit.steel(palette.steel700);
  const capMat = kit.copper(palette.copper200);
  for (const [x, y, r] of [
    [0, 0, 0.12],
    [pinionAt.x, pinionAt.y, 0.08],
  ] as const) {
    const axle = kit.mesh(new CylinderGeometry(r, r, 0.42, 28), axleMat);
    axle.rotation.x = Math.PI / 2;
    root.add(at(axle, x, y, 0));
    const cap = kit.mesh(new CylinderGeometry(r * 1.55, r * 1.55, 0.07, 6), capMat);
    cap.rotation.x = Math.PI / 2;
    root.add(at(cap, x, y, 0.2));
  }

  // Meshing phase: a tooth of the big gear sits in a gap of the pinion along theta.
  const big0 = theta;
  const pinion0 = theta + Math.PI - Math.PI / N2;
  const speed = 0.42; // rad/s on the big gear.

  return {
    root,
    frame: { center: [0.45, 0.3, 0], radius: 1.95, floor: -1.2 },
    view: { azimuth: 24, elevation: 14 },
    update(t) {
      const a = speed * t;
      big.rotation.z = big0 + a;
      pinion.rotation.z = pinion0 - a * (N1 / N2);
    },
  };
};
