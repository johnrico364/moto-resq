"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/app/Shared/Constants/icons";
import { ViewMember } from "./viewmember/viewmember";

type ActivityStatus = "Active" | "Inactive";

interface Technician {
  id: number;
  name: string;
  phone: string;
  expertise: string[];
  status: ActivityStatus;
  avatar: string;
  registeredDate: string;
  email: string;
  location: string;
  documents: { name: string; date: string; size: string }[];
}

const TECHNICIANS_PER_PAGE = 5;

function Avatar({ name, src }: { name: string; src: string }) {
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
      />
    </div>
  );
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
}

function PaginationButton({
  page,
  current,
  onClick,
}: {
  page: number;
  current: number;
  onClick: (p: number) => void;
}) {
  const isActive = page === current;
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
        isActive ? "bg-blue-500 text-white" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {String(page).padStart(2, "0")}
    </button>
  );
}

export function AllMembers({ technicians }: { technicians: Technician[] | null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const totalTechnicians = technicians?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalTechnicians / TECHNICIANS_PER_PAGE));
  const shouldPaginate = totalTechnicians > TECHNICIANS_PER_PAGE;
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * TECHNICIANS_PER_PAGE;
  const endIndex = startIndex + TECHNICIANS_PER_PAGE;
  const paginatedTechnicians = shouldPaginate
    ? technicians?.slice(startIndex, endIndex)
    : technicians;

  useEffect(() => {
    setCurrentPage((prevPage) => Math.min(prevPage, totalPages));
  }, [totalPages]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-normal text-gray-400 px-6 py-4 w-[35%]">
                Name
              </th>
              <th className="text-left text-sm font-normal text-gray-400 px-4 py-4 w-[20%]">
                Phone Number
              </th>
              <th className="text-left text-sm font-normal text-gray-400 px-4 py-4 w-[20%]">
                Expertise
              </th>
              <th className="text-left text-sm font-normal text-gray-400 px-4 py-4 w-[25%]">
                Activity Status
              </th>
              <th className="py-4 w-[10%]" />
            </tr>
          </thead>
          <tbody>
            {paginatedTechnicians?.map((tech) => (
              <tr
                key={tech.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar name={tech.name} src={tech.avatar} />
                    <span className="font-semibold text-gray-900 text-sm">
                      {tech.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-5 font-semibold text-gray-900 text-sm">
                  {tech.phone}
                </td>
                <td className="px-4 py-5 font-semibold text-gray-900 text-sm">
                  {tech.expertise.join(", ")}
                </td>
                <td className="px-4 py-5">
                  <StatusBadge status={tech.status} />
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3 justify-end pr-2">
                    <button
                      onClick={() => setSelectedTech(tech)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors"
                    >
                      View
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <ICONS.ellipsis />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {shouldPaginate && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              <ICONS.left />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {visiblePages.map((page) => (
                <PaginationButton
                  key={page}
                  page={page}
                  current={currentPage}
                  onClick={setCurrentPage}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-gray-700"
            >
              Next
              <ICONS.right />
            </button>
          </div>
        )}
      </div>

      {selectedTech && (
        <ViewMember
          profile={{
            name: selectedTech.name,
            avatar: selectedTech.avatar,
            registeredDate: selectedTech.registeredDate,
            status: selectedTech.status,
            expertise: selectedTech.expertise,
            phone: selectedTech.phone,
            email: selectedTech.email,
            location: selectedTech.location,
            documents: selectedTech.documents,
          }}
          onClose={() => setSelectedTech(null)}
        />
      )}
    </>
  );
}
