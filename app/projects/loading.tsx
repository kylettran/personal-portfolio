import { Skeleton } from "../components/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="relative pb-16">
      {/* Nav skeleton */}
      <div className="flex items-center justify-between px-6 py-6 mx-auto max-w-7xl lg:px-8">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="px-6 pt-12 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-16 lg:pt-24">
        {/* Page title */}
        <div className="max-w-2xl mx-auto lg:mx-0 space-y-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="w-full h-px bg-zinc-800" />

        {/* Featured + top 2 grid */}
        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
          {/* Featured card */}
          <div className="overflow-hidden relative border rounded-xl border-zinc-600 p-4 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-0" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-9 w-3/4 mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="pt-12">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Top 2 secondary cards */}
          <div className="flex flex-col w-full gap-8 mx-auto">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="overflow-hidden relative border rounded-xl border-zinc-600 p-4 md:p-8 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-0" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden w-full h-px md:block bg-zinc-800" />

        {/* Masonry grid */}
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          {[0, 1, 2].map((col) => (
            <div key={col} className="grid grid-cols-1 gap-4">
              {[0, 1].map((row) => (
                <div
                  key={row}
                  className="overflow-hidden relative border rounded-xl border-zinc-600 p-4 md:p-8 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
