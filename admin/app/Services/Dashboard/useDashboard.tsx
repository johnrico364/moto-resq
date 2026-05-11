"use client";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function useDashboard() {
  const fetchDashboard = async () => {
    const response = await fetch(`${BASE_URL}/service-request/counts/summary`);
    const data = await response.json();
    return data;
  };

  return { fetchDashboard };
}
