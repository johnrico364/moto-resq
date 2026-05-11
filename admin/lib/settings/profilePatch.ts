import { localToApiPhone } from "./phone";

export type ProfilePatchPayload = {
  name: string;
  username: string;
  email: string;
  phone: string;
};

/** Reads current account field values from the DOM (IDs set in AccountForm). */
export function readProfilePatchFromForm(): ProfilePatchPayload | null {
  const nameEl = document.getElementById(
    "settings-full-name",
  ) as HTMLInputElement | null;
  const usernameEl = document.getElementById(
    "settings-username",
  ) as HTMLInputElement | null;
  const emailEl = document.getElementById(
    "settings-email",
  ) as HTMLInputElement | null;
  const phoneEl = document.getElementById(
    "settings-phone",
  ) as HTMLInputElement | null;

  if (!nameEl) return null;

  return {
    name: nameEl.value.trim(),
    username: usernameEl?.value.trim() ?? "",
    email: emailEl?.value.trim() ?? "",
    phone: localToApiPhone(phoneEl?.value ?? ""),
  };
}
