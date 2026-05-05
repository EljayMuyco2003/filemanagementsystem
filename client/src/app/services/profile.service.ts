import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile, ProfileUpdateRequest } from '../models/profile.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<{ profile: Profile }> {
    return this.http.get<{ profile: Profile }>(this.apiUrl);
  }

  updateProfile(data: ProfileUpdateRequest): Observable<{ message: string; profile: Profile }> {
    return this.http.patch<{ message: string; profile: Profile }>(this.apiUrl, data);
  }
}
