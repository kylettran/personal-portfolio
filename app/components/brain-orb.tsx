"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const BOUNDS = {
  x: 1.6,
  y: 1.25,
  z: 1.6,
};

const LOBES = [
  { c: new THREE.Vector3(-0.6, 0.1, 0), r: new THREE.Vector3(1.05, 0.85, 0.95) },
  { c: new THREE.Vector3(0.6, 0.1, 0), r: new THREE.Vector3(1.05, 0.85, 0.95) },
  { c: new THREE.Vector3(0.0, -0.6, -0.55), r: new THREE.Vector3(0.6, 0.45, 0.55) },
];

function lobeValue(x: number, y: number, z: number, lobe: (typeof LOBES)[number]) {
  const dx = (x - lobe.c.x) / lobe.r.x;
  const dy = (y - lobe.c.y) / lobe.r.y;
  const dz = (z - lobe.c.z) / lobe.r.z;
  return dx * dx + dy * dy + dz * dz;
}

function brainField(x: number, y: number, z: number) {
  return Math.min(
    lobeValue(x, y, z, LOBES[0]),
    lobeValue(x, y, z, LOBES[1]),
    lobeValue(x, y, z, LOBES[2]),
  );
}

function randomPointInBounds() {
  return new THREE.Vector3(
    (Math.random() * 2 - 1) * BOUNDS.x,
    (Math.random() * 2 - 1) * BOUNDS.y,
    (Math.random() * 2 - 1) * BOUNDS.z,
  );
}

function foldPerturb(p: THREE.Vector3) {
  const wave =
    Math.sin(p.y * 6) * 0.08 +
    Math.cos(p.x * 5.5) * 0.06 +
    Math.sin((p.z + p.x) * 4.2) * 0.05;
  return p.clone().addScaledVector(p.clone().normalize(), wave);
}

function sampleBrainPoints(count: number, minShell = 0.72, maxShell = 1.05) {
  const positions: number[] = [];
  const colors: number[] = [];
  const base = new THREE.Color("#1f2937");
  const accent = new THREE.Color("#7dd3fc");

  let attempts = 0;
  while (positions.length / 3 < count && attempts < count * 20) {
    const p = randomPointInBounds();
    const value = brainField(p.x, p.y, p.z);
    attempts += 1;
    if (value > maxShell || value < minShell) continue;

    const folded = foldPerturb(p);
    positions.push(folded.x, folded.y, folded.z);

    const t = THREE.MathUtils.clamp((1.0 - value) * 1.8, 0, 1);
    const color = base.clone().lerp(accent, t);
    colors.push(color.r, color.g, color.b);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

function sampleBrainRim(count: number) {
  return sampleBrainPoints(count, 0.95, 1.05);
}

function sampleBrainVolume(count: number) {
  const points: THREE.Vector3[] = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 30) {
    const p = randomPointInBounds();
    const value = brainField(p.x, p.y, p.z);
    attempts += 1;
    if (value <= 0.95) {
      points.push(p);
    }
  }
  return points;
}

function buildFiberGeometry(anchors: THREE.Vector3[], fibers = 160, segments = 14) {
  const positions: number[] = [];
  const colors: number[] = [];
  const palette = ["#9ef0ff", "#7a8cff", "#d89bff", "#66e3c4", "#ffd38a"];

  for (let i = 0; i < fibers; i += 1) {
    const start = anchors[Math.floor(Math.random() * anchors.length)];
    const end = anchors[Math.floor(Math.random() * anchors.length)];
    const mid = start
      .clone()
      .lerp(end, 0.5)
      .add(new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.6));
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);

    const color = new THREE.Color(palette[i % palette.length]);
    const points = curve.getPoints(segments);
    for (let j = 0; j < points.length - 1; j += 1) {
      const a = points[j];
      const b = points[j + 1];
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function buildOutlineGeometry(points: THREE.Vector3[], links = 520, maxDist = 0.85) {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color("#e6f5ff");

  for (let i = 0; i < links; i += 1) {
    const start = points[Math.floor(Math.random() * points.length)];
    let end = points[Math.floor(Math.random() * points.length)];
    let attempts = 0;
    while (start.distanceTo(end) > maxDist && attempts < 8) {
      end = points[Math.floor(Math.random() * points.length)];
      attempts += 1;
    }
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function buildSkeletonGeometry(points: THREE.Vector3[], links = 220) {
  const positions: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color("#8bd7ff");

  for (let i = 0; i < links; i += 1) {
    const start = points[Math.floor(Math.random() * points.length)];
    let end = points[Math.floor(Math.random() * points.length)];
    if (start === end) {
      end = points[Math.floor(Math.random() * points.length)];
    }
    positions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function applyOpacity(object: THREE.Object3D, opacity: number) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        if (mat) {
          mat.transparent = true;
          mat.opacity = opacity;
        }
      });
    }
  });
}

