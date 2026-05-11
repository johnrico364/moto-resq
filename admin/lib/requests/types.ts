export interface RequestRow {
  id: string;
  userName: string;
  avatar: string;
  requestId: string;
  technicianId: string;
  price: number | null;
  issueType: string;
  status: string;
}

export interface RequestStatItem {
  label: string;
  value: number;
}
