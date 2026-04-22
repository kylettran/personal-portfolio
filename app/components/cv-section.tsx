import Link from 'next/link';

const CV_URL =
  'https://docs.google.com/document/d/1GZBqPyiBgY4fWWqyX4_dt2Kqh7H2nKloYvleuR31uP4/view';

export function CvSection() {
  return (
    <section id="resume" className="w-full px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Background</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">Resume</h2>
          <p className="mt-3 text-zinc-400">
            A full look at my education, experience, and work.
          </p>
        </div>

        {/* Feature card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">

          {/* Background gradient blob */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)',
            }}
          />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <h3 className="text-xl font-semibold text-white sm:text-2xl">
                Kyle Tran — CV
              </h3>
              <p className="mt-3 text-zinc-400 leading-relaxed">
                Founder, builder, and AI-native developer. My CV covers my full
                academic background, professional experience, and the projects
                I&apos;ve shipped along the way.
              </p>
            </div>

            <Link
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-900/30 transition-colors hover:bg-violet-500 active:bg-violet-700"
            >
              View CV
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
