"use client";

import { useCallback, useEffect, useState } from "react";
import {
  profileImageToUrl,
} from "@/app/Services/Auth/authSession";
import type { RequestRow, RequestStatItem } from "@/lib/requests/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

interface OverviewPayload {
  stats: unknown[];
  requests: unknown[];
}

function shortId(raw: unknown): string {
  if (!raw) return "";
  const s = String(raw);
  return s.slice(-7).toUpperCase();
}

function fallbackAvatar(seed: string): string {
  return `https://i.pravatar.cc/128?u=${encodeURIComponent(seed)}`;
}

function mapRequestRow(raw: unknown): RequestRow | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o._id != null ? String(o._id) : null;
  if (!id) return null;

  const userRaw = o.user;
  let userName = "Unknown";
  let avatarUrl: string | undefined;
  if (userRaw && typeof userRaw === "object") {
    const u = userRaw as Record<string, unknown>;
    if (typeof u.name === "string" && u.name) userName = u.name;
    const profile =
      typeof u.profile_image === "string" ? u.profile_image : undefined;
    avatarUrl = profileImageToUrl(profile, BASE_URL);
  }

  const techRaw = o.technician;
  let technicianId = "";
  if (techRaw && typeof techRaw === "object") {
    const t = techRaw as Record<string, unknown>;
    if (t._id != null) technicianId = shortId(t._id);
  }

  const problem =
    typeof o.problem_type === "string" ? o.problem_type : "Request";
  const status = typeof o.status === "string" ? o.status : "Pending";

  return {
    id,
    userName,
    avatar: avatarUrl ?? fallbackAvatar(id),
    requestId: shortId(id),
    technicianId,
    price: null,
    issueType: problem,
    status,
  };
}

async function fetchOverview(): Promise<OverviewPayload | null> {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/requests-overview`);
    let json: ApiResponse<OverviewPayload> | null = null;
    try {
      json = (await res.json()) as ApiResponse<OverviewPayload>;
    } catch {
      return null;
    }
    if (!res.ok || json?.success === false || !json.data) {
      return null;
    }
    return json.data;
  } catch {
    return null;
  }
}

export function useRequestsOverview() {
  const [stats, setStats] = useState<RequestStatItem[]>([]);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await fetchOverview();
      if (!data) {
        setStats([]);
        setRows([]);
        setError("Unable to load requests.");
        return;
      }
      const statList = Array.isArray(data.stats)
        ? data.stats
            .map((s) => {
              if (!s || typeof s !== "object") return null;
              const o = s as Record<string, unknown>;
              const label = typeof o.label === "string" ? o.label : null;
              const raw = o.value;
              const value =
                typeof raw === "number"
                  ? raw
                  : typeof raw === "string"
                    ? Number(raw)
                    : NaN;
              if (!label || !Number.isFinite(value)) return null;
              return { label, value };
            })
            .filter((x): x is RequestStatItem => x != null)
        : [];
      const mapped = Array.isArray(data.requests)
        ? data.requests
            .map(mapRequestRow)
            .filter((x): x is RequestRow => x != null)
        : [];
      setStats(statList);
      setRows(mapped);
    } catch {
      setStats([]);
      setRows([]);
      setError("Unable to load requests.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { stats, rows, isLoading, error, refetch };
}
