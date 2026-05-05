import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadedFile, FileWithUser } from '../models/file.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {}

  getFiles(): Observable<FileWithUser[]> {
    return this.http.get<FileWithUser[]>(this.apiUrl);
  }

  getFileById(id: number): Observable<UploadedFile> {
    return this.http.get<UploadedFile>(`${this.apiUrl}/${id}`);
  }

  uploadFile(file: File): Observable<{ message: string; file: UploadedFile }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string; file: UploadedFile }>(this.apiUrl, formData);
  }

  deleteFile(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
