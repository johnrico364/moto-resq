"use client";

import { useEffect, useState } from "react";

type ActivityStatus = "Active" | "Inactive";

interface Technician {
  id: number;
  name: string;
  phone: string;
  expertise: string[];
  status: ActivityStatus;
  avatar: string;
  registeredDate: string;
  email: string;
  location: string;
  documents: { name: string; date: string; size: string }[];
}

interface TechniciansResponse {
  data?: unknown;
}

const TECHNICIANS_ENDPOINT = "http://localhost:4000/api/technicians/";

function toActivityStatus(value: unknown): ActivityStatus {
  return String(value).toLowerCase() === "active" ? "Active" : "Inactive";
}

function mapTechnician(technician: Record<string, unknown>, index: number): Technician {
  const expertiseValue = technician.expertise;
  const expertise = Array.isArray(expertiseValue)
    ? expertiseValue.map((item) => String(item))
    : typeof expertiseValue === "string"
      ? expertiseValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const documentsValue = technician.documents;
  const documents = Array.isArray(documentsValue)
    ? documentsValue.map((doc) => {
        const item = doc as Record<string, unknown>;
        return {
          name: String(item.name ?? "Document"),
          date: String(item.date ?? ""),
          size: String(item.size ?? ""),
        };
      })
    : [];

  return {
    id: Number(technician.id ?? index + 1),
    name: String(technician.name ?? "Unknown Technician"),
    phone: String(technician.phone ?? technician.phoneNumber ?? ""),
    expertise,
    status: toActivityStatus(technician.status),
    avatar: String(technician.avatar ?? ""),
    registeredDate: String(technician.registeredDate ?? technician.createdAt ?? ""),
    email: String(technician.email ?? ""),
    location: String(technician.location ?? ""),
    documents,
  };
}

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[] | null>(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch(TECHNICIANS_ENDPOINT);
        const result = (await response.json()) as TechniciansResponse;
        console.log(result);
        if (!response.ok) {
          setTechnicians([]);
          return;
        }

        const rawData = Array.isArray(result) ? result : result.data;
        const technicianList = Array.isArray(rawData)
          ? rawData.map((item, index) => mapTechnician(item as Record<string, unknown>, index))
          : [];

        setTechnicians(technicianList);
      } catch (_error) {
        setTechnicians([]);
      }
    };

    void fetchTechnicians();
  }, []);

  return { technicians };
}