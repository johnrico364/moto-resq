"use client";

import { useMemo } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ServiceCategory } from "@/lib/settings/types";
import { EmptyState } from "@/components/settings/EmptyState";
import { FilterButton } from "@/components/settings/FilterButton";
import { GenericTable, type GenericTableColumn, type SortDir } from "@/components/settings/GenericTable";
import { Pagination } from "@/components/settings/Pagination";
import { StatusBadge } from "@/components/settings/StatusBadge";

const PAGE_SIZE_OPTIONS = [5, 9, 15] as const;

export type ServiceSortKey = "id" | "serviceName" | "description" | "status";

function rowKey(row: ServiceCategory) {
  return row.mongoId ?? row.id;
}

export function ServiceCategoryTable({
  categories,
  sortKey,
  sortDir,
  onSort,
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
}: {
  categories: ServiceCategory[];
  sortKey: ServiceSortKey | null;
  sortDir: SortDir;
  onSort: (key: ServiceSortKey) => void;
  pageSize: (typeof PAGE_SIZE_OPTIONS)[number];
  onPageSizeChange: (n: (typeof PAGE_SIZE_OPTIONS)[number]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  onCreate?: () => void;
  onEdit?: (row: ServiceCategory) => void;
  onDelete?: (row: ServiceCategory) => void;
}) {
  const sorted = useMemo(() => {
    const copy = [...categories];
    if (!sortKey) return copy;

    copy.sort((a, b) => {
      const sign = sortDir === "asc" ? 1 : -1;
      const va = String(a[sortKey]).toLowerCase();
      const vb = String(b[sortKey]).toLowerCase();
      if (va < vb) return -1 * sign;
      if (va > vb) return 1 * sign;
      return 0;
    });
    return copy;
  }, [categories, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const columns: GenericTableColumn<ServiceCategory>[] = useMemo(
    () => [
      {
        id: "id",
        header: "Service ID",
        sortKey: "id",
        renderCell: (row) => (
          <span className="font-medium tabular-nums text-gray-800">{row.id}</span>
        ),
      },
      {
        id: "serviceName",
        header: "Service Name",
        sortKey: "serviceName",
        renderCell: (row) => row.serviceName,
      },
      {
        id: "description",
        header: "Description",
        sortKey: "description",
        renderCell: (row) => (
          <span className="text-gray-700">{row.description}</span>
        ),
      },
      {
        id: "status",
        header: "Status",
        sortKey: "status",
        renderCell: (row) => <StatusBadge status={row.status} />,
      },
      {
        id: "action",
        header: "Action",
        headerClassName: "text-right",
        cellClassName: "text-right",
        renderCell: (row) => {
          const canMutate = Boolean(row.mongoId);
          return (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                aria-label={`Edit ${row.serviceName}`}
                disabled={!canMutate}
                onClick={() => canMutate && onEdit?.(row)}
                className="btn btn-square btn-sm rounded-lg border-0 bg-blue-500 text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              >
                <Pencil className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`Delete ${row.serviceName}`}
                disabled={!canMutate}
                onClick={() => canMutate && onDelete?.(row)}
                className="btn btn-square btn-sm rounded-lg border-0 bg-red-500 text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-red-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete],
  );

  const handleGenericSort = (key: keyof ServiceCategory) => {
    onSort(key as ServiceSortKey);
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <label htmlFor="settings-service-page-size-empty" className="text-sm font-medium text-gray-900">
              Showing
            </label>
            <select
              id="settings-service-page-size-empty"
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number])
              }
              className="select select-bordered select-sm h-10 min-h-0 rounded-xl border-gray-200 bg-sky-50 text-sm font-semibold text-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <FilterButton />
            <button
              type="button"
              onClick={() => onCreate?.()}
              className="btn gap-2 rounded-xl border-0 bg-blue-500 px-4 text-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Plus className="h-5 w-5" aria-hidden />
              Create service category
            </button>
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <label htmlFor="settings-service-page-size" className="text-sm font-medium text-gray-900">
            Showing
          </label>
          <select
            id="settings-service-page-size"
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) =>
              onPageSizeChange(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number])
            }
            className="select select-bordered select-sm h-10 min-h-0 rounded-xl border-gray-200 bg-sky-50 text-sm font-semibold text-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <FilterButton />
          <button
            type="button"
            onClick={() => onCreate?.()}
            className="btn gap-2 rounded-xl border-0 bg-blue-500 px-4 text-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <Plus className="h-5 w-5" aria-hidden />
            Create service category
          </button>
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <GenericTable<ServiceCategory>
          columns={columns}
          rows={pageRows}
          sortKey={sortKey as keyof ServiceCategory | null}
          sortDir={sortDir}
          onSort={handleGenericSort}
          getRowKey={(row) => rowKey(row)}
        />
      </div>

      <div className="space-y-4 md:hidden">
        {pageRows.map((row) => {
          const canMutate = Boolean(row.mongoId);
          return (
            <article
              key={rowKey(row)}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Service ID
                  </p>
                  <p className="text-lg font-semibold tabular-nums text-[#110D8C]">{row.id}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500">Service Name</p>
                  <p className="font-medium text-gray-900">{row.serviceName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Description</p>
                  <p className="text-gray-700">{row.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  aria-label={`Edit ${row.serviceName}`}
                  disabled={!canMutate}
                  onClick={() => canMutate && onEdit?.(row)}
                  className="btn btn-square btn-sm rounded-lg border-0 bg-blue-500 text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${row.serviceName}`}
                  disabled={!canMutate}
                  onClick={() => canMutate && onDelete?.(row)}
                  className="btn btn-square btn-sm rounded-lg border-0 bg-red-500 text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-red-600 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export const SERVICE_PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;
