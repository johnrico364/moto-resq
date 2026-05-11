/** Strip Philippines country prefix for display in the +63 local input. */
export function apiPhoneToLocal(phone: string): string {
  const t = phone.trim();
  if (!t) return "";
  return t
    .replace(/^\+63\s*/i, "")
    .replace(/^63\s*/, "")
    .trim();
}

/** Persist full international form for the API (User.phone). */
export function localToApiPhone(local: string): string {
  const trimmed = local.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;
  return `+63${digits}`;
}
