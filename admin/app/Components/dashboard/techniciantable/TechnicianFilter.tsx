"use client";

import { ICONS } from "@/app/Shared/Constants/icons";

const LIMIT_OPTIONS = [10, 15, 20] as const;

interface TechnicianFilterProps {
  selectedLimit: number;
  onLimitChange: (value: number) => void;
  searchText: string;
  onSearchChange: (value: string) => void;
}

export function TechnicianFilter({
  selectedLimit,
  onLimitChange,
  searchText,
  onSearchChange,
}: TechnicianFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-gray-700 text-base font-medium">Showing</span>
        <label className="flex items-center gap-1 bg-blue-200 text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-lg">
          <select
            value={selectedLimit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-transparent outline-none cursor-pointer"
          >
            {LIMIT_OPTIONS.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
          <ICONS.drop_down className="w-4 h-4" />
        </label>
      </div>

      <label className="flex items-center gap-2 bg-white text-gray-800 text-sm font-bold px-4 py-3 rounded-xl shadow-sm">
        <ICONS.export className="w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="outline-none bg-transparent placeholder:text-gray-500 font-medium"
        />
      </label>
    </div>
  );
}
