import { allProjects } from "contentlayer/generated";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Canonical project order — personal-portfolio is always #1
const PINNED = ["personal-portfolio", "lynx-combinator", "inside-look-into-my-brain"];

function getSortedProjects() {
  const published = allProjects.filter((p) => p.published);
  const pinned = PINNED.map((slug) => published.find((p) => p.slug === slug)).filter(
    Boolean,
  ) as (typeof allProjects)[number][];
  const rest = published
    .filter((p) => !PINNED.includes(p.slug))
    .sort(
      (a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    );
  return [...pinned, ...rest];
}

type Props = {
  currentSlug: string;
  isBrain?: boolean;
};

export function ProjectPagination({ currentSlug, isBrain = false }: Props) {
  const projects = getSortedProjects();
  const index = projects.findIndex((p) => p.slug === currentSlug);
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  const border = isBrain ? "border-zinc-800" : "border-zinc-200";
  const label = isBrain ? "text-zinc-500" : "text-zinc-400";
  const title = isBrain ? "text-zinc-100" : "text-zinc-800";
  const hover = isBrain
    ? "hover:bg-zinc-800/50 hover:border-zinc-700"
    : "hover:bg-zinc-100 hover:border-zinc-300";

  return (
    <nav
      aria-label="Project navigation"
      className={`border-t ${border} mt-0`}
    >
      <div className="max-w-2xl mx-auto px-4 py-8 grid grid-cols-2 gap-4 sm:gap-8">
        {/* Previous */}
        <div className="flex justify-start">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className={`group flex flex-col gap-1 rounded-xl border ${border} px-4 py-3 w-full transition-colors duration-200 ${hover}`}
            >
              <span className={`flex items-center gap-1 text-xs font-medium ${label}`}>
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </span>
              <span className={`text-sm font-semibold leading-snug ${title} line-clamp-2`}>
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Next */}
        <div className="flex justify-end">
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className={`group flex flex-col gap-1 items-end rounded-xl border ${border} px-4 py-3 w-full transition-colors duration-200 ${hover}`}
            >
              <span className={`flex items-center gap-1 text-xs font-medium ${label}`}>
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span className={`text-sm font-semibold leading-snug text-right ${title} line-clamp-2`}>
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </nav>
  );
}
