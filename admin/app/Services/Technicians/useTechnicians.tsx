"use client";

import { useCallback, useEffect, useState } from "react";
import { technicianImageToUrl } from "@/app/Services/Auth/authSession";

export const TECHNICIAN_EXPERTISE_OPTIONS = [
  "Battery",
  "Towing",
  "Flat Tire",
  "Engine",
  "Electrical",
  "Brakes",
  "Other",
] as const;

export type TechnicianExpertise = (typeof TECHNICIAN_EXPERTISE_OPTIONS)[number];

export interface TechnicianDocumentItem {
  label: string;
  url: string;
}

export interface DashboardTechnician {
  id: string;
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  is_verified: boolean;
  is_available: boolean;
  registeredDate: string;
  rating: number;
  total_reviews: number;
  avatarUrl: string | undefined;
  /** Stored filename for PATCH when not replacing image */
  profileImage?: string;
  location: string;
  documents: TechnicianDocumentItem[];
}

export interface PatchTechnicianPayload {
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  is_verified: boolean;
  is_available: boolean;
  profile_image?: string;
  password?: string;
  location?: { lat: number; lng: number } | null;
}

interface TechniciansListResponse {
  success?: boolean;
  data?: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:4000/api";
const TECHNICIANS_ENDPOINT = `${BASE_URL}/technicians`;

function mapDocuments(raw: unknown): TechnicianDocumentItem[] {
  if (!raw || typeof raw !== "object") return [];
  const d = raw as Record<string, unknown>;
  const items: TechnicianDocumentItem[] = [];
  const idUrl = d.id_url;
  if (typeof idUrl === "string" && idUrl.trim()) {
    items.push({ label: "ID document", url: idUrl.trim() });
  }
  const certUrl = d.certificate_url;
  if (typeof certUrl === "string" && certUrl.trim()) {
    items.push({ label: "Certificate", url: certUrl.trim() });
  }
  return items;
}

function mapLocationString(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const loc = raw as Record<string, unknown>;
  const lat = loc.lat;
  const lng = loc.lng;
  if (typeof lat === "number" && typeof lng === "number") {
    return `${lat}, ${lng}`;
  }
  return "";
}

function mapTechnician(
  technician: Record<string, unknown>,
  index: number,
  baseUrl: string,
): DashboardTechnician {
  const allowed = new Set<string>(TECHNICIAN_EXPERTISE_OPTIONS);
  const expertiseValue = technician.expertise;
  const rawExpertise = Array.isArray(expertiseValue)
    ? expertiseValue.map((item) => String(item))
    : typeof expertiseValue === "string"
      ? expertiseValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  const expertise = rawExpertise.filter((item) => allowed.has(item));

  const idRaw = technician._id ?? technician.id;
  const id =
    idRaw !== undefined && idRaw !== null ? String(idRaw) : String(index + 1);

  const profileRaw = technician.profile_image;
  const profileImage =
    profileRaw !== undefined && profileRaw !== null && String(profileRaw).trim()
      ? String(profileRaw)
      : undefined;

  return {
    id,
    name: String(technician.name ?? "Unknown Technician"),
    email: String(technician.email ?? ""),
    phone: String(technician.phone ?? technician.phoneNumber ?? ""),
    expertise,
    is_verified: Boolean(technician.is_verified),
    is_available: Boolean(technician.is_available),
    registeredDate: String(
      technician.created_at ?? technician.registeredDate ?? "",
    ),
    rating: Number(technician.rating ?? 0),
    total_reviews: Number(technician.total_reviews ?? 0),
    avatarUrl: technicianImageToUrl(profileImage, baseUrl),
    ...(profileImage ? { profileImage } : {}),
    location: mapLocationString(technician.location),
    documents: mapDocuments(technician.documents),
  };
}

export async function patchTechnician(
  id: string,
  data: PatchTechnicianPayload,
  imageFile?: File | null,
): Promise<{ ok: boolean; message?: string }> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(`${TECHNICIANS_ENDPOINT}/${id}`, {
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

export async function deleteTechnician(
  id: string,
): Promise<{ ok: boolean; message?: string }> {
  const response = await fetch(`${TECHNICIANS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  const result = (await response.json()) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || result.success === false) {
    return {
      ok: false,
      message: result.message ?? "Delete failed.",
    };
  }

  return { ok: true };
}

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<DashboardTechnician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicians = useCallback(async (showLoading: boolean) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch(TECHNICIANS_ENDPOINT);
      const result = (await response.json()) as TechniciansListResponse;

      if (!response.ok) {
        setTechnicians([]);
        setError("Failed to load technicians.");
        return;
      }

      const rawData = result.data;
      const list = Array.isArray(rawData)
        ? rawData.map((item, index) =>
            mapTechnician(item as Record<string, unknown>, index, BASE_URL),
          )
        : [];
      setTechnicians(list);
    } catch (_err) {
      setTechnicians([]);
      setError("Failed to load technicians.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchTechnicians(true);
  }, [fetchTechnicians]);

  return {
    technicians,
    isLoading,
    error,
    refetch: () => fetchTechnicians(false),
  };
}
