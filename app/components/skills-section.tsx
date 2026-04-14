'use client';

import { tools } from '@/lib/tools';

// Duplicate items for seamless infinite loop
const row1 = [...tools, ...tools];
const row2 = [...tools].reverse().concat([...tools].reverse());

export function SkillsSection() {
  return (
    <section id="skills" className="w-full py-24 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Tech Stack</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">My Tools</h2>
          <p className="mt-3 text-zinc-400">The AI-native toolkit I use to build every day.</p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative flex w-full overflow-hidden mb-4">
        <div className="animate-marquee flex gap-4 whitespace-nowrap">
          {row1.map((tool, i) => (
            <div
              key={`r1-${i}`}
              className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4"
            >
              <span className="text-2xl" aria-hidden="true">{tool.emoji}</span>
              <div>
                <p className="font-medium text-white text-sm">{tool.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-[140px] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative flex w-full overflow-hidden">
        <div className="animate-marquee-reverse flex gap-4 whitespace-nowrap">
          {row2.map((tool, i) => (
            <div
              key={`r2-${i}`}
              className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4"
            >
              <span className="text-2xl" aria-hidden="true">{tool.emoji}</span>
              <div>
                <p className="font-medium text-white text-sm">{tool.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-[140px] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
