"use client";

import { useCallback, useEffect, useState } from "react";
import { AccountForm } from "@/components/settings/AccountForm";
import { ProfileSection } from "@/components/settings/ProfileSection";
import {
  SERVICE_PAGE_SIZE_OPTIONS,
  ServiceCategoryTable,
  type ServiceSortKey,
} from "@/components/settings/ServiceCategoryTable";
import { SettingsTabs, type SettingsTabId } from "@/components/settings/SettingsTabs";
import type { SortDir } from "@/components/settings/GenericTable";
import { MOCK_PROFILE, MOCK_SERVICE_CATEGORIES } from "@/lib/settings/mockData";

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTabId>("account");
  const [shellVisible, setShellVisible] = useState(false);
  const [sortKey, setSortKey] = useState<ServiceSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [pageSize, setPageSize] =
    useState<(typeof SERVICE_PAGE_SIZE_OPTIONS)[number]>(9);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShellVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSort = useCallback((key: ServiceSortKey) => {
    setSortKey((prev) => {
      if (prev !== key) {
        setSortDir("asc");
        return key;
      }
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return prev;
    });
  }, []);

  const handlePageSizeChange = useCallback(
    (n: (typeof SERVICE_PAGE_SIZE_OPTIONS)[number]) => {
      setPageSize(n);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <div
      className={`min-h-full space-y-6 bg-[#f5f5f5] -mx-10 px-10 py-6 transition-opacity duration-500 ${
        shellVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#110D8C]">
          Settings
        </h1>
      </header>

      <SettingsTabs active={tab} onChange={setTab} />

      <div className="grid">
        <section
          id="settings-panel-account"
          role="tabpanel"
          aria-labelledby="settings-tab-account"
          aria-hidden={tab !== "account"}
          inert={tab !== "account" ? true : undefined}
          className={`col-start-1 row-start-1 transition-opacity duration-200 ${
            tab === "account"
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
            <ProfileSection
              displayName={MOCK_PROFILE.fullName}
              avatarSrc={MOCK_PROFILE.avatarSrc}
            />
            <div className="my-8 h-px w-full bg-gray-100" />
            <AccountForm initial={MOCK_PROFILE} />
          </div>
        </section>

        <section
          id="settings-panel-services"
          role="tabpanel"
          aria-labelledby="settings-tab-services"
          aria-hidden={tab !== "services"}
          inert={tab !== "services" ? true : undefined}
          className={`col-start-1 row-start-1 transition-opacity duration-200 ${
            tab === "services"
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          <ServiceCategoryTable
            categories={MOCK_SERVICE_CATEGORIES}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </section>
      </div>
    </div>
  );
}
