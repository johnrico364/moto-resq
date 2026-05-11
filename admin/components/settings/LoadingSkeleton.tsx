export function LoadingSkeleton() {
  return (
    <div
      className="min-h-full space-y-6 bg-[#f5f5f5] -mx-10 px-10 py-6"
      aria-busy="true"
      aria-label="Loading settings"
    >
      <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />

      <div className="flex gap-8 border-b border-gray-200 pb-3">
        <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <div className="mb-8 h-4 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="flex gap-3">
            <div className="h-11 w-32 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </div>
        <div className="mb-8 h-px w-full bg-gray-100" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="mt-10 h-12 w-44 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
