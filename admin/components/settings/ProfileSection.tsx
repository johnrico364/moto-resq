"use client";

import Image from "next/image";
import { useState } from "react";

function nameInitial(name: string) {
  const t = name.trim();
  if (!t) return "?";
  return t[0].toUpperCase();
}

export function ProfileSection({
  displayName,
  avatarSrc,
}: {
  displayName: string;
  avatarSrc: string | null;
}) {
  const [imgError, setImgError] = useState(false);
  const initial = nameInitial(displayName);
  const showImage = Boolean(avatarSrc) && !imgError;

  return (
    <section aria-labelledby="profile-picture-heading" className="space-y-4">
      <h2
        id="profile-picture-heading"
        className="text-sm font-medium text-gray-500"
      >
        Your Profile Picture
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        {showImage ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-100 shadow-sm">
            <Image
              src={avatarSrc as string}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
              onError={() => setImgError(true)}
            />
          </div>
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
            className="btn rounded-xl border-0 bg-blue-500 px-5 text-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:bg-blue-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Upload New
          </button>
          <button
            type="button"
            className="btn btn-ghost rounded-xl border border-gray-200 bg-gray-100 px-5 font-medium text-gray-800 transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Remove Profile Picture
          </button>
        </div>
      </div>
    </section>
  );
}
