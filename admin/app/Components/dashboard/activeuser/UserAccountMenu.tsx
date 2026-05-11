"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ICONS } from "@/app/Shared/Constants/icons";

interface UserAccountMenuProps {
  username: string;
  email: string;
  avatarUrl?: string;
  onSignOut: () => void;
}

export function UserAccountMenu({
  username,
  email,
  avatarUrl,
  onSignOut,
}: UserAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, close]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none text-left"
      >
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover grayscale"
            />
          ) : (
            <ICONS.user size={28} className="text-gray-500" />
          )}
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-[20px] font-bold text-black leading-tight tracking-wide">
            {username}
          </span>
          <span className="text-[13px] font-semibold text-gray-500 leading-tight mt-0.5">
            {email}
          </span>
        </div>
        <div className="ml-2 flex items-center text-black">
          <ICONS.drop_down size={24} />
        </div>
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          role="menu"
        >
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            role="menuitem"
            onClick={close}
          >
            Profile &amp; settings
          </Link>
          <button
            type="button"
            className="w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
            role="menuitem"
            onClick={() => {
              close();
              onSignOut();
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
