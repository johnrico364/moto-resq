import { FolderOpen } from "lucide-react";

export function EmptyState({
  title = "No service categories",
  description = "Create a category to see it listed here.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
        <FolderOpen className="h-7 w-7 text-blue-500" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-[#110D8C]">{title}</h3>
      <p className="max-w-sm text-sm text-gray-600">{description}</p>
    </div>
  );
}
