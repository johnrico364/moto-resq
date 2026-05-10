"use client";
import { useEffect, useMemo, useState } from "react";
import { Filter } from "@/app/Components/dashboard/filter/filter";
import { UserTable } from "@/app/Components/dashboard/usertable/usertable";
import { useUser } from "@/app/Services/User/useUser";

const LIMIT_OPTIONS = [10, 15, 20] as const;
type LimitOption = (typeof LIMIT_OPTIONS)[number];
type StatusFilter = "all" | "active" | "inactive" | "suspended";

export default function Users() {
  const { users, isLoading, error } = useUser();
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [selectedLimit, setSelectedLimit] = useState<LimitOption>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const statusFiltered = useMemo(() => {
    return selectedStatus === "all"
      ? users
      : users.filter((user) => user.status === selectedStatus);
  }, [selectedStatus, users]);

  const filteredUsers = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return statusFiltered;
    return statusFiltered.filter((user) =>
      user.name.toLowerCase().includes(query),
    );
  }, [searchText, statusFiltered]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / selectedLimit),
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * selectedLimit;
    return filteredUsers.slice(start, start + selectedLimit);
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
          onLimitChange={(val) => setSelectedLimit(val as LimitOption)}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

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
