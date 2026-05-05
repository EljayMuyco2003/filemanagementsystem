import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template, TemplateCreateRequest } from '../models/template.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = `${environment.apiUrl}/templates`;

  constructor(private http: HttpClient) {}

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  getTemplateById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  createTemplate(data: any): Observable<{ message: string; template: Template }> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('file_type', data.file_type);
    if (data.file) {
      formData.append('file', data.file);
    }
    return this.http.post<{ message: string; template: Template }>(this.apiUrl, formData);
  }

  deleteTemplate(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
