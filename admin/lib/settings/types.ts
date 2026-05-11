export type ServiceCategoryStatus = "Active" | "Inactive";

export interface ServiceCategory {
  id: string;
  serviceName: string;
  description: string;
  status: ServiceCategoryStatus;
}

export interface SettingsProfile {
  fullName: string;
  username: string;
  email: string;
  phoneLocal: string;
  avatarSrc: string | null;
}
