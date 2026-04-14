'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Eye } from 'lucide-react';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

function useViewCount(slug: string) {
  const [views, setViews] = useState<number | null>(null);
  const counted = useRef(false);

  // Fetch the current count on mount
  useEffect(() => {
    fetch(`/api/views/${slug}`)
      .then((r) => r.json())
      .then((d) => setViews(d.views))
      .catch(() => {});
  }, [slug]);

  // Increment once per browser session when the card enters the viewport
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Session deduplication — don't count if already counted this tab session
    const sessionKey = `viewed:${slug}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted.current) {
          counted.current = true;
          sessionStorage.setItem(sessionKey, '1');
          observer.disconnect();

          fetch(`/api/views/${slug}`, { method: 'POST' })
            .then((r) => r.json())
            .then((d) => setViews(d.views))
            .catch(() => {});
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  return { views, cardRef };
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isEven = index % 2 === 1;
  const { views, cardRef } = useViewCount(project.slug);

  return (
    <motion.article
      ref={cardRef}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-8 border-b border-zinc-800 py-12 last:border-0 md:items-center ${
        isEven ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-zinc-600">{project.number}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-sm text-zinc-500">{project.type}</span>
          {project.status === 'in-development' && (
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              In Development
            </span>
          )}
          {/* View count */}
          {views !== null && (
            <span className="ml-auto flex items-center gap-1 text-xs text-zinc-600">
              <Eye size={12} />
              {views.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl text-white sm:text-3xl">{project.title}</h3>
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-white"
            >
              <ExternalLink size={14} />
              <span>visit</span>
            </Link>
          )}
        </div>

        <p className="leading-relaxed text-zinc-400">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {project.image && (
        <div className="w-full overflow-hidden rounded-xl border border-zinc-800 md:w-72 shrink-0">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            width={288}
            height={180}
            className="h-44 w-full object-cover"
          />
        </div>
      )}
    </motion.article>
  );
}
