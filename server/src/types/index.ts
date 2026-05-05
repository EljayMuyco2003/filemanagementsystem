// User types
export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  role: string;
  created_at: Date;
}

// Profile types
export interface Profile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  employee_id?: string;
  department?: string;
  position?: string;
  office?: string;
  contact_number?: string;
  updated_at: Date;
}

// File types
export interface UploadedFile {
  id: number;
  user_id: number;
  file_name: string;
  file_url: string;
  file_key: string;
  file_size: number;
  uploaded_at: Date;
}

// Template types
export interface Template {
  id: number;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  created_at: Date;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

// JWT Payload
export interface JWTPayload {
  id: number;
  email: string;
  role: string;
}

// Request with user
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

// Dashboard stats
export interface DashboardStats {
  userUploads: number;
  totalTemplates: number;
  totalUsers?: number;
  recentFiles: Array<{
    id: number;
    fileName: string;
    uploadedAt: Date;
    uploaderName: string;
  }>;
}
