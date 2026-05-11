export interface StatItem {
  label: string;
  value: number;
}

export function StatsCard({ items }: { items: StatItem[] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col divide-y divide-gray-200 lg:flex-row lg:divide-x lg:divide-y-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex-1 py-6 first:pt-0 last:pb-0 lg:px-8 lg:py-0 lg:first:pl-0 lg:last:pr-0"
          >
            <p className="text-sm font-medium text-gray-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
