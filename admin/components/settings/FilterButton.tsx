import { Filter } from "lucide-react";

export function FilterButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Filter service categories"
      className="btn btn-outline btn-sm gap-2 rounded-xl border-gray-200 bg-white font-medium text-gray-800 shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <Filter className="h-4 w-4 text-gray-600" aria-hidden />
      Filter
    </button>
  );
}
