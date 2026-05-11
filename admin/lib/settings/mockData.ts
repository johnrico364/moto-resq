import type { ServiceCategory, SettingsProfile } from "./types";

/** Set to `true` to verify empty table UI without hunting JSX. */
export const SHOW_EMPTY_SERVICE_CATEGORIES = false;

export const MOCK_PROFILE: SettingsProfile = {
  userId: "mock-user-id",
  fullName: "Cedrick C. Alegsao",
  username: "Cedrick",
  email: "cedrickalegsao@gmail.com",
  phoneLocal: "923 572 1763",
  avatarSrc: null,
};

const ALL_MOCK_SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "01",
    serviceName: "Flat Tire",
    description: "Tire replacement or repair",
    status: "Active",
  },
  {
    id: "02",
    serviceName: "Battery Jumpstart",
    description: "Battery Assistance",
    status: "Active",
  },
  {
    id: "03",
    serviceName: "Towing Service",
    description: "Vehicle towing to nearest shop",
    status: "Active",
  },
  {
    id: "04",
    serviceName: "Engine Trouble",
    description: "On-site diagnostics and minor fixes",
    status: "Inactive",
  },
  {
    id: "05",
    serviceName: "Fuel Delivery",
    description: "Emergency fuel delivery",
    status: "Active",
  },
  {
    id: "06",
    serviceName: "Lockout Assistance",
    description: "Help when keys are locked in",
    status: "Active",
  },
  {
    id: "07",
    serviceName: "Chain / Belt Issue",
    description: "Chain adjustment or belt inspection",
    status: "Active",
  },
  {
    id: "08",
    serviceName: "Electrical",
    description: "Lights, starter, charging issues",
    status: "Inactive",
  },
  {
    id: "09",
    serviceName: "Accident Scene",
    description: "Coordination and safe recovery",
    status: "Active",
  },
];

export const MOCK_SERVICE_CATEGORIES: ServiceCategory[] =
  SHOW_EMPTY_SERVICE_CATEGORIES ? [] : ALL_MOCK_SERVICE_CATEGORIES;
