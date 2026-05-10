"use client";
import BASE_URL from "@/app/Shared/BASE_URL/BASE_URL";

export function useDashboard() {
  const fetchDashboard = async () => {
    const response = await fetch(`${BASE_URL}/service-request/counts/summary`);
    const data = await response.json();
    return data;
  };

  return { fetchDashboard };
}
