export interface Template {
  id: number;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  created_at: Date;
}

export interface TemplateCreateRequest {
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
}
