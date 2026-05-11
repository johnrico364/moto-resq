"use client";

import { useCallback, useEffect, useState } from "react";
import { profileImageToUrl } from "@/app/Services/Auth/authSession";
import { useServiceCategories } from "@/app/Services/Settings/useServiceCategories";
import { useSettingsProfile } from "@/app/Services/Settings/useSettingsProfile";
import { AccountForm } from "@/components/settings/AccountForm";
import { LoadingSkeleton } from "@/components/settings/LoadingSkeleton";
import { ProfileSection } from "@/components/settings/ProfileSection";
import {
  SERVICE_PAGE_SIZE_OPTIONS,
  ServiceCategoryTable,
  type ServiceSortKey,
} from "@/components/settings/ServiceCategoryTable";
import {
  ServiceCategoryModal,
  type ServiceCategoryModalMode,
} from "@/components/settings/ServiceCategoryModal";
import { SettingsTabs, type SettingsTabId } from "@/components/settings/SettingsTabs";
import type { SortDir } from "@/components/settings/GenericTable";
import { localToApiPhone } from "@/lib/settings/phone";
import { readProfilePatchFromForm } from "@/lib/settings/profilePatch";
import type { ServiceCategory } from "@/lib/settings/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";

export default function SettingsPage() {
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
    updateProfile,
    updateProfileWithImage,
  } = useSettingsProfile();

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useServiceCategories();

  const [tab, setTab] = useState<SettingsTabId>("account");
  const [shellVisible, setShellVisible] = useState(false);
  const [sortKey, setSortKey] = useState<ServiceSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [pageSize, setPageSize] =
    useState<(typeof SERVICE_PAGE_SIZE_OPTIONS)[number]>(9);
  const [currentPage, setCurrentPage] = useState(1);

  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [svcModalOpen, setSvcModalOpen] = useState(false);
  const [svcModalMode, setSvcModalMode] =
    useState<ServiceCategoryModalMode>("create");
  const [svcModalRow, setSvcModalRow] = useState<ServiceCategory | null>(null);
  const [svcModalError, setSvcModalError] = useState<string | null>(null);
  const [svcSubmitting, setSvcSubmitting] = useState(false);

  const initialLoad = profileLoading || categoriesLoading;

  useEffect(() => {
    if (initialLoad) return;
    const id = requestAnimationFrame(() => setShellVisible(true));
    return () => cancelAnimationFrame(id);
  }, [initialLoad]);

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

  const openCreateModal = useCallback(() => {
    setSvcModalMode("create");
    setSvcModalRow(null);
    setSvcModalError(null);
    setSvcModalOpen(true);
  }, []);

  const openEditModal = useCallback((row: ServiceCategory) => {
    setSvcModalMode("edit");
    setSvcModalRow(row);
    setSvcModalError(null);
    setSvcModalOpen(true);
  }, []);

  const closeSvcModal = useCallback(() => {
    setSvcModalOpen(false);
    setSvcModalRow(null);
    setSvcModalError(null);
  }, []);

  const handleDeleteRow = useCallback(
    async (row: ServiceCategory) => {
      if (!row.mongoId) return;
      const ok = window.confirm(
        `Delete “${row.serviceName}”? This cannot be undone.`,
      );
      if (!ok) return;
      try {
        await deleteCategory(row.mongoId);
      } catch (e) {
        window.alert(
          e instanceof Error ? e.message : "Could not delete category.",
        );
      }
    },
    [deleteCategory],
  );

  const handleModalSubmit = useCallback(
    async (data: {
      serviceName: string;
      description: string;
      status: ServiceCategory["status"];
    }) => {
      setSvcModalError(null);
      setSvcSubmitting(true);
      try {
        if (svcModalMode === "create") {
          await createCategory(data);
        } else if (svcModalRow?.mongoId) {
          await updateCategory(svcModalRow.mongoId, data);
        } else {
          throw new Error("Missing category id.");
        }
        closeSvcModal();
      } catch (e) {
        setSvcModalError(
          e instanceof Error ? e.message : "Something went wrong.",
        );
      } finally {
        setSvcSubmitting(false);
      }
    },
    [
      svcModalMode,
      svcModalRow,
      createCategory,
      updateCategory,
      closeSvcModal,
    ],
  );

  const handleSaveProfile = useCallback(
    async (values: {
      fullName: string;
      username: string;
      email: string;
      phoneLocal: string;
    }) => {
      if (!profile) return;
      setSaveError(null);
      setIsSaving(true);
      try {
        await updateProfile(profile.userId, {
          name: values.fullName.trim(),
          username: values.username.trim(),
          email: values.email.trim(),
          phone: localToApiPhone(values.phoneLocal),
        });
      } catch (e) {
        setSaveError(
          e instanceof Error ? e.message : "Could not update profile.",
        );
      } finally {
        setIsSaving(false);
      }
    },
    [profile, updateProfile],
  );

  const handleSelectImage = useCallback(
    async (file: File) => {
      if (!profile) return;
      const patch =
        readProfilePatchFromForm() ??
        ({
          name: profile.fullName,
          username: profile.username,
          email: profile.email,
          phone: localToApiPhone(profile.phoneLocal),
        });
      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("data", JSON.stringify(patch));
        fd.append("image", file);
        await updateProfileWithImage(profile.userId, fd);
      } catch (e) {
        window.alert(
          e instanceof Error ? e.message : "Could not upload image.",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [profile, updateProfileWithImage],
  );

  if (initialLoad) {
    return <LoadingSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-full space-y-6 bg-[#f5f5f5] -mx-10 px-10 py-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#110D8C]">
          Settings
        </h1>
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{profileError ?? "Unable to load profile."}</span>
          <button
            type="button"
            onClick={() => void refetchProfile()}
            className="btn btn-sm rounded-xl border-red-300 bg-white text-red-800 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl =
    profileImageToUrl(profile.avatarSrc ?? undefined, BASE_URL) ?? null;

  return (
    <>
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

        {categoriesError ? (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{categoriesError}</span>
            <button
              type="button"
              onClick={() => void refetchCategories()}
              className="btn btn-sm rounded-xl border-amber-300 bg-white hover:bg-amber-100"
            >
              Retry
            </button>
          </div>
        ) : null}

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
                displayName={profile.fullName}
                avatarUrl={avatarUrl}
                onSelectImage={handleSelectImage}
                isUploading={isUploading}
              />
              <div className="my-8 h-px w-full bg-gray-100" />
              <AccountForm
                key={`${profile.userId}-${profile.fullName}-${profile.email}-${profile.phoneLocal}-${profile.username}-${profile.avatarSrc ?? ""}`}
                initial={profile}
                onSave={handleSaveProfile}
                isSaving={isSaving}
                saveError={saveError}
              />
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
              categories={categories}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onCreate={openCreateModal}
              onEdit={openEditModal}
              onDelete={handleDeleteRow}
            />
          </section>
        </div>
      </div>

      <ServiceCategoryModal
        open={svcModalOpen}
        mode={svcModalMode}
        initial={svcModalRow}
        onClose={closeSvcModal}
        onSubmit={handleModalSubmit}
        isSubmitting={svcSubmitting}
        error={svcModalError}
      />
    </>
  );
}
