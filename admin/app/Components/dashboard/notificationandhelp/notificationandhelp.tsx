"use client";

import { NotificationsPopover } from "./NotificationsPopover";

interface NotificationAndHelpProps {
  notificationCount?: number;
}

export function NotificationAndHelp({
  notificationCount = 0,
}: NotificationAndHelpProps) {
  return <NotificationsPopover count={notificationCount} />;
}
