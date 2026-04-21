"use client";
import { ICONS } from "@/app/Shared/Constants/icons";
import { RequestsTable } from "@/app/Components/dashboard/requeststable/requeststable";

export default function Requests() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Requests
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-base font-medium">Showing</span>
            <button className="flex items-center gap-1 bg-blue-200 text-gray-800 text-sm font-semibold px-3 py-1.5 rounded-lg">
              8
              <ICONS.drop_down className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center gap-2 bg-white text-gray-800 text-sm font-bold px-5 py-3 rounded-xl shadow-sm">
            <ICONS.filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <RequestsTable />
    </div>
  );
}
