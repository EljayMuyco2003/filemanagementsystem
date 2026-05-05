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

export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  employee_id?: string;
  department?: string;
  position?: string;
  office?: string;
  contact_number?: string;
}
