"use client";

import { useCallback, useEffect, useState } from "react";

export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole = "user" | "admin";
export type VehicleType = "Motorcycle" | "Car";

export interface DashboardVehicle {
  _id?: string;
  type: VehicleType;
  brand: string;
  model: string;
  plate_number: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: UserStatus;
  role: UserRole;
  vehicles: DashboardVehicle[];
  profileImage?: string;
}

export interface PatchUserPayload {
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
  vehicles: Array<{
    _id?: string;
    type: VehicleType;
    brand: string;
    model: string;
    plate_number: string;
  }>;
  profile_image?: string;
}

interface UsersResponse {
  data?: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";
const USERS_ENDPOINT = `${BASE_URL}/users`;

function toUserStatus(value: unknown): UserStatus {
  const normalized = String(value).toLowerCase();
  if (normalized === "inactive" || normalized === "suspended") {
    return normalized;
  }

  return "active";
}

function toUserRole(value: unknown): UserRole {
  return String(value).toLowerCase() === "admin" ? "admin" : "user";
}

function mapVehicles(raw: unknown): DashboardVehicle[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const v = item as Record<string, unknown>;
    const typeStr = String(v.type ?? "Motorcycle");
    const type: VehicleType = typeStr === "Car" ? "Car" : "Motorcycle";
    const idRaw = v._id;
    return {
      ...(idRaw !== undefined && idRaw !== null ? { _id: String(idRaw) } : {}),
      type,
      brand: String(v.brand ?? ""),
      model: String(v.model ?? ""),
      plate_number: String(v.plate_number ?? ""),
    };
  });
}

function mapUser(user: Record<string, unknown>, index: number): DashboardUser {
  const profileRaw = user.profile_image;
  return {
    id: String(user._id ?? user.id ?? index + 1),
    name: String(user.name ?? "Unknown User"),
    email: String(user.email ?? ""),
    phone: String(user.phone ?? ""),
    registeredDate: String(user.created_at ?? user.registeredDate ?? ""),
    status: toUserStatus(user.status),
    role: toUserRole(user.role),
    vehicles: mapVehicles(user.vehicles),
    ...(profileRaw !== undefined && profileRaw !== null && String(profileRaw)
      ? { profileImage: String(profileRaw) }
      : {}),
  };
}

export async function patchUser(
  id: string,
  data: PatchUserPayload,
  imageFile?: File | null,
): Promise<{ ok: boolean; message?: string }> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
    method: "PATCH",
    body: formData,
  });

  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || result.success === false) {
    return {
      ok: false,
      message: result.message ?? "Update failed.",
    };
  }

  return { ok: true };
}

export const useUser = () => {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (showLoading: boolean) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch(USERS_ENDPOINT);
      const result = (await response.json()) as UsersResponse;

      if (!response.ok) {
        setUsers([]);
        setError("Failed to load users.");
        return;
      }

      const rawData = Array.isArray(result) ? result : result.data;
      const list = Array.isArray(rawData)
        ? rawData.map((item, index) => mapUser(item as Record<string, unknown>, index))
        : [];
      setUsers(list);
    } catch (_err) {
      setUsers([]);
      setError("Failed to load users.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchUsers(true);
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: () => fetchUsers(false),
  };
};
