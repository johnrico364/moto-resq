"use client";

import { useCallback, useEffect, useState } from "react";

export interface DashboardServiceRequest {
  id: string;
  problem_type: string;
  status: string;
  createdAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";

function mapItem(raw: unknown): DashboardServiceRequest | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o._id != null ? String(o._id) : null;
  if (!id) return null;
  const problem = o.problem_type;
  const status = o.status;
  const created =
    o.createdAt != null
      ? String(o.createdAt)
      : o.created_at != null
        ? String(o.created_at)
        : "";
  return {
    id,
    problem_type: typeof problem === "string" ? problem : "Request",
    status: typeof status === "string" ? status : "—",
    createdAt: created,
  };
}

export function useServiceRequests() {
  const [requests, setRequests] = useState<DashboardServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/service-request`);
      const json = (await res.json()) as {
        success?: boolean;
        data?: unknown;
        message?: string;
      };
      if (!res.ok || !json.success || !Array.isArray(json.data)) {
        setRequests([]);
        setError(
          typeof json.message === "string" && json.message
            ? json.message
            : "Unable to load activity.",
        );
        return;
      }
      const mapped = json.data
        .map(mapItem)
        .filter((x): x is DashboardServiceRequest => x != null);
      setRequests(mapped);
    } catch {
      setRequests([]);
      setError("Unable to load activity.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  return { requests, isLoading, error, refetch: fetchRequests };
}
