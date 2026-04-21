"use client";
import { ICONS } from "@/app/Shared/Constants/icons";

type RequestStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

interface Request {
  id: string;
  avatarUrl: string;
  name: string;
  requestId: string;
  technicianId: string;
  price: string;
  typeOfIssue: string;
  status: RequestStatus;
}

const MOCK_REQUESTS: Request[] = [
  { id: "1", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "2", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "3", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "4", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "5", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "6", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "7", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
  { id: "8", name: "Charlene Barrientos", avatarUrl: "https://ui-avatars.com/api/?name=CB&background=A2A2A2&color=fff", requestId: "#FE342FSQ4", technicianId: "#FE342FSQ4", price: "P800", typeOfIssue: "Flat tire", status: "Pending" },
];

const STATS = [
  { label: "Flat Tire Assistance", count: 25 },
  { label: "Battery Jumpstart", count: 15 },
  { label: "Towing Service", count: 35 },
  { label: "Engine Trouble", count: 10 },
];

const PAGES = ["01", "02", "03", "04", "...", "10", "11"];
const CURRENT_PAGE = "03";

const COLUMNS = [
  "User Name",
  "Request ID",
  "Technician ID",
  "Price",
  "Type of Issue",
  "Status",
  "Action",
];

export function RequestsTable() {
  const getBadgeColors = (status: RequestStatus) => {
    switch (status) {
      case "Pending":
        return "bg-[#FCFDCA] text-[#CAD842]";
      case "In Progress":
        return "bg-[#FFE0BE] text-[#FC9E23]";
      case "Completed":
        return "bg-[#C8F7C5] text-[#27AE60]";
      case "Cancelled":
        return "bg-red-100 text-red-400";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Stats Row */}
      <div className="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-8 py-5">
            <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
            <p className="text-4xl font-extrabold text-gray-900 leading-tight">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-left text-gray-400 font-medium px-6 py-4 whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col}
                    {col !== "Action" && (
                      <ICONS.expand_all className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_REQUESTS.map((req) => (
              <tr key={req.id} className="border-b border-gray-100 last:border-0">
                {/* User Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.avatarUrl}
                      alt={req.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      {req.name}
                    </span>
                  </div>
                </td>

                {/* Request ID */}
                <td className="px-6 py-4 text-gray-400 font-semibold whitespace-nowrap">
                  {req.requestId}
                </td>

                {/* Technician ID */}
                <td className="px-6 py-4 text-gray-400 font-semibold whitespace-nowrap">
                  {req.technicianId}
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-gray-600 font-semibold whitespace-nowrap">
                  {req.price}
                </td>

                {/* Type of Issue */}
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {req.typeOfIssue}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${getBadgeColors(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ICONS.ellipsis className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors">
          <ICONS.left className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {PAGES.map((page, idx) => (
            <button
              key={idx}
              className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
                page === CURRENT_PAGE
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-gray-600 transition-colors">
          Next
          <ICONS.right className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
