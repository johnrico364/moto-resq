export function RequestsPageSkeleton() {
  return (
    <div className="min-h-full space-y-6 bg-[#f5f5f5] -mx-10 px-10 py-6 animate-pulse">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="h-10 w-48 rounded-xl bg-gray-200" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-10 w-20 rounded-xl bg-gray-200" />
          <div className="h-10 w-24 rounded-xl bg-gray-200" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-3/4 max-w-[12rem] rounded bg-gray-100" />
              <div className="h-9 w-16 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="hidden md:block space-y-4">
          <div className="flex gap-4 border-b border-gray-100 pb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 flex-1 rounded bg-gray-100" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={r} className="flex gap-4 border-b border-gray-50 py-3">
              <div className="h-10 w-40 rounded-lg bg-gray-100" />
              <div className="h-4 flex-1 rounded bg-gray-50" />
              <div className="h-4 flex-1 rounded bg-gray-50" />
              <div className="h-4 w-20 rounded bg-gray-50" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-gray-100" />
          ))}
        </div>
        <div className="mt-8 flex justify-between border-t border-gray-100 pt-6">
          <div className="h-9 w-24 rounded-xl bg-gray-100" />
          <div className="h-9 w-40 rounded-xl bg-gray-100" />
          <div className="h-9 w-20 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
