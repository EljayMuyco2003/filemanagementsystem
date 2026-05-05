export interface DashboardStats {
  userUploads: number;
  totalTemplates: number;
  totalUsers?: number;
  recentFiles: RecentFile[];
}

export interface RecentFile {
  id: number;
  fileName: string;
  uploadedAt: Date;
  uploaderName: string;
}
