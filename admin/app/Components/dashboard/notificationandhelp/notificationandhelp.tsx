import { ICONS } from "@/app/Shared/Constants/icons";

interface NotificationAndHelpProps {
  onNotificationClick: () => void;
  onHelpClick: () => void;
}

export function NotificationAndHelp({
  onNotificationClick,
  onHelpClick,
}: NotificationAndHelpProps) {
  return (
    <div className="flex items-center gap-8">
      <button
        type="button"
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
        aria-label="Notifications"
      >
        <ICONS.bell
          size={32}
          className="text-gray-500"
          onClick={onNotificationClick}
        />
      </button>

      <button
        type="button"
        className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
        aria-label="Help"
      >
        <ICONS.help
          size={32}
          className="text-gray-500"
          onCanPlay={onHelpClick}
        />
      </button>
    </div>
  );
}
