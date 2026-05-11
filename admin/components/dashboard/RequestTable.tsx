"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import type { RequestRow } from "@/lib/requests/types";
import { Pagination } from "@/components/dashboard/Pagination";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

type SortableColumn =
  | "userName"
  | "requestId"
  | "technicianId"
  | "price"
  | "issueType"
  | "status";

function formatPhp(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPriceCell(price: number | null) {
  if (price == null) return "—";
  return formatPhp(price);
}

function compareRows(a: RequestRow, b: RequestRow, key: SortableColumn, dir: "asc" | "desc") {
  const sign = dir === "asc" ? 1 : -1;
  if (key === "price") {
    return ((a.price ?? 0) - (b.price ?? 0)) * sign;
  }
  const va = String(a[key]).toLowerCase();
  const vb = String(b[key]).toLowerCase();
  if (va < vb) return -1 * sign;
  if (va > vb) return 1 * sign;
  return 0;
}

function nameInitial(name: string) {
  const t = name.trim();
  if (!t) return "?";
  return t[0].toUpperCase();
}

function RequestUserAvatar({
  name,
  src,
  size,
}: {
  name: string;
  src: string | null;
  size: "sm" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const initial = nameInitial(name);
  const pixels = size === "sm" ? 40 : 44;
  const boxClass = size === "sm" ? "h-10 w-10" : "h-11 w-11";
  const textClass = size === "sm" ? "text-sm font-semibold" : "text-base font-semibold";

  if (!src || imgError) {
    return (
      <div
        className={`${boxClass} flex shrink-0 items-center justify-center rounded-full bg-blue-500`}
        aria-hidden
      >
        <span className={`text-white ${textClass}`}>{initial}</span>
      </div>
    );
  }

  return (
    <div className={`${boxClass} shrink-0 overflow-hidden rounded-full bg-gray-200`}>
      <Image
        src={src}
        alt=""
        width={pixels}
        height={pixels}
        className="h-full w-full object-cover"
        sizes={`${pixels}px`}
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}

function SortChevrons({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  return (
    <span className="inline-flex flex-col leading-none" aria-hidden>
      <ChevronUp
        className={`h-3 w-3 -mb-1 ${active && direction === "asc" ? "text-gray-800" : "text-gray-300"}`}
      />
      <ChevronDown
        className={`h-3 w-3 ${active && direction === "desc" ? "text-gray-800" : "text-gray-300"}`}
      />
    </span>
  );
}

const columns: { key: SortableColumn; label: string }[] = [
  { key: "userName", label: "User Name" },
  { key: "requestId", label: "Request ID" },
  { key: "technicianId", label: "Technician ID" },
  { key: "price", label: "Price" },
  { key: "issueType", label: "Type of issue" },
  { key: "status", label: "Status" },
];

export interface RequestTableProps {
  rows: RequestRow[];
  pageSize: number;
}

export function RequestTable({ rows, pageSize }: RequestTableProps) {
  const [sortKey, setSortKey] = useState<SortableColumn>("userName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => compareRows(a, b, sortKey, sortDir));
    return copy;
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageSlice = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, activePage, pageSize]);

  const toggleSort = (key: SortableColumn) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 shadow-sm sm:p-12">
        <div className="mx-auto max-w-md text-center">
          <p className="text-lg font-semibold text-gray-900">No requests yet</p>
          <p className="mt-2 text-sm text-gray-500">
            When new assistance requests come in, they will show up in this table.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="whitespace-nowrap pb-4 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-400"
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e88e5] focus-visible:ring-offset-2"
                  >
                    <span>{col.label}</span>
                    <SortChevrons active={sortKey === col.key} direction={sortDir} />
                  </button>
                </th>
              ))}
              <th
                scope="col"
                className="whitespace-nowrap pb-4 pr-0 text-xs font-semibold uppercase tracking-wide text-gray-400"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pageSlice.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 transition-colors duration-200 last:border-0 hover:bg-gray-50"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <RequestUserAvatar name={row.userName} src={row.avatar} size="sm" />
                    <span className="font-bold text-gray-900">{row.userName}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-gray-500">#{row.requestId}</td>
                <td className="py-4 pr-4 text-gray-500">
                  {row.technicianId ? `#${row.technicianId}` : "—"}
                </td>
                <td className="py-4 pr-4 text-gray-500">{formatPriceCell(row.price)}</td>
                <td className="py-4 pr-4 text-gray-500">{row.issueType}</td>
                <td className="py-4 pr-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-4 pr-0">
                  <button
                    type="button"
                    aria-label={`Actions for request ${row.requestId}`}
                    className="btn btn-ghost btn-sm btn-square rounded-xl text-gray-500 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e88e5] focus-visible:ring-offset-2"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {pageSlice.map((row) => (
          <article
            key={row.id}
            className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition-colors duration-200 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <RequestUserAvatar name={row.userName} src={row.avatar} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{row.userName}</p>
                  <p className="text-xs text-gray-500">#{row.requestId}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Actions for request ${row.requestId}`}
                className="btn btn-ghost btn-sm btn-square shrink-0 rounded-xl text-gray-500 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e88e5] focus-visible:ring-offset-2"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <dt className="text-xs font-medium text-gray-400">Technician ID</dt>
                <dd className="text-gray-600">
                  {row.technicianId ? `#${row.technicianId}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400">Price</dt>
                <dd className="text-gray-600">{formatPriceCell(row.price)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400">Type of issue</dt>
                <dd className="text-gray-600">{row.issueType}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-400">Status</dt>
                <dd>
                  <StatusBadge status={row.status} />
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-100 pt-6">
        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
