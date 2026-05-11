function normalizeKey(status: string) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

const styles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  "on-the-way": "bg-indigo-100 text-indigo-800",
  arrived: "bg-cyan-100 text-cyan-800",
  "in-progress": "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
};

export function StatusBadge({ status }: { status: string }) {
  const key = normalizeKey(status);
  const palette = styles[key] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${palette}`}
    >
      {status}
    </span>
  );
}
