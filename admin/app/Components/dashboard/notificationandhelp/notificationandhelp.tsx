"use client";

import { ICONS } from "@/app/Shared/Constants/icons";
import { NotificationsPopover } from "./NotificationsPopover";

interface NotificationAndHelpProps {
  onHelpClick: () => void;
}

export function NotificationAndHelp({ onHelpClick }: NotificationAndHelpProps) {
  return (
    <div className="flex items-center gap-8">
      <NotificationsPopover />

      <button
        type="button"
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
        aria-label="Help"
        onClick={onHelpClick}
      >
        <ICONS.help size={32} className="text-gray-500 pointer-events-none" />
      </button>
    </div>
  );
}
