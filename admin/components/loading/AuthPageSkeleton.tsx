export function AuthPageSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse bg-white">
      <div
        className="hidden w-1/2 flex-col justify-between p-16 lg:flex"
        style={{ backgroundColor: "#1e88e5" }}
      >
        <div className="h-8 w-8 rounded-full bg-white/40" />
        <div className="space-y-4">
          <div className="h-3 w-32 rounded bg-white/30" />
          <div className="h-14 w-48 rounded-lg bg-white/25" />
          <div className="h-12 w-40 rounded-lg bg-white/20" />
          <div className="h-3 w-full max-w-xs rounded bg-white/20" />
        </div>
        <div className="h-3 w-24 rounded bg-white/20" />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden space-y-3">
            <div className="h-8 w-40 rounded-lg bg-gray-200" />
            <div className="h-0.5 w-8 bg-gray-200" />
          </div>
          <div className="h-3 w-36 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-14 rounded bg-gray-200" />
            <div className="h-11 w-full rounded-xl bg-gray-100" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-11 w-full rounded-xl bg-gray-100" />
          </div>
          <div className="h-12 w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
