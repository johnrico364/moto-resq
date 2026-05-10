"use client";
import { ICONS } from "@/app/Shared/Constants/icons";

import { UserStatus } from "@/app/Services/User/useUser";

interface FilterProps {
  selectedLimit: number;
  onLimitChange: (value: number) => void;
  selectedStatus: "all" | UserStatus;
  onStatusChange: (value: "all" | UserStatus) => void;
  searchText: string;
  onSearchChange: (value: string) => void;
}

export function Filter({
  selectedLimit,
  onLimitChange,
  selectedStatus,
  onStatusChange,
  searchText,
  onSearchChange,
}: FilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-gray-700 text-base font-medium">Showing</span>
        <label className="flex items-center gap-1 bg-blue-200 text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-lg">
          <select
            value={selectedLimit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="bg-transparent outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <ICONS.drop_down className="w-4 h-4" />
        </label>
      </div>

      <label className="flex items-center gap-2 bg-white text-gray-800 text-sm font-bold px-4 py-3 rounded-xl shadow-sm">
        <ICONS.filter className="w-5 h-5" />
        <select
          value={selectedStatus}
          onChange={(event) => onStatusChange(event.target.value as "all" | UserStatus)}
          className="bg-transparent outline-none cursor-pointer"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </label>

      <label className="flex items-center gap-2 bg-white text-gray-800 text-sm font-bold px-4 py-3 rounded-xl shadow-sm">
        <ICONS.export className="w-5 h-5" />
        <input
          type="text"
          placeholder="Search users"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          className="outline-none bg-transparent placeholder:text-gray-500 font-medium"
        />
      </label>
    </div>
  );
}