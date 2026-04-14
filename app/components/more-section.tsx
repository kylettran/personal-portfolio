import Link from 'next/link';
import { exploreLinks } from '@/lib/links';

export function MoreSection() {
  return (
    <section id="more" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h2 className="font-display text-3xl text-white sm:text-4xl">More to Explore</h2>
          <p className="mt-3 text-zinc-400">
            Check out these additional resources and connect with me.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {exploreLinks.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
            >
              <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
              <div className="flex-1">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
              </div>
              <span className="text-sm text-zinc-500 transition-colors group-hover:text-zinc-300">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
