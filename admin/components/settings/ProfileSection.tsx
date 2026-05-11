"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function nameInitial(name: string) {
  const t = name.trim();
  if (!t) return "?";
  return t[0].toUpperCase();
}

function ProfileAvatar({
  avatarUrl,
  displayName,
}: {
  avatarUrl: string;
  displayName: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-500"
        aria-hidden
      >
        {nameInitial(displayName)}
      </div>
    );
  }

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-100 shadow-sm">
      <Image
        src={avatarUrl}
        alt=""
        fill
        className="object-cover"
        sizes="80px"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export function ProfileSection({
  displayName,
  avatarUrl,
  onSelectImage,
  isUploading,
}: {
  displayName: string;
  avatarUrl: string | null;
  onSelectImage?: (file: File) => void | Promise<void>;
  isUploading?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const initial = nameInitial(displayName);

  return (
    <section aria-labelledby="profile-picture-heading" className="space-y-4">
      <h2
        id="profile-picture-heading"
        className="text-sm font-medium text-gray-500"
      >
        Your Profile Picture
      </h2>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void onSelectImage?.(file);
        }}
      />
      <div className="flex flex-wrap items-center gap-4">
        {avatarUrl ? (
          <ProfileAvatar
            key={avatarUrl}
            avatarUrl={avatarUrl}
            displayName={displayName}
          />
        ) : (
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-500"
            aria-hidden
          >
            {initial}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileRef.current?.click()}
            className="btn rounded-xl border-0 bg-blue-500 px-5 text-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isUploading ? "Uploading…" : "Upload New"}
          </button>
          <button
            type="button"
            disabled
            title="Removing the profile picture is not supported yet."
            className="btn btn-ghost cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-5 font-medium text-gray-500 opacity-60"
          >
            Remove Profile Picture
          </button>
        </div>
      </div>
    </section>
  );
}
