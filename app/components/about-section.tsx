'use client';

import Image from 'next/image';

const tagCards = [
  { emoji: '🔬', label: 'UCI', sub: 'BS · Biological Sciences' },
  { emoji: '📖', label: 'UCI', sub: 'MS · Education Sciences' },
  { emoji: '🏗', label: 'Lynx Combinator', sub: 'Founder' },
  { emoji: '✦',  label: 'Coming Soon', sub: '···' },
];

const activities = [
  { emoji: '♟️', label: 'Chess' },
  { emoji: '🎾', label: 'Tennis' },
  { emoji: '🤖', label: 'AI / Claude' },
];

const craftTools = [
  'Claude', 'Next.js', 'TypeScript', 'Tailwind', 'Git',
  'Vercel', 'React', 'GitHub', 'Cursor', 'Figma', 'n8n',
];

export function AboutSection() {
  return (
    <section id="about" className="w-full px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-5xl">

        {/*
          Desktop: 5-column bento grid
          Row 1: Name(2) | Tags(1) | Portrait(2)
          Row 2: Mindset(1) | Activity(2) | Craft(2)
        */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">

          {/* ── Name card ──────────────────────────────── col-span-2 */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 min-h-[220px] md:min-h-[280px]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">
                AI-Native Founder &amp; Builder
              </p>
              <h2 className="font-display text-5xl sm:text-6xl font-bold leading-none text-white">
                KYLE<br />TRAN
              </h2>
            </div>
            <p className="text-xs text-zinc-600 mt-4">Irvine, California · PST</p>
          </div>

          {/* ── Tag column ─────────────────────────────── col-span-1 */}
          <div className="md:col-span-1 grid grid-cols-2 gap-2 md:flex md:flex-col">
            {tagCards.map((t) => (
              <div
                key={t.label + t.sub}
                className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-3 md:flex-1"
              >
                <span className="text-base leading-none">{t.emoji}</span>
                <p className="mt-1.5 text-xs font-semibold text-white leading-tight">{t.label}</p>
                <p className="mt-0.5 text-[9px] text-zinc-500 leading-tight">{t.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Portrait ───────────────────────────────── col-span-2 */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-white/10 min-h-[260px] md:min-h-0">
            <Image
              src="/portrait.JPEG"
              alt="Kyle Tran"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top"
              priority
            />
          </div>

          {/* ── Mindset card ───────────────────────────── col-span-1 */}
          <div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">Mindset</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Making a difference and inspiring others. I make mistakes, own them, and keep going — that&apos;s how real growth happens.
            </p>
          </div>

          {/* ── Activity placeholders ──────────────────── col-span-2 */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="grid grid-cols-3 gap-2 h-full">
              {activities.map((a) => (
                <div
                  key={a.label}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-zinc-800/40 border border-white/5 min-h-[110px] px-2"
                >
                  {/* Placeholder image area */}
                  <div className="w-full flex-1 rounded-lg bg-zinc-700/30 flex items-center justify-center min-h-[60px]">
                    <span className="text-2xl">{a.emoji}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 pb-1">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Craft card ─────────────────────────────── col-span-2 */}
          <div className="md:col-span-2 flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 overflow-hidden">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">Craft</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-5">
              Building scalable apps, tools, and AI-powered experiences. I move fast and ship with clean, purposeful code.
            </p>

            {/* Scrolling tool carousel */}
            <div className="relative mt-auto overflow-hidden">
              {/* Fade edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[#07000f] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[#07000f] to-transparent" />

              <div className="animate-marquee flex gap-2 whitespace-nowrap">
                {[...craftTools, ...craftTools].map((tool, i) => (
                  <span
                    key={i}
                    className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
