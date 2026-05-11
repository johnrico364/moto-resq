"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export type SortDir = "asc" | "desc";

export interface GenericTableColumn<Row> {
  id: string;
  header: string;
  sortKey?: keyof Row;
  headerClassName?: string;
  cellClassName?: string;
  renderCell: (row: Row) => ReactNode;
}

export interface GenericTableProps<Row extends object> {
  columns: GenericTableColumn<Row>[];
  rows: Row[];
  sortKey: keyof Row | null;
  sortDir: SortDir;
  onSort: (key: keyof Row) => void;
  getRowKey: (row: Row) => string;
}

function SortGlyph({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  if (!active) {
    return <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />;
  }
  return dir === "asc" ? (
    <ChevronUp className="h-4 w-4 shrink-0 text-gray-600" aria-hidden />
  ) : (
    <ChevronDown className="h-4 w-4 shrink-0 text-gray-600" aria-hidden />
  );
}

export function GenericTable<Row extends object>({
  columns,
  rows,
  sortKey,
  sortDir,
  onSort,
  getRowKey,
}: GenericTableProps<Row>) {
  return (
    <table className="table w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200">
          {columns.map((col) => {
            const sortable = col.sortKey !== undefined;
            const active = sortable && sortKey === col.sortKey;
            return (
              <th
                key={col.id}
                scope="col"
                className={`bg-white pb-3 pt-1 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 first:pl-0 last:pr-0 ${col.headerClassName ?? ""}`}
              >
                {sortable && col.sortKey !== undefined ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg px-1 py-1 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => onSort(col.sortKey as keyof Row)}
                  >
                    {col.header}
                    <SortGlyph active={Boolean(active)} dir={sortDir} />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1 py-1">
                    {col.header}
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={getRowKey(row)}
            className="group border-b border-gray-100 transition-colors duration-200 last:border-0 hover:bg-gray-50/90"
          >
            {columns.map((col) => (
              <td
                key={col.id}
                className={`py-4 text-sm text-gray-900 first:pl-0 last:pr-0 ${col.cellClassName ?? ""}`}
              >
                {col.renderCell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
