export interface UploadedFile {
  id: number;
  user_id: number;
  file_name: string;
  file_url: string;
  file_key: string;
  file_size: number;
  uploaded_at: Date;
}

export interface FileWithUser extends UploadedFile {
  email?: string;
  first_name?: string;
  last_name?: string;
}
