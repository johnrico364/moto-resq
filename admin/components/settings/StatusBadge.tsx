import type { ServiceCategoryStatus } from "@/lib/settings/types";

const palette: Record<
  ServiceCategoryStatus,
  { dot: string; box: string; text: string }
> = {
  Active: {
    dot: "bg-emerald-500",
    box: "bg-emerald-50",
    text: "text-emerald-800",
  },
  Inactive: {
    dot: "bg-gray-400",
    box: "bg-gray-100",
    text: "text-gray-700",
  },
};

export function StatusBadge({ status }: { status: ServiceCategoryStatus }) {
  const p = palette[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${p.box} ${p.text}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${p.dot}`}
        aria-hidden
      />
      {status}
    </span>
  );
}
