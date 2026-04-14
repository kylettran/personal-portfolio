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
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  return (
    <section id="hero" className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
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

        <motion.div {...fadeUp(0.1)}>
          <p className="text-zinc-500 text-sm tracking-wide">Hi, I&apos;m</p>
          <h1 className="font-display text-5xl text-white sm:text-7xl md:text-8xl">
            Kyle Tran
          </h1>
        </motion.div>

        <motion.p className="max-w-sm text-zinc-400 text-base sm:text-lg" {...fadeUp(0.2)}>
          Founder. Builder. Shaping the next generation of AI creators.
        </motion.p>

        <motion.div className="w-full" {...fadeUp(0.3)}>
          <ChatBox />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-1 text-zinc-600 text-xs"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span>scroll to explore</span>
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
