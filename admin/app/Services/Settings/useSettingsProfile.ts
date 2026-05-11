"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProfilePatchPayload } from "@/lib/settings/profilePatch";
import { apiPhoneToLocal } from "@/lib/settings/phone";
import type { SettingsProfile } from "@/lib/settings/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

interface ProfileApiData {
  userId?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarSrc?: string | null;
}

function mapProfile(raw: ProfileApiData | null | undefined): SettingsProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const userId = typeof raw.userId === "string" ? raw.userId : null;
  if (!userId) return null;
  const fullName = typeof raw.fullName === "string" ? raw.fullName : "";
  const username = typeof raw.username === "string" ? raw.username : "";
  const email = typeof raw.email === "string" ? raw.email : "";
  const phone = typeof raw.phone === "string" ? raw.phone : "";
  const avatarSrc =
    raw.avatarSrc === null || raw.avatarSrc === undefined
      ? null
      : typeof raw.avatarSrc === "string"
        ? raw.avatarSrc
        : null;

  return {
    userId,
    fullName,
    username,
    email,
    phoneLocal: apiPhoneToLocal(phone),
    avatarSrc,
  };
}

async function fetchProfile(): Promise<SettingsProfile | null> {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/settings/profile`);
    let json: ApiResponse<ProfileApiData> | null = null;
    try {
      json = (await res.json()) as ApiResponse<ProfileApiData>;
    } catch {
      return null;
    }
    if (!res.ok || json?.success === false || !json.data) {
      return null;
    }
    return mapProfile(json.data);
  } catch {
    return null;
  }
}

export function useSettingsProfile() {
  const [profile, setProfile] = useState<SettingsProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await fetchProfile();
      if (!data) {
        setProfile(null);
        setError("Unable to load profile.");
        return;
      }
      setProfile(data);
    } catch {
      setProfile(null);
      setError("Unable to load profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const updateProfile = useCallback(
    async (userId: string, payload: ProfilePatchPayload) => {
      const res = await fetch(`${BASE_URL}/dashboard/settings/profile/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let json: ApiResponse<unknown> | null = null;
      try {
        json = (await res.json()) as ApiResponse<unknown>;
      } catch {
        throw new Error("Invalid response from server.");
      }
      if (!res.ok || json?.success === false) {
        throw new Error(
          typeof json?.message === "string" ? json.message : "Update failed.",
        );
      }
      await refetch();
    },
    [refetch],
  );

  const updateProfileWithImage = useCallback(
    async (userId: string, formData: FormData) => {
      const res = await fetch(`${BASE_URL}/dashboard/settings/profile/${userId}`, {
        method: "PATCH",
        body: formData,
      });
      let json: ApiResponse<unknown> | null = null;
      try {
        json = (await res.json()) as ApiResponse<unknown>;
      } catch {
        throw new Error("Invalid response from server.");
      }
      if (!res.ok || json?.success === false) {
        throw new Error(
          typeof json?.message === "string" ? json.message : "Update failed.",
        );
      }
      await refetch();
    },
    [refetch],
  );

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    updateProfileWithImage,
  };
}
