"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/app/Services/User/useUser";
import { useTechnicians } from "@/app/Services/Technicians/useTechnicians";

function matchesQuery(
  text: string | undefined,
  q: string,
): boolean {
  if (!q) return false;
  return (text ?? "").toLowerCase().includes(q);
}

export default function DashboardSearchPage() {
  const searchParams = useSearchParams();
  const qRaw = searchParams.get("q") ?? "";
  const q = qRaw.trim().toLowerCase();

  const { users, isLoading: usersLoading, error: usersError } = useUser();
  const {
    technicians,
    isLoading: techLoading,
    error: techError,
  } = useTechnicians();

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
        <div className="bg-white rounded-2xl shadow-sm px-6 py-8 text-gray-500">
          Loading results…
        </div>
      ) : !hasQuery ? null : noResults ? (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-10 text-center text-gray-600">
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
              <ul className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <li key={u.id} className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {filteredTechnicians.length > 0 ? (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Technicians</h2>
                <Link
                  href="/dashboard/technicians"
                  className="text-sm font-semibold text-[#1e88e5] hover:underline"
                >
                  Open technicians
                </Link>
              </div>
              <ul className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
                {filteredTechnicians.map((t) => (
                  <li key={t.id} className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.email}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
