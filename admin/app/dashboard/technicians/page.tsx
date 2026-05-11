"use client";

import { useEffect, useMemo, useState } from "react";
import { TechnicianFilter } from "@/app/Components/dashboard/techniciantable/TechnicianFilter";
import { TechnicianTable } from "@/app/Components/dashboard/techniciantable/TechnicianTable";
import { EditTechnicianModal } from "@/app/Components/dashboard/techniciantable/EditTechnicianModal";
import {
  deleteTechnician,
  useTechnicians,
  type DashboardTechnician,
} from "@/app/Services/Technicians/useTechnicians";

const TABS = ["All Members", "Pending", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const LIMIT_OPTIONS = [10, 15, 20] as const;
type LimitOption = (typeof LIMIT_OPTIONS)[number];

function tabFilter(list: DashboardTechnician[], tab: Tab): DashboardTechnician[] {
  if (tab === "Pending") {
    return list.filter((t) => !t.is_verified);
  }
  if (tab === "Cancelled") {
    return list.filter((t) => t.is_verified && !t.is_available);
  }
  return list;
}

export default function Technician() {
  const { technicians, isLoading, error, refetch } = useTechnicians();
  const [activeTab, setActiveTab] = useState<Tab>("All Members");
  const [editing, setEditing] = useState<DashboardTechnician | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedLimit, setSelectedLimit] = useState<LimitOption>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const tabFiltered = useMemo(
    () => tabFilter(technicians, activeTab),
    [technicians, activeTab],
  );

  const filteredTechnicians = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return tabFiltered;
    return tabFiltered.filter((t) => t.name.toLowerCase().includes(query));
  }, [searchText, tabFiltered]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTechnicians.length / selectedLimit),
  );

  const paginatedTechnicians = useMemo(() => {
    const start = (currentPage - 1) * selectedLimit;
    return filteredTechnicians.slice(start, start + selectedLimit);
  }, [currentPage, filteredTechnicians, selectedLimit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, activeTab, selectedLimit]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (tech: DashboardTechnician) => {
    const ok = window.confirm(
      `Remove technician "${tech.name}" from the directory? This cannot be undone from the dashboard.`,
    );
    if (!ok) return;
    const result = await deleteTechnician(tech.id);
    if (!result.ok) {
      window.alert(result.message ?? "Delete failed.");
      return;
    }
    void refetch();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-6 mb-4 flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Technicians
        </h1>
        <TechnicianFilter
          selectedLimit={selectedLimit}
          onLimitChange={(val) => setSelectedLimit(val as LimitOption)}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
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

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-8 text-gray-500 mt-5">
          Loading technicians...
        </div>
      ) : (
        <TechnicianTable
          technicians={paginatedTechnicians}
          totalTechnicians={filteredTechnicians.length}
          pageSize={selectedLimit}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEditTechnician={setEditing}
          onDeleteTechnician={handleDelete}
        />
      )}

      {editing && (
        <EditTechnicianModal
          key={editing.id}
          technician={editing}
          onClose={() => setEditing(null)}
          onSaved={() => void refetch()}
        />
      )}
    </div>
  );
}
