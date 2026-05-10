"use client";
import { useEffect, useMemo, useState } from "react";
import { Filter } from "@/app/Components/dashboard/filter/filter";
import { UserTable } from "@/app/Components/dashboard/usertable/usertable";
import { useUser } from "@/app/Services/User/useUser";

const DEFAULT_LIMIT = 10;

export default function Users() {
  const { users, isLoading, error } = useUser();
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [searchText, setSearchText] = useState("");
  const [selectedLimit, setSelectedLimit] = useState(DEFAULT_LIMIT);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const statusFiltered = selectedStatus === "all"
      ? users
      : users.filter((user) => user.status === selectedStatus);

    const searchedUsers = normalizedSearch
      ? statusFiltered.filter((user) =>
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch) ||
          user.phone.toLowerCase().includes(normalizedSearch),
        )
      : statusFiltered;

    return searchedUsers;
  }, [searchText, selectedStatus, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / selectedLimit));
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * selectedLimit;
    return filteredUsers.slice(startIndex, startIndex + selectedLimit);
  }, [currentPage, filteredUsers, selectedLimit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedStatus, selectedLimit]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Users
        </h1>
        <Filter
          selectedLimit={selectedLimit}
          onLimitChange={setSelectedLimit}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </div>
      {error && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-8 text-gray-500">
          Loading users...
        </div>
      ) : (
        <UserTable
          users={paginatedUsers}
          totalUsers={filteredUsers.length}
          pageSize={selectedLimit}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
