"use client";
import { ICONS } from "@/app/Shared/Constants/icons";
import { DashboardUser } from "@/app/Services/User/useUser";

interface UserTableProps {
  users: DashboardUser[];
  totalUsers: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditUser?: (user: DashboardUser) => void;
}

const columns = [
  "User ID",
  "User Name",
  "Email Address",
  "Phone Number",
  "Registered Date",
  "Status",
  "Action",
];

function toTitleCaseStatus(status: DashboardUser["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function UserTable({
  users,
  totalUsers,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
  onEditUser,
}: UserTableProps) {
  const shouldPaginate = totalUsers > 10;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col}
                className="text-left text-gray-400 font-medium px-6 py-4 whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1">
                  {col}
                  {col !== "Action" && <ICONS.expand_all className="w-3.5 h-3.5 text-gray-400" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 last:border-0">
              <td className="px-6 py-5 text-gray-500">{user.id}</td>
              <td className="px-6 py-5 font-bold text-gray-900 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-5 text-gray-400">{user.email}</td>
              <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{user.phone}</td>
              <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{user.registeredDate}</td>
              <td className="px-6 py-5">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                    user.status === "active"
                      ? "bg-green-100 text-green-600"
                      : user.status === "suspended"
                        ? "bg-red-200 text-red-500"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user.status === "active" && (
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  )}
                  {toTitleCaseStatus(user.status)}
                </span>
              </td>
              <td className="px-6 py-5">
                <button
                  type="button"
                  onClick={() => onEditUser?.(user)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Edit user"
                >
                  <span className="text-xl tracking-widest">•••</span>
                </button>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>

      {shouldPaginate && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 text-gray-500 text-sm font-medium hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ICONS.left className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {String(page).padStart(2, "0")}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalUsers <= pageSize}
          className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ICONS.right className="w-4 h-4" />
        </button>
      </div>
      )}
    </div>
  );
}