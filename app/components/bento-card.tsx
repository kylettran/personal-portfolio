'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BentoCardProps {
  title: string;
  teaser: string;
  children: React.ReactNode;
  expandable?: boolean;
  badge?: string;
  emoji?: string;
  link?: string;
  className?: string;
}

export function BentoCard({
  title,
  teaser,
  children,
  expandable = true,
  badge,
  emoji,
  link,
  className = '',
}: BentoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <div
      className={`group relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700 ${
        expandable ? 'cursor-pointer select-none' : ''
      } ${className}`}
      onClick={() => expandable && setExpanded((v) => !v)}
      role={expandable ? 'button' : undefined}
      tabIndex={expandable ? 0 : undefined}
      onKeyDown={(e) => {
        if (expandable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          setExpanded((v) => !v);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {emoji && (
            <span className="mb-2 block text-2xl" aria-hidden="true">
              {emoji}
            </span>
          )}
          {badge && (
            <span className="mb-2 inline-block rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              {badge}
            </span>
          )}
          <h3 className="font-medium text-white">{title}</h3>
          {!expanded && (
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{teaser}</p>
          )}
        </div>
        {expandable && (
          <motion.span
            className="mt-1 shrink-0 text-zinc-500"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {(expanded || !expandable) && (
          <motion.div
            key="content"
            initial={shouldReduceMotion || !expandable ? {} : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 text-sm text-zinc-400 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
