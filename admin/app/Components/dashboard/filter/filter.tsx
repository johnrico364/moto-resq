"use client";
import { ICONS } from "@/app/Shared/Constants/icons";

export function Filter() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-gray-700 text-base font-medium">Showing</span>
        <button className="flex items-center gap-1 bg-blue-200 text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-lg">
          9
          <ICONS.drop_down className="w-4 h-4" />
        </button>
      </div>

      <button className="flex items-center gap-2 bg-white text-gray-800 text-sm font-bold px-5 py-3 rounded-xl shadow-sm">
        <ICONS.filter className="w-5 h-5" />
        Filter
      </button>

      <button className="flex items-center gap-2 bg-white text-gray-800 text-sm font-bold px-5 py-3 rounded-xl shadow-sm">
        <ICONS.export className="w-5 h-5" />
        Export
      </button>
    </div>
  );
}