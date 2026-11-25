/**
 * Shared building blocks for the service-page 3D models (src/three/models/*):
 * brand materials, blueprint outlines and small geometry helpers.
 */
import {
  BufferGeometry,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Vector3,
  type ColorRepresentation,
} from 'three';

// Brand colours, mirrored from tailwind.config.ts (keep in step with it).
export const palette = {
  ink: '#2B3238',
  steel100: '#E6E8EA',
  steel200: '#D5DADF',
  steel300: '#A9B0B6',
  steel500: '#636F7B',
  steel700: '#4D5B68',
  copper100: '#D8B492',
  copper200: '#D2A881',
  copper300: '#CB9C70',
  copper500: '#B37B48',
  water: '#7E97A9',
  water300: '#B4C4D0',
} as const;

/** A material that fades in with the entrance; `opacity` is its resting opacity. */
interface Fading {
  material: Material;
  opacity: number;
  /** Stays transparent after the entrance (glass, water, sheet metal you can see into). */
  seeThrough: boolean;
}

/**
 * Materials and outlines for one model. Every material made here is tracked, so the
 * stage can fade the solids in over the blueprint outlines and dispose of everything.
 */
export class Kit {
  readonly fading: Fading[] = [];
  /** Outline materials and their resting opacity once the solids are in. */
  readonly outlines: Array<{ material: LineBasicMaterial; rest: number }> = [];

  private track<M extends Material>(material: M, seeThrough = false): M {
    this.fading.push({ material, opacity: material.opacity, seeThrough });
    material.transparent = true;
    return material;
  }

  /** Matte painted steel. */
  steel(color: ColorRepresentation = palette.steel500): MeshStandardMaterial {
    return this.track(new MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.42 }));
  }

  /** Brushed copper / brass. */
  copper(color: ColorRepresentation = palette.copper500): MeshStandardMaterial {
    return this.track(new MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.32 }));
  }

  /** Light powder-coated parts (the tank plinth). */
  panel(color: ColorRepresentation = palette.steel100): MeshStandardMaterial {
    return this.track(new MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.7 }));
  }

  /** Clear shells (tank wall, duct you can see into). Drawn after the solids. */
  glass(opacity = 0.2, color: ColorRepresentation = palette.steel100): MeshStandardMaterial {
    const m = new MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.15, opacity, depthWrite: false });
    return this.track(m, true);
  }

  /** Water body. */
  water(opacity = 0.82, color: ColorRepresentation = palette.water): MeshStandardMaterial {
    return this.track(new MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.18, opacity }), true);
  }

  /** Unlit glowing parts (current pulse, airflow, lamp). */
  glow(color: ColorRepresentation = palette.copper300, opacity = 1): MeshBasicMaterial {
    return this.track(new MeshBasicMaterial({ color: new Color(color), opacity }), opacity < 1);
  }

  /**
   * Mesh with a blueprint outline (steel-700 hairline) along its hard edges. The outline
   * draws first, then mostly fades as the solid comes in; 'strong' keeps it (see-through
   * shells, where the outline is what shows the shape).
   */
  mesh(geometry: BufferGeometry, material: Material, outlined: boolean | 'strong' = true): Mesh {
    const mesh = new Mesh(geometry, material);
    if (outlined) this.outline(mesh, outlined === 'strong' ? 0.6 : 0.16);
    return mesh;
  }

  outline(mesh: Mesh, rest = 0.16, thresholdAngle = 30): void {
    const material = new LineBasicMaterial({ color: palette.steel700, transparent: true, opacity: 0 });
    this.outlines.push({ material, rest });
    const lines = new LineSegments(new EdgesGeometry(mesh.geometry, thresholdAngle), material);
    lines.raycast = () => {};
    mesh.add(lines);
  }
}

/** Places an object and returns it, so models read top to bottom. */
export function at<T extends Object3D>(object: T, x: number, y: number, z: number): T {
  object.position.set(x, y, z);
  return object;
}

/** Deterministic random numbers, so every visit draws the same spray. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const easeOut = (t: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/** Scratch vectors for per-frame maths (no allocation in the loop). */
export const tmp = { a: new Vector3(), b: new Vector3(), up: new Vector3(0, 1, 0) };

/** One animated model: its root object, how to frame it, and a per-frame update (seconds). */
export interface Model {
  root: Object3D;
  /**
   * Bounding sphere of the whole motion (centre and radius), the floor height for the
   * contact shadow, and optionally where the shadow sits (x, z) if not under the centre.
   */
  frame: { center: [number, number, number]; radius: number; floor: number; shadowAt?: [number, number] };
  /** Camera direction in degrees (default azimuth 32, elevation 18). */
  view?: { azimuth: number; elevation: number };
  update(t: number, dt: number): void;
}

export type ModelBuilder = (kit: Kit) => Model;
