"use client";
import { useState } from "react";
import { Filter } from "@/app/Components/dashboard/filter/filter";
import { AllMembers } from "@/app/Components/dashboard/allmembers/allmembers";

const TABS = ["All Members", "Pending", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

export default function Technician() {
  const [activeTab, setActiveTab] = useState<Tab>("All Members");

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Technicians
        </h1>
        <Filter />
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "text-[#110D8C] border-b-2 border-[#110D8C]"
                : "text-gray-800 border-b-2 border-transparent hover:text-[#110D8C]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <AllMembers />
    </div>
  );
}
