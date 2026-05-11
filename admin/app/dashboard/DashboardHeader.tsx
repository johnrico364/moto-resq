"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "../Components/dashboard/search/search";
import { NotificationAndHelp } from "../Components/dashboard/notificationandhelp/notificationandhelp";
import { UserAccountMenu } from "../Components/dashboard/activeuser/UserAccountMenu";
import { useAuth } from "../Services/Auth/useAuth";
import { usePageRouter } from "../Services/PageRouter/usePageRouter";

interface DashboardHeaderProps {
  displayName: string;
  displayEmail: string;
  avatarUrl: string;
  notificationCount?: number;
}

export function DashboardHeader({
  displayName,
  displayEmail,
  avatarUrl,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigate } = usePageRouter();
  const { signOut } = useAuth();

  const isSearchRoute = pathname === "/dashboard/search";
  const qFromUrl = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (isSearchRoute) {
      setSearchInput(qFromUrl);
    } else {
      setSearchInput("");
    }
  }, [isSearchRoute, qFromUrl]);

  const handleSearchSubmit = (key: string) => {
    const t = key.trim();
    if (!t) return;
    navigate(`/dashboard/search?q=${encodeURIComponent(t)}`);
  };

  return (
    <header className="flex items-center justify-between px-10 py-4 bg-gray-100 shrink-0 mt-10">
      <div className="flex-1 max-w-2xl mr-8">
        <Search
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={handleSearchSubmit}
        />
      </div>
      <div className="flex items-center gap-10">
        <NotificationAndHelp notificationCount={notificationCount} />
        <UserAccountMenu
          username={displayName}
          email={displayEmail}
          avatarUrl={avatarUrl || undefined}
          onSignOut={signOut}
        />
      </div>
    </header>
  );
}
