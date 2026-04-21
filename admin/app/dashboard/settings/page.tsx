"use client";

import { useMemo, useState } from "react";

const initialProfile = {
  fullName: "Cedrick C. Alegsao",
  email: "cedrickalegsao@gmail.com",
  username: "Cedrick",
  phone: "+63 923 572 1763",
};

export default function Settings() {
  const [tab, setTab] = useState<"account" | "service">("account");
  const [profile, setProfile] = useState(() => ({ ...initialProfile }));
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  const hasProfilePhoto = useMemo(() => Boolean(profilePhoto), [profilePhoto]);

  const updateField = (field: keyof typeof initialProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoUpload = (file: File | null) => {
    if (!file) return;
    setProfilePhoto(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setProfilePhoto("");
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 mb-8">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-[#0D0DA8]">
            Settings
          </h1>
        </div>
        {tab === "service" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="mr-2 inline-flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Showing</span>
              <button
                type="button"
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-100 px-2 text-sm font-semibold text-[#1E88E5]"
              >
                9
              </button>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Filter
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#1E88E5] px-4 text-sm font-semibold text-white transition hover:bg-[#1669c1]"
            >
              + Create service category
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex flex-wrap items-end gap-6">
          <button
            type="button"
            onClick={() => setTab("account")}
            className={`relative px-0 pb-2 text-sm font-semibold transition-colors ${
              tab === "account"
                ? "text-[#1E88E5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Account Settings</span>
            {tab === "account" && (
              <span className="pointer-events-none absolute -bottom-px left-0 right-0 h-[7px] rounded-t-full bg-[#1E88E5]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("service")}
            className={`relative px-0 pb-2 text-sm font-semibold transition-colors ${
              tab === "service"
                ? "text-[#1E88E5]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Service Categories</span>
            {tab === "service" && (
              <span className="pointer-events-none absolute -bottom-px left-0 right-0 h-[7px] rounded-t-full bg-[#1E88E5]" />
            )}
          </button>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        {tab === "account" ? (
          <div className="space-y-8 min-h-[690px]">
            <div className="border-b border-gray-200 pb-6">
              <p className="mb-3 text-sm font-medium text-[#919191]">
                Your Profile Picture
              </p>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100 border border-gray-200 text-lg font-semibold text-gray-600">
                  {hasProfilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>C</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex h-10 min-w-[132px] cursor-pointer items-center justify-center rounded-md bg-[#1e88e5] px-6 text-sm font-semibold text-white transition hover:bg-[#1669c1]">
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) =>
                        handlePhotoUpload(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="inline-flex h-10 min-w-[132px] items-center justify-center rounded-md border border-[#D9D9D9] bg-[#D9D9D9] px-6 text-sm font-semibold text-gray-700 transition hover:brightness-95"
                  >
                    Remove Profile Picture
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                </div>
                <input
                  value={profile.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  className="w-full rounded-[16px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e88e5]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[2px] bg-[#22C55E] text-[10px] font-bold leading-none text-white">
                      ✓
                    </span>
                    Verified
                  </span>
                </div>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="w-full rounded-[16px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e88e5]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Username
                  </label>
                </div>
                <input
                  value={profile.username}
                  onChange={(event) =>
                    updateField("username", event.target.value)
                  }
                  className="w-full rounded-[16px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e88e5]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[2px] bg-[#22C55E] text-[10px] font-bold leading-none text-white">
                      ✓
                    </span>
                    Verified
                  </span>
                </div>
                <input
                  value={profile.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className="w-full rounded-[16px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#1e88e5]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="rounded-md bg-[#0D0DA8] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex min-h-[690px] flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Service ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Service Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-700">01</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      Flat Tire
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Tire replacement or repair
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#1E88E5] text-xs font-bold text-white"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded bg-red-500 text-xs font-bold text-white"
                        >
                          ■
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">02</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      Battery Jumpstart
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      Battery Assistance
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#1E88E5] text-xs font-bold text-white"
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded bg-red-500 text-xs font-bold text-white"
                        >
                          ■
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-auto flex items-center justify-between border-t border-gray-200 px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <span>‹</span>
                  <span>Previous</span>
                </button>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <button type="button">01</button>
                  <button type="button">02</button>
                  <button
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#1E88E5] text-xs font-semibold text-white"
                  >
                    03
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400"
                >
                  <span>Next</span>
                  <span>›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
