"use client";

import { useEffect, useState } from "react";

export type UserStatus = "active" | "inactive" | "suspended";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  status: UserStatus;
}

interface UsersResponse {
  data?: unknown;
}

const USERS_ENDPOINT = "http://localhost:4000/api/users";

function toUserStatus(value: unknown): UserStatus {
  const normalized = String(value).toLowerCase();
  if (normalized === "inactive" || normalized === "suspended") {
    return normalized;
  }

  return "active";
}

function mapUser(user: Record<string, unknown>, index: number): DashboardUser {
  return {
    id: String(user._id ?? user.id ?? index + 1),
    name: String(user.name ?? "Unknown User"),
    email: String(user.email ?? ""),
    phone: String(user.phone ?? ""),
    registeredDate: String(user.created_at ?? user.registeredDate ?? ""),
    status: toUserStatus(user.status),
  };
}

export const useUser = () => {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        setIsLoading(true);
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
      } catch (_error) {
        setUsers([]);
        setError("Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    void getAllUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
  };
};