function alignAndScaleModels(
  primary: THREE.Object3D,
  secondary: THREE.Object3D,
  viewport: { width: number; height: number },
) {
  const target = 0.8 * Math.min(viewport.width, viewport.height);

  const primaryBox = new THREE.Box3().setFromObject(primary);
  const primarySize = new THREE.Vector3();
  primaryBox.getSize(primarySize);
  const primaryMax = Math.max(primarySize.x, primarySize.y, primarySize.z);
  const primaryScale = primaryMax > 0 ? target / primaryMax : 1;
  primary.scale.setScalar(primaryScale);
  primary.updateMatrixWorld(true);
  const primaryCenteredBox = new THREE.Box3().setFromObject(primary);
  const primaryCenter = new THREE.Vector3();
  primaryCenteredBox.getCenter(primaryCenter);
  primary.position.sub(primaryCenter);
  primary.updateMatrixWorld(true);

  const secondaryBox = new THREE.Box3().setFromObject(secondary);
  const secondarySize = new THREE.Vector3();
  secondaryBox.getSize(secondarySize);
  const secondaryMax = Math.max(secondarySize.x, secondarySize.y, secondarySize.z);
  const secondaryScale = secondaryMax > 0 ? target / secondaryMax : 1;
  secondary.scale.setScalar(secondaryScale);
  secondary.updateMatrixWorld(true);
  const secondaryCenteredBox = new THREE.Box3().setFromObject(secondary);
  const secondaryCenter = new THREE.Vector3();
  secondaryCenteredBox.getCenter(secondaryCenter);
  secondary.position.sub(secondaryCenter);
  secondary.updateMatrixWorld(true);
}

function BrainScene({
  primaryOpacity,
  secondaryOpacity,
}: {
  primaryOpacity: number;
  secondaryOpacity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const primaryGltf = useGLTF("/models/brain_glb.glb");
  const secondaryGltf = useGLTF("/models/brain_point_cloud.glb");
  const { viewport } = useThree();

  const primary = useMemo(() => primaryGltf.scene.clone(true), [primaryGltf.scene]);
  const secondary = useMemo(() => secondaryGltf.scene.clone(true), [secondaryGltf.scene]);

  useEffect(() => {
    alignAndScaleModels(primary, secondary, viewport);
  }, []);

  useFrame(() => {
    applyOpacity(primary, primaryOpacity);
    applyOpacity(secondary, secondaryOpacity);
  });

  return (
    <group ref={groupRef}>
      <primitive object={secondary} />
      <primitive object={primary} />
    </group>
  );
}

export function BrainOrb() {
  const controlsRef = useRef<any>(null);
  const scrollBoost = useRef(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fade, setFade] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hintTimeout = useRef<number | null>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      const delta = Math.abs(current - last);
      scrollBoost.current = Math.min(2.5, delta / 120);
      last = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (hasInteracted) return;
    hintTimeout.current = window.setTimeout(() => {
      setShowHint(true);
    }, 2000);
    return () => {
      if (hintTimeout.current) {
        window.clearTimeout(hintTimeout.current);
      }
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (!hasInteracted) return;
    if (rafRef.current) return;
    const hold = 5000;
    const fadeDuration = 1200;
    const total = hold * 2 + fadeDuration * 2;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) % total;
      let fadeValue = 0;
      if (elapsed < hold) {
        fadeValue = 0;
      } else if (elapsed < hold + fadeDuration) {
        fadeValue = (elapsed - hold) / fadeDuration;
      } else if (elapsed < hold + fadeDuration + hold) {
        fadeValue = 1;
      } else {
        fadeValue = 1 - (elapsed - hold - fadeDuration - hold) / fadeDuration;
      }
      setFade(fadeValue);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [hasInteracted]);

  function ControlsRig() {
    useFrame(() => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = !hasInteracted;
      }
    });
    return null;
  }

  return (
    <div className="not-prose w-full">
      <div
        className={`relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 sm:p-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {showHint && !hasInteracted ? (
          <div className="pointer-events-none absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            click and drag
          </div>
        ) : null}
        <Canvas
          className="w-full"
          style={{ height: "clamp(420px, 68vh, 800px)" }}
          dpr={1}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          camera={{ position: [0, 0, 5.4], fov: 45 }}
        >
          <color attach="background" args={["#05070b"]} />
          <ambientLight intensity={1.0} />
          <directionalLight intensity={1.4} position={[4, 5, 6]} />
          <directionalLight intensity={0.8} position={[-4, -2, -3]} />
          <Suspense fallback={null}>
            <BrainScene
              secondaryOpacity={hasInteracted ? 1 - fade : 1}
              primaryOpacity={hasInteracted ? fade : 0}
            />
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            autoRotate
            autoRotateSpeed={0.4}
            target={[0, 0, 0]}
            onStart={() => {
              setHasInteracted(true);
              setShowHint(false);
              setIsDragging(true);
            }}
            onEnd={() => setIsDragging(false)}
          />
          <ControlsRig />
        </Canvas>
      </div>
    </div>
  );
}
