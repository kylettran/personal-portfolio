'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChatBox } from './chat-box';

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <section id="hero" className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-lg flex-col items-center gap-5 text-center">

        {/* Memoji */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src="/memoji.jpg"
            alt="Kyle Tran"
            width={96}
            height={96}
            className="rounded-full"
            priority
          />
        </motion.div>

        {/* Name — inline, name in purple gradient */}
        <motion.h1
          className="text-2xl font-semibold text-white"
          {...fadeUp(0.1)}
        >
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Kyle Tran
          </span>
        </motion.h1>

        {/* Chat card */}
        <motion.div className="w-full" {...fadeUp(0.2)}>
          <ChatBox />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-1 text-zinc-600 text-xs"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span>scroll below</span>
          <motion.span
            animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
