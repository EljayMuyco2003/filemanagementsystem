export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  created_at: Date;
}

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
  user: User;
}
