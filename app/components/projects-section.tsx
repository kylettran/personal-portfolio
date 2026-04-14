import Link from 'next/link';
import { projects } from '@/lib/projects';
import { ProjectCard } from './project-card';

export function ProjectsSection() {
  return (
    <section id="projects" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Portfolio</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-3 text-zinc-400">A selection of things I&apos;ve built and shipped.</p>
        </div>

        <div>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="https://github.com/kylettran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-zinc-800 px-6 py-3 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
          >
            Explore all on GitHub →
          </Link>
        </div>
      </div>
    </section>
  );
}
