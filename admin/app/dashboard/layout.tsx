"use client";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ICONS } from "@/app/Shared/Constants/icons";
import { profileImageToUrl } from "@/app/Services/Auth/authSession";
import { useAuthSession } from "@/app/Services/Auth/AuthSessionProvider";
import { useAuth } from "@/app/Services/Auth/useAuth";
import { useDashboardSummary } from "@/app/Services/Dashboard/useDashboard";
import { DashboardHeader } from "./DashboardHeader";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function navLinkClass(active: boolean) {
  return `flex items-center gap-4 text-lg rounded-lg px-2 py-1 -mx-2 transition-opacity ${
    active
      ? "bg-white/15 font-semibold"
      : "hover:opacity-80 font-normal"
  }`;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuthSession();
  const { signOut } = useAuth();
  const { summary } = useDashboardSummary();
  const pathname = usePathname();

  const displayName = user?.name ?? (hydrated ? "Admin" : "…");
  const displayEmail = user?.email ?? "";
  const avatarUrl = profileImageToUrl(user?.profile_image, BASE_URL) ?? "";
  const notificationCount = summary?.pendingRequests ?? 0;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className="w-72 text-white flex flex-col shrink-0 rounded-tr-[120px] p-8"
        style={{ backgroundColor: "#1e88e5" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/assets/motoresq_logo.png"
            alt="MotoResQ Logo"
            width={100}
            height={100}
          />
          <h1 className="text-2xl font-semibold" style={{ marginLeft: "-10px" }}>
            MotoResQ
          </h1>
        </div>

        <div className="border-t border-white/30 mb-10"></div>

        <nav className="flex flex-col gap-6 text-lg">
          <Link
            href="/dashboard"
            className={navLinkClass(
              pathname === "/dashboard" || pathname === "/dashboard/search",
            )}
          >
            <ICONS.dashboard size={24} /> Dashboard
          </Link>
          <Link
            href="/dashboard/users"
            className={navLinkClass(pathname === "/dashboard/users")}
          >
            <ICONS.users size={24} /> Users
          </Link>
          <Link
            href="/dashboard/technicians"
            className={navLinkClass(pathname === "/dashboard/technicians")}
          >
            <ICONS.user_cog size={24} /> Technicians
          </Link>
          <Link
            href="/dashboard/requests"
            className={navLinkClass(pathname === "/dashboard/requests")}
          >
            <ICONS.file_text size={24} /> Requests
          </Link>
          <Link
            href="/dashboard/settings"
            className={navLinkClass(pathname === "/dashboard/settings")}
          >
            <ICONS.settings size={24} /> Settings
          </Link>
        </nav>

        <div className="mt-auto">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-4 text-lg hover:opacity-80 w-full text-left"
          >
            <ICONS.logout size={24} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense
          fallback={
            <header className="h-[88px] shrink-0 mt-10 px-10 bg-gray-100" />
          }
        >
          <DashboardHeader
            displayName={displayName}
            displayEmail={displayEmail}
            avatarUrl={avatarUrl}
            notificationCount={notificationCount}
          />
        </Suspense>
        <main className="flex-1 overflow-auto px-10 pb-10">{children}</main>
      </div>
    </div>
  );
}
