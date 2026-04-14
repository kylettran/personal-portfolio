'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, FolderOpen, Wrench, ExternalLink } from 'lucide-react';

const tabs = [
  { label: 'Home', href: '#hero', icon: Home, section: 'hero' },
  { label: 'Projects', href: '#projects', icon: FolderOpen, section: 'projects' },
  { label: 'Skills', href: '#skills', icon: Wrench, section: 'skills' },
  { label: 'Contact', href: '#contact', icon: ExternalLink, section: 'contact' },
];

export function NavMobile() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'projects', 'skills', 'more', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const resolvedSection = activeSection === 'about' ? 'hero' : activeSection;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-zinc-800 bg-zinc-900/90 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = resolvedSection === tab.section;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1 px-3"
            >
              <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`} />
              <span className={`text-[10px] transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
