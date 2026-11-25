/**
 * The 3D stage for a service page's hero model (lazy chunk; three.js never ships in the
 * main bundle). Loaded by <ServiceModel> only on wide screens with motion on and WebGL
 * available; the SVG schematic stays in place until the first frame is drawn.
 *
 * Entrance ("blueprint to reality"): the steel outlines draw in, the solids fade up
 * through them, and the outlines settle to a faint hairline. The model then tilts a
 * little towards the pointer (fine pointers only) and sways slowly.
 *
 * Runs only while the canvas is on screen and the tab is visible. Resolution is
 * capped at 2× device pixels. Everything is disposed on unmount.
 */
import {
  CanvasTexture,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  WebGLRenderer,
  type Material,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { ServiceSlug } from '@/config/routes';
import { Kit, easeOut, palette, smoothstep, type ModelBuilder } from './kit';
import { electrical } from './models/electrical';
import { mechanical } from './models/mechanical';
import { fire } from './models/fire';
import { hvac } from './models/hvac';
import { wetServices } from './models/wetServices';

const builders: Record<ServiceSlug, ModelBuilder> = {
  electrical,
  mechanical,
  fire,
  hvac,
  'wet-services': wetServices,
};

/** Entrance timings, seconds. */
const OUTLINE_IN = 0.5;
const SOLID_FROM = 0.45;
const SOLID_TO = 1.35;
const SETTLE_FROM = 1.3;
const SETTLE_TO = 2;
const FOV = 28;

export interface StageCallbacks {
  /** The first frame is on screen: the SVG fallback can go. */
  onReady(): void;
  /** WebGL is unavailable or the context was lost: keep (or bring back) the SVG. */
  onFail(): void;
}

export interface Stage {
  dispose(): void;
}

/** Soft round contact shadow under the model. */
function shadowTexture(): CanvasTexture {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(43,50,56,0.55)');
    g.addColorStop(1, 'rgba(43,50,56,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new CanvasTexture(c);
}

export function createStage(host: HTMLElement, slug: ServiceSlug, callbacks: StageCallbacks): Stage {
  const canvas = document.createElement('canvas');
  canvas.className = 'block h-full w-full';

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    callbacks.onFail();
    return { dispose() {} };
  }
  host.appendChild(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NeutralToneMapping;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.85;
  const key = new DirectionalLight(0xffffff, 1.7);
  key.position.set(-3, 5, 4);
  scene.add(key, new HemisphereLight(0xffffff, palette.steel200, 0.55));

  // pivot (tilt, sway, entrance scale) > offset (centres the model) > model.
  const kit = new Kit();
  const model = builders[slug](kit);
  const pivot = new Group();
  const offset = new Group();
  const [cx, cy, cz] = model.frame.center;
  offset.position.set(-cx, -cy, -cz);
  offset.add(model.root);
  pivot.add(offset);
  scene.add(pivot);

  const shadowMap = shadowTexture();
  const shadowMat = new MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false, opacity: 0 });
  const shadow = new Mesh(new PlaneGeometry(model.frame.radius * 1.9, model.frame.radius * 1.1), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  const [sx, sz] = model.frame.shadowAt ?? [cx, cz];
  shadow.position.set(sx, model.frame.floor, sz);
  offset.add(shadow);

  // Camera on a fixed direction, far enough back to fit the model's bounding sphere.
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  const az = ((model.view?.azimuth ?? 32) * Math.PI) / 180;
  const el = ((model.view?.elevation ?? 18) * Math.PI) / 180;
  const distance = (model.frame.radius / Math.sin(((FOV / 2) * Math.PI) / 180)) * 1.02;
  camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(distance);
  camera.lookAt(0, 0, 0);

  const resize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rectDirty = true;
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  // Pointer position is stored on move; the host's rect is read at most once per frame,
  // and only after a scroll or resize (no layout read per pointer event).
  let rectDirty = true;
  let rect = { cx: 0, cy: 0 };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Pointer tilt (fine pointers only), eased towards its target each frame.
  const target = { yaw: 0, pitch: 0 };
  const pointer = { x: 0, y: 0, moved: false };
  const onPointer = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.moved = true;
  };
  const onScroll = () => {
    rectDirty = true;
    pointer.moved = true;
  };
  const aim = () => {
    if (!pointer.moved) return;
    pointer.moved = false;
    if (rectDirty) {
      const r = host.getBoundingClientRect();
      rect = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      rectDirty = false;
    }
    const nx = (pointer.x - rect.cx) / (window.innerWidth / 2);
    const ny = (pointer.y - rect.cy) / (window.innerHeight / 2);
    target.yaw = Math.max(-1, Math.min(1, nx)) * 0.22;
    target.pitch = Math.max(-1, Math.min(1, ny)) * 0.08;
  };
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Entrance.
  let clock = 0;
  let settled = false;
  const entrance = (time: number) => {
    const outline = smoothstep(0, OUTLINE_IN, time);
    const settle = smoothstep(SETTLE_FROM, SETTLE_TO, time);
    for (const o of kit.outlines) o.material.opacity = outline * (0.85 + (o.rest - 0.85) * settle);
    const solid = smoothstep(SOLID_FROM, SOLID_TO, time);
    for (const f of kit.fading) f.material.opacity = f.opacity * solid;
    shadowMat.opacity = 0.5 * solid;
    pivot.scale.setScalar(0.94 + 0.06 * easeOut(time / SOLID_TO));
    if (time >= SETTLE_TO) {
      // Opaque parts go back to opaque rendering (correct depth sorting).
      for (const f of kit.fading) {
        f.material.opacity = f.opacity;
        if (!f.seeThrough) {
          f.material.transparent = false;
          f.material.needsUpdate = true;
        }
      }
      settled = true;
    }
  };

  let last = 0;
  let ready = false;
  const frame = (now: number) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    clock += dt;
    model.update(clock, dt);
    if (!settled) entrance(clock);
    aim();

    const ease = 1 - Math.exp(-dt * 4);
    const sway = Math.sin(clock * 0.35) * 0.06;
    pivot.rotation.y += (target.yaw + sway - pivot.rotation.y) * ease;
    pivot.rotation.x += (target.pitch - pivot.rotation.x) * ease;

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      callbacks.onReady();
    }
  };

  // Play only while on screen and the tab is visible.
  let onScreen = false;
  const sync = () => {
    const run = onScreen && !document.hidden;
    if (!run) last = 0;
    renderer.setAnimationLoop(run ? frame : null);
  };
  const io = new IntersectionObserver((entries) => {
    onScreen = entries[entries.length - 1].isIntersecting; // Latest state wins.
    sync();
  });
  io.observe(host);
  document.addEventListener('visibilitychange', sync);

  const onLost = (e: Event) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    callbacks.onFail();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('webglcontextlost', onLost);
      const materials = new Set<Material>();
      scene.traverse((obj) => {
        const o = obj as Partial<InstancedMesh>;
        if (o.isInstancedMesh) o.dispose?.();
        o.geometry?.dispose();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((x) => materials.add(x));
        else if (m) materials.add(m);
      });
      materials.forEach((m) => m.dispose());
      shadowMap.dispose();
      envTarget.dispose();
      room.dispose();
      pmrem.dispose();
      // Free the GPU context now rather than at garbage collection (repeat visits).
      renderer.forceContextLoss();
      renderer.dispose();
      canvas.remove();
    },
  };
}
