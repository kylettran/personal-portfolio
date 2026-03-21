import { Skeleton } from "../../components/skeleton";

export default function ProjectLoading() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <header className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black">
        {/* Fixed nav bar */}
        <div className="fixed inset-x-0 top-0 z-50 border-b border-transparent backdrop-blur lg:backdrop-blur-none">
          <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
            <div className="flex gap-8 items-center">
              <Skeleton className="h-5 w-10 bg-zinc-700" />
              <Skeleton className="h-5 w-5 rounded-sm bg-zinc-700" />
              <Skeleton className="h-5 w-5 rounded-sm bg-zinc-700" />
            </div>
            <Skeleton className="h-6 w-6 rounded-sm bg-zinc-700" />
          </div>
        </div>

        {/* Hero area */}
        <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center gap-6">
            <div className="mx-auto max-w-2xl w-full space-y-4">
              <Skeleton className="h-12 w-3/4 mx-auto bg-zinc-700" />
              <Skeleton className="h-4 w-full bg-zinc-700" />
              <Skeleton className="h-4 w-4/5 mx-auto bg-zinc-700" />
              <Skeleton className="h-10 w-36 rounded-full mx-auto bg-zinc-700 mt-2" />
            </div>
          </div>
        </div>
      </header>

      {/* Article body */}
      <article className="px-4 py-12 mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-4 w-full bg-zinc-200" />
        <Skeleton className="h-4 w-5/6 bg-zinc-200" />
        <Skeleton className="h-4 w-full bg-zinc-200" />
        <Skeleton className="h-4 w-4/5 bg-zinc-200" />
        <Skeleton className="h-4 w-full bg-zinc-200" />
        <div className="pt-4" />
        <Skeleton className="h-6 w-1/2 bg-zinc-200" />
        <Skeleton className="h-4 w-full bg-zinc-200" />
        <Skeleton className="h-4 w-3/4 bg-zinc-200" />
        <Skeleton className="h-4 w-full bg-zinc-200" />
        <Skeleton className="h-4 w-5/6 bg-zinc-200" />
        <div className="pt-4" />
        <Skeleton className="h-32 w-full rounded-lg bg-zinc-200" />
        <div className="pt-4" />
        <Skeleton className="h-4 w-full bg-zinc-200" />
        <Skeleton className="h-4 w-4/6 bg-zinc-200" />
      </article>
    </div>
  );
}
