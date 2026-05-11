"use client";

import { useState } from "react";
import { FilterButton } from "@/components/dashboard/FilterButton";
import { RequestTable } from "@/components/dashboard/RequestTable";
import { RequestsPageSkeleton } from "@/components/dashboard/RequestsPageSkeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useRequestsOverview } from "@/app/Services/Requests/useRequestsOverview";
import type { RequestStatItem } from "@/lib/requests/types";

const PAGE_SIZE_OPTIONS = [8, 10, 20] as const;

const ZERO_STATS: RequestStatItem[] = [
  { label: "Flat Tire Assistance", value: 0 },
  { label: "Battery Jumpstart", value: 0 },
  { label: "Towing Service", value: 0 },
  { label: "Engine Trouble", value: 0 },
];

export default function RequestsPage() {
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(8);
  const { stats, rows, isLoading, error, refetch } = useRequestsOverview();

  const displayStats = stats.length > 0 ? stats : ZERO_STATS;

  if (isLoading) {
    return <RequestsPageSkeleton />;
  }

  return (
    <div className="min-h-full space-y-6 bg-[#f5f5f5] -mx-10 px-10 py-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#110D8C]">
          Requests
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="requests-page-size"
            className="text-sm font-medium text-gray-900"
          >
            Showing
          </label>
          <select
            id="requests-page-size"
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) =>
              setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number])
            }
            className="select select-bordered select-sm h-10 min-h-0 rounded-xl border-gray-200 bg-sky-50 text-sm font-semibold text-gray-900 shadow-sm transition-shadow duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e88e5] focus-visible:ring-offset-2"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <FilterButton />
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="btn btn-sm rounded-xl border-red-300 bg-white text-red-800 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          >
            Retry
          </button>
        </div>
      ) : null}

      <StatsCard items={displayStats} />

      <RequestTable
        key={pageSize}
        rows={rows}
        pageSize={pageSize}
      />
    </div>
  );
}
