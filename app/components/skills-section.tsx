import { TechSphere } from './tech-sphere';

export function SkillsSection() {
  return (
    <section id="skills" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Tech Stack</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">My Tools</h2>
          <p className="mt-3 text-zinc-400">
            Drag the sphere to explore the AI-native toolkit I use every day.
          </p>
        </div>

        <TechSphere />
      </div>
    </section>
  );
}
