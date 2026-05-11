"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { SettingsProfile } from "@/lib/settings/types";

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
      Verified
    </span>
  );
}

export interface AccountFormValues {
  fullName: string;
  username: string;
  email: string;
  phoneLocal: string;
}

export function AccountForm({
  initial,
  onSave,
  isSaving,
  saveError,
}: {
  initial: SettingsProfile;
  onSave?: (values: AccountFormValues) => void | Promise<void>;
  isSaving?: boolean;
  saveError?: string | null;
}) {
  const [fullName, setFullName] = useState(initial.fullName);
  const [username, setUsername] = useState(initial.username);
  const [email, setEmail] = useState(initial.email);
  const [phoneLocal, setPhoneLocal] = useState(initial.phoneLocal);

  return (
    <form
      className="space-y-8"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave?.({ fullName, username, email, phoneLocal });
      }}
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-x-8">
        <div className="space-y-2">
          <label htmlFor="settings-full-name" className="text-sm font-medium text-gray-500">
            Full Name
          </label>
          <input
            id="settings-full-name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input input-bordered w-full rounded-2xl border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-shadow duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="settings-email" className="text-sm font-medium text-gray-500">
              Email Address
            </label>
            <VerifiedBadge />
          </div>
          <input
            id="settings-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full rounded-2xl border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-shadow duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-username" className="text-sm font-medium text-gray-500">
            Username
          </label>
          <input
            id="settings-username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full rounded-2xl border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-shadow duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="settings-phone" className="text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <VerifiedBadge />
          </div>
          <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500/25">
            <span className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
              +63
            </span>
            <input
              id="settings-phone"
              type="tel"
              autoComplete="tel-national"
              value={phoneLocal}
              onChange={(e) => setPhoneLocal(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-base outline-none focus:ring-0"
              placeholder="9XX XXX XXXX"
            />
          </div>
        </div>
      </div>
      {saveError ? (
        <p className="text-sm text-red-600" role="alert">
          {saveError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSaving}
        className="btn rounded-xl border-0 bg-[#110D8C] px-8 text-white shadow-md transition-transform duration-200 hover:scale-[1.02] hover:bg-[#0d0a6e] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Update Profile"}
      </button>
    </form>
  );
}
