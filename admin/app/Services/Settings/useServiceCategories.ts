"use client";

import { useCallback, useEffect, useState } from "react";
import type { ServiceCategory, ServiceCategoryStatus } from "@/lib/settings/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

function mapCategory(raw: unknown): ServiceCategory | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : null;
  const serviceName = typeof o.serviceName === "string" ? o.serviceName : null;
  const description =
    typeof o.description === "string" ? o.description : "";
  const statusRaw = o.status;
  const status: ServiceCategoryStatus =
    statusRaw === "Inactive" ? "Inactive" : "Active";
  const mongoId = o._id != null ? String(o._id) : undefined;
  if (!id || !serviceName) return null;
  return {
    id,
    serviceName,
    description,
    status,
    mongoId,
  };
}

async function fetchCategories(): Promise<{
  rows: ServiceCategory[];
  ok: boolean;
}> {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/settings/service-categories`);
    let json: ApiResponse<unknown> | null = null;
    try {
      json = (await res.json()) as ApiResponse<unknown>;
    } catch {
      return { rows: [], ok: false };
    }
    if (!res.ok || json?.success === false || !Array.isArray(json.data)) {
      return { rows: [], ok: false };
    }
    const rows = json.data
      .map(mapCategory)
      .filter((x): x is ServiceCategory => x != null);
    return { rows, ok: true };
  } catch {
    return { rows: [], ok: false };
  }
}

export interface ServiceCategoryBody {
  serviceName: string;
  description?: string;
  status?: ServiceCategoryStatus;
}

export function useServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { rows, ok } = await fetchCategories();
      setCategories(rows);
      if (!ok) {
        setError("Unable to load service categories.");
      }
    } catch {
      setCategories([]);
      setError("Unable to load service categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createCategory = useCallback(
    async (body: ServiceCategoryBody) => {
      const res = await fetch(`${BASE_URL}/dashboard/settings/service-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let json: ApiResponse<unknown> | null = null;
      try {
        json = (await res.json()) as ApiResponse<unknown>;
      } catch {
        throw new Error("Invalid response from server.");
      }
      if (!res.ok || json?.success === false) {
        throw new Error(
          typeof json?.message === "string" ? json.message : "Create failed.",
        );
      }
      await refetch();
    },
    [refetch],
  );

  const updateCategory = useCallback(
    async (mongoId: string, body: Partial<ServiceCategoryBody>) => {
      const res = await fetch(
        `${BASE_URL}/dashboard/settings/service-categories/${mongoId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
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

  const deleteCategory = useCallback(
    async (mongoId: string) => {
      const res = await fetch(
        `${BASE_URL}/dashboard/settings/service-categories/${mongoId}`,
        { method: "DELETE" },
      );
      let json: ApiResponse<unknown> | null = null;
      try {
        json = (await res.json()) as ApiResponse<unknown>;
      } catch {
        throw new Error("Invalid response from server.");
      }
      if (!res.ok || json?.success === false) {
        throw new Error(
          typeof json?.message === "string" ? json.message : "Delete failed.",
        );
      }
      await refetch();
    },
    [refetch],
  );

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
