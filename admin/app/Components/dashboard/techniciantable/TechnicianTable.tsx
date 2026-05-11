"use client";

import { useState } from "react";
import Image from "next/image";
import { ICONS } from "@/app/Shared/Constants/icons";
import { ViewMember } from "@/app/Components/dashboard/allmembers/viewmember/viewmember";
import type { DashboardTechnician } from "@/app/Services/Technicians/useTechnicians";

interface TechnicianTableProps {
  technicians: DashboardTechnician[];
  totalTechnicians: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditTechnician?: (technician: DashboardTechnician) => void;
  onDeleteTechnician?: (technician: DashboardTechnician) => void;
}

function Avatar({ name, src }: { name: string; src: string | undefined }) {
  const [imgError, setImgError] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  if (!src || imgError) {
    return (
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
        <span className="text-white font-semibold text-lg">{initial}</span>
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
      <Image
        src={src}
        alt={name}
        width={48}
        height={48}
        className="object-cover w-full h-full"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}

function BoolBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
      {label}
    </span>
  );
}

export function TechnicianTable({
  technicians,
  totalTechnicians,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
  onEditTechnician,
  onDeleteTechnician,
}: TechnicianTableProps) {
  const [viewing, setViewing] = useState<DashboardTechnician | null>(null);
  const shouldPaginate = totalTechnicians > pageSize;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-5 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-gray-400 font-medium px-6 py-4 w-[28%]">
                Name
              </th>
              <th className="text-left text-gray-400 font-medium px-4 py-4">Phone</th>
              <th className="text-left text-gray-400 font-medium px-4 py-4">Expertise</th>
              <th className="text-left text-gray-400 font-medium px-4 py-4">Verified</th>
              <th className="text-left text-gray-400 font-medium px-4 py-4">Available</th>
              <th className="text-right text-gray-400 font-medium px-4 py-4 w-[18%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {technicians.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No technicians found.
                </td>
              </tr>
            ) : (
              technicians.map((tech) => (
                <tr key={tech.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={tech.name} src={tech.avatarUrl} />
                      <span className="font-semibold text-gray-900">{tech.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-gray-900 whitespace-nowrap">{tech.phone}</td>
                  <td className="px-4 py-5 text-gray-900 max-w-[200px] truncate">
                    {tech.expertise.join(", ")}
                  </td>
                  <td className="px-4 py-5">
                    <BoolBadge label={tech.is_verified ? "Yes" : "Pending"} active={tech.is_verified} />
                  </td>
                  <td className="px-4 py-5">
                    <BoolBadge label={tech.is_available ? "Yes" : "No"} active={tech.is_available} />
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setViewing(tech)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditTechnician?.(tech)}
                        className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTechnician?.(tech)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {shouldPaginate && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ICONS.left />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {String(page).padStart(2, "0")}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalTechnicians <= pageSize}
              className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ICONS.right />
            </button>
          </div>
        )}
      </div>

      {viewing && (
        <ViewMember
          profile={{
            name: viewing.name,
            avatarUrl: viewing.avatarUrl,
            registeredDate: viewing.registeredDate,
            isVerified: viewing.is_verified,
            isAvailable: viewing.is_available,
            expertise: viewing.expertise,
            phone: viewing.phone,
            email: viewing.email,
            location: viewing.location,
            documents: viewing.documents,
            rating: viewing.rating,
            totalReviews: viewing.total_reviews,
          }}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}
