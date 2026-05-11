"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ICONS } from "@/app/Shared/Constants/icons";
import { useServiceRequests } from "@/app/Services/ServiceRequest/useServiceRequests";

const PANEL_LIMIT = 6;

interface NotificationsPopoverProps {
  count?: number;
}

export function NotificationsPopover({ count = 0 }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { requests, isLoading, error } = useServiceRequests();

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

  const recent = requests.slice(0, PANEL_LIMIT);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
        aria-label={
          count > 0
            ? `Notifications, ${count} pending`
            : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <ICONS.bell size={32} className="text-gray-500 pointer-events-none" />
        {count > 0 ? (
          <span className="pointer-events-none absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 px-1 text-[11px] font-bold text-white flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-gray-200 bg-white py-3 shadow-lg"
          role="menu"
        >
          <div className="border-b border-gray-100 px-4 pb-2">
            <p className="text-sm font-bold text-gray-900">Activity</p>
            <p className="text-xs text-gray-500">Recent service requests</p>
          </div>

          <div className="max-h-72 overflow-y-auto px-2 py-2">
            {isLoading ? (
              <p className="px-2 py-4 text-sm text-gray-500">Loading…</p>
            ) : error ? (
              <p className="px-2 py-4 text-sm text-red-500">{error}</p>
            ) : recent.length === 0 ? (
              <p className="px-2 py-4 text-sm text-gray-500">
                No recent requests. New activity will appear here.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {recent.map((r) => (
                  <li key={r.id}>
                    <Link
                      href="/dashboard/requests"
                      className="block rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                      onClick={close}
                    >
                      <span className="block text-sm font-semibold text-gray-900">
                        {r.problem_type}
                      </span>
                      <span className="text-xs text-gray-500">{r.status}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-100 px-4 pt-2">
            <Link
              href="/dashboard/requests"
              className="text-xs font-semibold text-[#1e88e5] hover:underline"
              onClick={close}
            >
              View all requests
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
