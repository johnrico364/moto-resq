"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { profileImageToUrl } from "@/app/Services/Auth/authSession";
import { EditUserModal } from "@/app/Components/dashboard/usertable/EditUserModal";
import { EditTechnicianModal } from "@/app/Components/dashboard/techniciantable/EditTechnicianModal";
import {
  deleteUser,
  useUser,
  type DashboardUser,
  type UserStatus,
} from "@/app/Services/User/useUser";
import {
  deleteTechnician,
  useTechnicians,
  type DashboardTechnician,
} from "@/app/Services/Technicians/useTechnicians";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function SearchResultAvatar({
  name,
  src,
}: {
  name: string;
  src: string | undefined;
}) {
  const [imgError, setImgError] = useState(false);
  const initial = name.trim().charAt(0).toLocaleUpperCase() || "?";

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

function matchesQuery(text: string | undefined, q: string): boolean {
  if (!q) return false;
  return (text ?? "").toLowerCase().includes(q);
}

function toTitleCaseStatus(status: UserStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        status === "active"
          ? "bg-green-100 text-green-600"
          : status === "suspended"
            ? "bg-red-200 text-red-500"
            : "bg-gray-200 text-gray-600"
      }`}
    >
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      )}
      {toTitleCaseStatus(status)}
    </span>
  );
}

function TechBoolBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`}
      />
      {label}
    </span>
  );
}

const cardShell =
  "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden";

function DashboardSearchPage() {
  const searchParams = useSearchParams();
  const qRaw = searchParams.get("q") ?? "";
  const q = qRaw.trim().toLowerCase();

  const {
    users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUser();
  const {
    technicians,
    isLoading: techLoading,
    error: techError,
    refetch: refetchTechnicians,
  } = useTechnicians();

  const [editingUser, setEditingUser] = useState<DashboardUser | null>(null);
  const [editingTechnician, setEditingTechnician] =
    useState<DashboardTechnician | null>(null);

  const filteredUsers = useMemo(() => {
    if (!q) return [];
    return users.filter(
      (u) =>
        matchesQuery(u.name, q) ||
        matchesQuery(u.email, q) ||
        matchesQuery(u.phone, q),
    );
  }, [users, q]);

  const filteredTechnicians = useMemo(() => {
    if (!q) return [];
    return technicians.filter(
      (t) =>
        matchesQuery(t.name, q) ||
        matchesQuery(t.email, q) ||
        matchesQuery(t.phone, q),
    );
  }, [technicians, q]);

  const loading = usersLoading || techLoading;
  const hasQuery = q.length > 0;
  const noResults =
    hasQuery &&
    !loading &&
    filteredUsers.length === 0 &&
    filteredTechnicians.length === 0;

  const handleDeleteUser = async (user: DashboardUser) => {
    const ok = window.confirm(
      `Remove user "${user.name}" from the directory? This cannot be undone from the dashboard.`,
    );
    if (!ok) return;
    const result = await deleteUser(user.id);
    if (!result.ok) {
      window.alert(result.message ?? "Delete failed.");
      return;
    }
    void refetchUsers();
  };

  const handleDeleteTechnician = async (tech: DashboardTechnician) => {
    const ok = window.confirm(
      `Remove technician "${tech.name}" from the directory? This cannot be undone from the dashboard.`,
    );
    if (!ok) return;
    const result = await deleteTechnician(tech.id);
    if (!result.ok) {
      window.alert(result.message ?? "Delete failed.");
      return;
    }
    void refetchTechnicians();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-extrabold text-[#110D8C] tracking-tight">
          Search
        </h1>
        {hasQuery ? (
          <p className="mt-2 text-gray-600">
            Results for &quot;{qRaw.trim()}&quot;
          </p>
        ) : (
          <p className="mt-2 text-gray-600">
            Use the search bar above to find users and technicians.
          </p>
        )}
      </div>

      {(usersError || techError) && (
        <p className="mb-4 text-sm text-red-500">
          {[usersError, techError].filter(Boolean).join(" ")}
        </p>
      )}

      {loading ? (
        <div className={`${cardShell} px-6 py-8 text-gray-500`}>
          Loading results…
        </div>
      ) : !hasQuery ? null : noResults ? (
        <div className={`${cardShell} px-6 py-10 text-center text-gray-600`}>
          No matches. Try a different name, email, or phone.
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredUsers.length > 0 ? (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Users</h2>
                <Link
                  href="/dashboard/users"
                  className="text-sm font-semibold text-[#1e88e5] hover:underline"
                >
                  Open users
                </Link>
              </div>
              <div className={cardShell}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-gray-400 font-medium px-6 py-4">
                        Name
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4">
                        Email
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4 whitespace-nowrap">
                        Phone
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4">
                        Status
                      </th>
                      <th className="text-right text-gray-400 font-medium px-4 py-4 w-[18%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4 min-w-0">
                            <SearchResultAvatar
                              name={u.name}
                              src={profileImageToUrl(u.profileImage, BASE_URL)}
                            />
                            <span className="font-semibold text-gray-900 whitespace-nowrap">
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-gray-500">{u.email}</td>
                        <td className="px-4 py-5 text-gray-500 whitespace-nowrap">
                          {u.phone}
                        </td>
                        <td className="px-4 py-5">
                          <UserStatusBadge status={u.status} />
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setEditingUser(u)}
                              className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteUser(u)}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {filteredTechnicians.length > 0 ? (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Technicians
                </h2>
                <Link
                  href="/dashboard/technicians"
                  className="text-sm font-semibold text-[#1e88e5] hover:underline"
                >
                  Open technicians
                </Link>
              </div>
              <div className={cardShell}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-gray-400 font-medium px-6 py-4">
                        Name
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4">
                        Email
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4 whitespace-nowrap">
                        Phone
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4">
                        Verified
                      </th>
                      <th className="text-left text-gray-400 font-medium px-4 py-4">
                        Available
                      </th>
                      <th className="text-right text-gray-400 font-medium px-4 py-4 w-[18%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTechnicians.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4 min-w-0">
                            <SearchResultAvatar
                              name={t.name}
                              src={t.avatarUrl}
                            />
                            <span className="font-semibold text-gray-900 whitespace-nowrap">
                              {t.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-gray-500">{t.email}</td>
                        <td className="px-4 py-5 text-gray-500 whitespace-nowrap">
                          {t.phone}
                        </td>
                        <td className="px-4 py-5">
                          <TechBoolBadge
                            label={t.is_verified ? "Yes" : "Pending"}
                            active={t.is_verified}
                          />
                        </td>
                        <td className="px-4 py-5">
                          <TechBoolBadge
                            label={t.is_available ? "Yes" : "No"}
                            active={t.is_available}
                          />
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setEditingTechnician(t)}
                              className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-2"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteTechnician(t)}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      )}

      {editingUser && (
        <EditUserModal
          key={editingUser.id}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={() => void refetchUsers()}
        />
      )}

      {editingTechnician && (
        <EditTechnicianModal
          key={editingTechnician.id}
          technician={editingTechnician}
          onClose={() => setEditingTechnician(null)}
          onSaved={() => void refetchTechnicians()}
        />
      )}
    </div>
  );
}

export default function DashboardSearchPageRoute() {
  return (
    <Suspense
      fallback={
        <div className="mt-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8 text-gray-500">
            Loading search…
          </div>
        </div>
      }
    >
      <DashboardSearchPage />
    </Suspense>
  );
}
