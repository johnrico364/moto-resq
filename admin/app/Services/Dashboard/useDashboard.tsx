"use client";

import { useCallback, useEffect, useState } from "react";
import {
  profileImageToUrl,
  technicianImageToUrl,
} from "@/app/Services/Auth/authSession";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";

export interface DashboardSummary {
  completedServices: number;
  registeredTechnicians: number;
  serviceRequests: number;
  registeredUsers: number;
  pendingRequests: number;
}

export interface DashboardPerson {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface DashboardNewRequest {
  id: string;
  requestId: string;
  problemType: string;
  status: string;
  createdAt: string;
  user: DashboardPerson | null;
  technician: DashboardPerson | null;
}

export interface DashboardNewUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
  status: string;
}

export interface DashboardRecentRequest {
  id: string;
  problemType: string;
  status: string;
  createdAt: string;
  user: DashboardPerson | null;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

function shortId(raw: unknown): string {
  if (!raw) return "";
  const s = String(raw);
  return `#${s.slice(-7).toUpperCase()}`;
}

function mapPerson(
  raw: unknown,
  resolveImage: (img: string | undefined) => string | undefined,
): DashboardPerson | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o._id != null ? String(o._id) : null;
  if (!id) return null;
  const name = typeof o.name === "string" ? o.name : "Unknown";
  const profile =
    typeof o.profile_image === "string" ? o.profile_image : undefined;
  const avatarUrl = resolveImage(profile);
  return {
    id,
    name,
    ...(avatarUrl ? { avatarUrl } : {}),
  };
}

function mapNewRequest(raw: unknown): DashboardNewRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o._id != null ? String(o._id) : null;
  if (!id) return null;
  return {
    id,
    requestId: shortId(id),
    problemType: typeof o.problem_type === "string" ? o.problem_type : "—",
    status: typeof o.status === "string" ? o.status : "Pending",
    createdAt: typeof o.createdAt === "string" ? o.createdAt : "",
    user: mapPerson(o.user, (img) => profileImageToUrl(img, BASE_URL)),
    technician: mapPerson(o.technician, (img) =>
      technicianImageToUrl(img, BASE_URL),
    ),
  };
}

function mapNewUser(raw: unknown): DashboardNewUser | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o._id != null ? String(o._id) : null;
  if (!id) return null;
  const profile =
    typeof o.profile_image === "string" ? o.profile_image : undefined;
  const avatarUrl = profileImageToUrl(profile, BASE_URL);
  return {
    id,
    name: typeof o.name === "string" ? o.name : "Unknown User",
    email: typeof o.email === "string" ? o.email : "",
    phone: typeof o.phone === "string" ? o.phone : "",
    createdAt: typeof o.created_at === "string" ? o.created_at : "",
    status: typeof o.status === "string" ? o.status : "active",
    ...(avatarUrl ? { avatarUrl } : {}),
  };
}

function mapRecent(raw: unknown): DashboardRecentRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o._id != null ? String(o._id) : null;
  if (!id) return null;
  return {
    id,
    problemType: typeof o.problem_type === "string" ? o.problem_type : "—",
    status: typeof o.status === "string" ? o.status : "Pending",
    createdAt: typeof o.createdAt === "string" ? o.createdAt : "",
    user: mapPerson(o.user, (img) => profileImageToUrl(img, BASE_URL)),
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    let json: ApiResponse<T> | null = null;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch {
      // non-JSON response (e.g. HTML 404 page)
    }
    if (!res.ok || json?.success === false) {
      console.warn(
        `[useDashboard] ${url} failed: ${res.status} ${res.statusText}`,
        json?.message ?? "",
      );
      return null;
    }
    return (json?.data ?? null) as T | null;
  } catch (err) {
    console.warn(`[useDashboard] ${url} threw:`, err);
    return null;
  }
}

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [newRequests, setNewRequests] = useState<DashboardNewRequest[]>([]);
  const [newUsers, setNewUsers] = useState<DashboardNewUser[]>([]);
  const [recentActivity, setRecentActivity] = useState<
    DashboardRecentRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    try {
      const [summaryRes, requestsRes, usersRes, activityRes] =
        await Promise.all([
          fetchJson<DashboardSummary>(`${BASE_URL}/dashboard/summary`),
          fetchJson<unknown[]>(`${BASE_URL}/dashboard/new-requests?limit=5`),
          fetchJson<unknown[]>(`${BASE_URL}/dashboard/new-users?limit=5`),
          fetchJson<unknown[]>(`${BASE_URL}/dashboard/recent-activity?limit=10`),
        ]);

      if (summaryRes) {
        setSummary(summaryRes);
      } else {
        setError("Unable to load dashboard summary.");
      }

      setNewRequests(
        Array.isArray(requestsRes)
          ? requestsRes
              .map(mapNewRequest)
              .filter((x): x is DashboardNewRequest => x != null)
          : [],
      );
      setNewUsers(
        Array.isArray(usersRes)
          ? usersRes
              .map(mapNewUser)
              .filter((x): x is DashboardNewUser => x != null)
          : [],
      );
      setRecentActivity(
        Array.isArray(activityRes)
          ? activityRes
              .map(mapRecent)
              .filter((x): x is DashboardRecentRequest => x != null)
          : [],
      );
    } catch {
      setError("Unable to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
    const interval = setInterval(() => {
      void refetch();
    }, 25_000);
    return () => clearInterval(interval);
  }, [refetch]);

  return {
    summary,
    newRequests,
    newUsers,
    recentActivity,
    isLoading,
    error,
    refetch,
  };
}

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    const data = await fetchJson<DashboardSummary>(
      `${BASE_URL}/dashboard/summary`,
    );
    if (data) {
      setSummary(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refetch();
    const interval = setInterval(() => {
      void refetch();
    }, 25_000);
    return () => clearInterval(interval);
  }, [refetch]);

  return { summary, isLoading, refetch };
}
