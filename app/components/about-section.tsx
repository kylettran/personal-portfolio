import { BentoCard } from './bento-card';

export function AboutSection() {
  return (
    <section id="about" className="w-full px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">About</p>
          <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">
            The person behind the screen
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Identity — spans 2 rows on desktop */}
          <BentoCard
            title="Kyle Tran"
            teaser="AI-Native Founder & Builder · Irvine, CA"
            expandable={false}
            className="md:row-span-2"
          >
            <div className="mt-2 space-y-3">
              <p className="text-zinc-300 font-medium">AI-Native Founder & Builder</p>
              <p className="text-zinc-500 text-xs font-mono">Irvine, CA · PST</p>
              <p className="text-zinc-400 leading-relaxed pt-2">
                Building the future by empowering others to build. Founded Lynx Combinator —
                reviving the culture around building something real with real people.
              </p>
            </div>
          </BentoCard>

          {/* Lynx Combinator */}
          <BentoCard
            title="Lynx Combinator"
            teaser="Building the biggest youth incubator in existence"
            emoji="🏗"
            link="https://ls-portfolio-page.vercel.app/"
            expandable={false}
          >
            <p>
              SoCal&apos;s #1 youth AI program — a 6-week bootcamp turning young leaders into
              real builders. Every student ships 3 AI products ready for their portfolio.
            </p>
          </BentoCard>

          {/* Ikigai App */}
          <BentoCard
            title="Ikigai App"
            teaser="Find your passion in life"
            emoji="💡"
            badge="In Development"
          >
            <p>
              A passion project built around the Japanese concept of ikigai — helping people
              find the intersection of what they love, what they&apos;re good at, and what the
              world needs.
            </p>
          </BentoCard>

          {/* Chess / Tennis / Tech — full width */}
          <BentoCard
            title="Chess · Tennis · Technology"
            teaser="The three things I think about constantly"
            expandable={false}
            className="md:col-span-2"
          >
            <div className="mt-2 flex gap-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">♟</span>
                <span className="text-xs text-zinc-500">Chess</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">🎾</span>
                <span className="text-xs text-zinc-500">Tennis</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl" aria-hidden="true">💻</span>
                <span className="text-xs text-zinc-500">Technology</span>
              </div>
            </div>
          </BentoCard>

          {/* Location — full width */}
          <BentoCard
            title="Irvine, California"
            teaser="33.6846° N, 117.8265° W · PST"
            expandable={false}
            className="md:col-span-2"
          >
            <p className="font-mono text-zinc-500">
              33.6846° N, 117.8265° W · GMT-7 · PST
            </p>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
