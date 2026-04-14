'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'More', href: '#more' },
];

export function NavDesktop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled ? 'border-b border-zinc-800 bg-black/80 backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="#hero" className="font-display text-lg text-white hover:opacity-70 transition-opacity">
          KT
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#more"
          className="hidden md:flex h-9 items-center gap-2 rounded-xl border border-zinc-700 px-4 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          Let&apos;s Connect
        </Link>
      </div>
    </header>
  );
}
