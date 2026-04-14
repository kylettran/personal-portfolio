'use client';

import { useRef, useEffect } from 'react';
import { tools } from '@/lib/tools';

const RADIUS = 125;

// Evenly distribute N points on a sphere surface using the Fibonacci spiral method
function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // -1 to 1
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

// Apply Y-axis then X-axis rotation to a 3D point
function rotatePoint(
  [x, y, z]: [number, number, number],
  rx: number,
  ry: number
): [number, number, number] {
  // Rotate around Y axis
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // Rotate around X axis
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  return [x1, y2, z2];
}

const BASE_POSITIONS = fibonacciSphere(tools.length, RADIUS);

export function TechSphere() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotX = useRef(0.25); // slight downward tilt on load
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function tick() {
      // Auto-rotate when idle
      if (!isDragging.current && !prefersReduced) {
        rotY.current += 0.006;
      }

      // Inertia decay
      velX.current *= 0.88;
      velY.current *= 0.88;
      if (!isDragging.current) {
        rotX.current += velX.current;
        rotY.current += velY.current;
      }

      // Clamp X so it doesn't flip over poles
      rotX.current = Math.max(-0.65, Math.min(0.65, rotX.current));

      // Update each icon's position, scale, and opacity via direct DOM access
      BASE_POSITIONS.forEach((pos, i) => {
        const el = itemRefs.current[i];
        if (!el) return;

        const [x, y, z] = rotatePoint(pos, rotX.current, rotY.current);

        // depth 0 = back of sphere, 1 = front
        const depth = (z + RADIUS) / (RADIUS * 2);
        const scale = 0.45 + depth * 0.55;
        const opacity = 0.08 + depth * 0.92;

        el.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px)) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velX.current = 0;
    velY.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    rotY.current += dx * 0.012;
    rotX.current += dy * 0.012;

    // Store as inertia for when pointer is released
    velY.current = dx * 0.012;
    velX.current = dy * 0.012;

    lastPointer.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  const containerSize = RADIUS * 2 + 140;

  return (
    <div className="flex justify-center">
      <div
        className="relative cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ width: '100%', maxWidth: containerSize, height: containerSize }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Sphere glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle at 38% 35%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 100px rgba(255,255,255,0.015) inset',
          }}
        />

        {/* Floating icon cards — positioned via rAF */}
        {tools.map((tool, i) => (
          <div
            key={tool.name}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="absolute pointer-events-none"
            style={{ top: '50%', left: '50%', willChange: 'transform, opacity' }}
          >
            <div className="flex flex-col items-center gap-1 rounded-xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-sm px-3 py-2 text-center shadow-lg">
              <span className="text-base leading-none">{tool.emoji}</span>
              <span className="text-[9px] font-medium text-zinc-300 whitespace-nowrap tracking-wide">
                {tool.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
