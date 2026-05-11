import { ChevronLeft, ChevronRight } from "lucide-react";

function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);

  for (let d = -1; d <= 1; d++) {
    const p = current + d;
    if (p > 1 && p < total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && prev !== undefined && p - prev > 1) {
      out.push("ellipsis");
    }
    out.push(p);
  }

  return out;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages < 1) return null;

  const pageList = buildPageList(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
        className="btn btn-ghost btn-sm gap-1 rounded-xl text-gray-500 transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:justify-start"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Previous
      </button>

      <nav
        className="flex flex-wrap items-center justify-center gap-1"
        aria-label="Pagination"
      >
        {pageList.map((entry, idx) =>
          entry === "ellipsis" ? (
            <span
              key={`e-${idx}`}
              className="px-2 text-sm text-gray-400"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-label={`Page ${entry}`}
              aria-current={entry === currentPage ? "page" : undefined}
              className={
                entry === currentPage
                  ? "min-w-[2.25rem] rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-[1.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  : "min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:scale-[1.05] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              }
            >
              {String(entry).padStart(2, "0")}
            </button>
          ),
        )}
      </nav>

      <button
        type="button"
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Next page"
        className="btn btn-ghost btn-sm gap-1 rounded-xl text-gray-900 transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:justify-end"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
