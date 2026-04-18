"use client";
import { ICONS } from "@/app/Shared/Constants/icons";

type UserStatus = "Active" | "Suspended";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: UserStatus;
}

const MOCK_USERS: User[] = [
  { id: "01", name: "Charlene Barrientos", email: "charlene.barrientos@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
  { id: "01", name: "Johnmark Pepito", email: "johnmarkpepito@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
  { id: "01", name: "Francis Rey Ampoon", email: "francisampoon@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Suspended" },
  { id: "01", name: "Joshua Playda", email: "joshuamarkplayda@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
  { id: "01", name: "John Anthony Rico", email: "RicoJohn@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
  { id: "01", name: "Kent Flores", email: "FloresKent@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
  { id: "01", name: "Weah Joy Jacinto", email: "weahjacinto@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Suspended" },
  { id: "01", name: "Christian Alicaba", email: "christianalicaba@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
  { id: "01", name: "John Jeffrey Baclay", email: "johnjeffreybaclay@gmail.com", phone: "(09) 382 0438", registeredDate: "March 23, 2023", status: "Active" },
];

const PAGES = ["01", "02", "03", "04", "...", "10", "11"];
const CURRENT_PAGE = "03";

const columns = [
  "User ID",
  "User Name",
  "Email Address",
  "Phone Number",
  "Registered Date",
  "Status",
  "Action",
];

export function UserTable() {
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
          {MOCK_USERS.map((user, idx) => (
            <tr key={idx} className="border-b border-gray-100 last:border-0">
              <td className="px-6 py-5 text-gray-500">{user.id}</td>
              <td className="px-6 py-5 font-bold text-gray-900 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-5 text-gray-400">{user.email}</td>
              <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{user.phone}</td>
              <td className="px-6 py-5 text-gray-500 whitespace-nowrap">{user.registeredDate}</td>
              <td className="px-6 py-5">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-200 text-red-500"
                  }`}
                >
                  {user.status === "Active" && (
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  )}
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-5">
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="text-xl tracking-widest">•••</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-gray-500 text-sm font-medium hover:text-gray-700">
          <ICONS.left className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {PAGES.map((page, idx) => (
            <button
              key={idx}
              className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center ${
                page === CURRENT_PAGE
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 text-gray-800 text-sm font-semibold hover:text-gray-600">
          Next
          <ICONS.right className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}