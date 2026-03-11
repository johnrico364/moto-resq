"use client";
import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/app/Shared/Constants/icons";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-72 text-white flex flex-col rounded-tr-[120px] p-8" style={{backgroundColor: "#1e88e5"}}>
        <div className="flex items-center gap-2 mb-2">
          <Image src="/assets/motoresq_logo.png" alt="MotoResQ Logo" width={100} height={100} />
          <h1 className="text-2xl font-semibold" style={{ marginLeft: "-10px" }}>
            MotoResQ
          </h1>
        </div>

        <div className="border-t border-white/30 mb-10"></div>

        {/* Menu */}
        <nav className="flex flex-col gap-6 text-lg">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 hover:opacity-80"
          >
            <ICONS.dashboard size={24} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/users"
            className="flex items-center gap-4 hover:opacity-80"
          >
            <ICONS.users size={24} />
            Users
          </Link>

          <Link
            href="/dashboard/technicians"
            className="flex items-center gap-4 hover:opacity-80"
          >
            <ICONS.user_cog size={24} />
            Technicians
          </Link>

          <Link
            href="/dashboard/requests"
            className="flex items-center gap-4 hover:opacity-80"
          >
            <ICONS.file_text size={24} />
            Requests
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-4 hover:opacity-80"
          >
            <ICONS.settings size={24} />
            Settings
          </Link>
        </nav>

        {/* Logout at bottom */}
        <div className="mt-auto">
          <Link
            href="/"
            className="flex items-center gap-4 text-lg hover:opacity-80"
          >
            <ICONS.logout size={24} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-10 overflow-auto">{children}</main>
    </div>
  );
}