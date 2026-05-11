"use client";

import { useCallback, type KeyboardEvent } from "react";

export type SettingsTabId = "account" | "services";

const tabs: { id: SettingsTabId; label: string }[] = [
  { id: "account", label: "Account Settings" },
  { id: "services", label: "Service Categories" },
];

export function SettingsTabs({
  active,
  onChange,
}: {
  active: SettingsTabId;
  onChange: (id: SettingsTabId) => void;
}) {
  const focusTab = useCallback((id: SettingsTabId) => {
    document.getElementById(`settings-tab-${id}`)?.focus();
  }, []);

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const idx = tabs.findIndex((t) => t.id === active);
      if (idx < 0) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        onChange(next.id);
        queueMicrotask(() => focusTab(next.id));
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const next = tabs[(idx - 1 + tabs.length) % tabs.length];
        onChange(next.id);
        queueMicrotask(() => focusTab(next.id));
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        const next = tabs[0];
        onChange(next.id);
        queueMicrotask(() => focusTab(next.id));
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        const next = tabs[tabs.length - 1];
        onChange(next.id);
        queueMicrotask(() => focusTab(next.id));
      }
    },
    [active, focusTab, onChange],
  );

  return (
    <div className="-mx-1 border-b border-gray-200">
      <div
        role="tablist"
        aria-label="Settings sections"
        onKeyDown={onTabKeyDown}
        className="flex gap-8 overflow-x-auto px-1 pb-px scrollbar-thin"
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`settings-tab-${t.id}`}
              aria-selected={isActive}
              aria-controls={`settings-panel-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={`relative shrink-0 whitespace-nowrap pb-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {t.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-center rounded-full bg-blue-500 transition-transform duration-200 ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
