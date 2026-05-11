export function DashboardMainSkeleton() {
  return (
    <div className="min-h-full animate-pulse space-y-6 bg-[#f5f5f5] -mx-10 px-10 py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="h-10 w-56 rounded-xl bg-gray-200" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 w-64 rounded-xl bg-gray-200" />
          <div className="h-10 w-24 rounded-xl bg-gray-200" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="hidden space-y-4 md:block">
          <div className="flex gap-4 border-b border-gray-100 pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 flex-1 rounded bg-gray-100" />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, r) => (
            <div
              key={r}
              className="flex gap-4 border-b border-gray-50 py-4 last:border-0"
            >
              <div className="h-10 w-44 rounded-lg bg-gray-100" />
              <div className="h-4 flex-1 rounded bg-gray-50" />
              <div className="h-4 w-24 rounded bg-gray-50" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 md:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
