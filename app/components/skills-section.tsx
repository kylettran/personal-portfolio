'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { tools } from '@/lib/tools';

export function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="skills" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Tech Stack</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">My Tools</h2>
          <p className="mt-3 text-zinc-400">The AI-native toolkit I use to build every day.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
            >
              <span className="text-2xl" aria-hidden="true">{tool.emoji}</span>
              <span className="font-medium text-white text-sm">{tool.name}</span>
              <span className="text-xs text-zinc-500 leading-relaxed">{tool.description}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
