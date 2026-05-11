export const AUTH_SESSION_STORAGE_KEY = "moto-resq-admin-auth";

export interface AuthUser {
  _id?: string;
  name?: string;
  email?: string;
  profile_image?: string;
  phone?: string;
  role?: string;
}

export interface AuthSessionPayload {
  token: string;
  user: AuthUser;
}

export function readSession(): AuthSessionPayload | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const obj = parsed as Record<string, unknown>;
    if (typeof obj.token !== "string" || !obj.user || typeof obj.user !== "object") {
      return null;
    }
    return { token: obj.token, user: obj.user as AuthUser };
  } catch {
    return null;
  }
}

export function writeSession(payload: AuthSessionPayload): void {
  sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(payload));
}

export function clearSessionStorage(): void {
  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function profileImageToUrl(
  profileImage: string | undefined,
  baseUrl: string | undefined,
): string | undefined {
  if (!profileImage?.trim() || !baseUrl?.trim()) {
    return undefined;
  }
  if (/^https?:\/\//i.test(profileImage)) {
    return profileImage;
  }
  const root = baseUrl.replace(/\/$/, "");
  return `${root}/images/user/${profileImage}`;
}
