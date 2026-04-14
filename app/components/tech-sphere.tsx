'use client';

import { useRef, useEffect, useState } from 'react';
import { tools } from '@/lib/tools';

function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return points;
}

function rotatePoint(
  [x, y, z]: [number, number, number],
  rx: number,
  ry: number
): [number, number, number] {
  const cosY = Math.cos(ry), sinY = Math.sin(ry);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(rx), sinX = Math.sin(rx);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  return [x1, y2, z2];
}

// Pick radius based on viewport width — called client-side only
function getRadius(): number {
  if (typeof window === 'undefined') return 120;
  if (window.innerWidth >= 1024) return 185;
  if (window.innerWidth >= 640)  return 150;
  return 110;
}

export function TechSphere() {
  const [radius, setRadius] = useState(120); // safe SSR default
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const posRef     = useRef<[number, number, number][]>([]);
  const rotX       = useRef(0.25);
  const rotY       = useRef(0);
  const velX       = useRef(0);
  const velY       = useRef(0);
  const isDragging = useRef(false);
  const lastPtr    = useRef({ x: 0, y: 0 });
  const rafRef     = useRef<number>(0);

  // Set responsive radius on mount and window resize
  useEffect(() => {
    function update() {
      const r = getRadius();
      setRadius(r);
      posRef.current = fibonacciSphere(tools.length, r);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Animation loop — restarts whenever radius changes
  useEffect(() => {
    if (!posRef.current.length) return;
    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cancelAnimationFrame(rafRef.current);

    function tick() {
      if (!isDragging.current && !prefersReduced) rotY.current += 0.006;
      velX.current *= 0.88;
      velY.current *= 0.88;
      if (!isDragging.current) {
        rotX.current += velX.current;
        rotY.current += velY.current;
      }
      rotX.current = Math.max(-0.65, Math.min(0.65, rotX.current));

      posRef.current.forEach((pos, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const [x, y, z] = rotatePoint(pos, rotX.current, rotY.current);
        const depth   = (z + radius) / (radius * 2);
        const scale   = 0.45 + depth * 0.55;
        const opacity = 0.08 + depth * 0.92;
        el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
        el.style.opacity   = opacity.toFixed(3);
        el.style.zIndex    = String(Math.round(depth * 100));
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [radius]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    velX.current = velY.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    rotY.current += dx * 0.012;
    rotX.current += dy * 0.012;
    velY.current = dx * 0.012;
    velX.current = dy * 0.012;
    lastPtr.current = { x: e.clientX, y: e.clientY };
  }

  const containerSize = radius * 2 + 140;

  return (
    <div className="flex justify-center">
      <div
        className="relative cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ width: '100%', maxWidth: containerSize, height: containerSize }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => { isDragging.current = false; }}
        onPointerLeave={() => { isDragging.current = false; }}
      >
        {/* Sphere glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: radius * 2,
            height: radius * 2,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at 38% 35%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 45%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />

        {/* Icon cards */}
        {tools.map((tool, i) => (
          <div
            key={tool.name}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="absolute pointer-events-none"
            style={{ top: '50%', left: '50%', willChange: 'transform, opacity' }}
          >
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-sm px-3 py-2 text-center shadow-lg">
              {tool.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={tool.logo}
                  alt={tool.name}
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              ) : (
                <span className="text-lg leading-none">{tool.emoji}</span>
              )}
              <span className="text-[10px] font-medium text-zinc-200 whitespace-nowrap tracking-wide">
                {tool.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
