export type ServiceCategoryStatus = "Active" | "Inactive";

export interface ServiceCategory {
  id: string;
  serviceName: string;
  description: string;
  status: ServiceCategoryStatus;
  /** MongoDB id from API; required for PATCH/DELETE. */
  mongoId?: string;
}

export interface SettingsProfile {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  phoneLocal: string;
  /** Stored filename from API, or null (use profileImageToUrl for display). */
  avatarSrc: string | null;
}
