import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  profileForm: FormGroup;
  loading = false;
  saving = false;
  error = '';
  success = '';
  userName = '';
  isAdmin = false;
  mobileMenuOpen = false;

  departments = [
    'IT',
    'Human Resources',
    'Finance',
    'Operations',
    'Marketing',
    'Sales',
    'Administration'
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.email || '';
    this.isAdmin = this.authService.isAdmin();

    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      employee_id: [''],
      department: [''],
      position: [''],
      office: [''],
      contact_number: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  get firstName() { return this.profileForm.get('first_name'); }
  get lastName() { return this.profileForm.get('last_name'); }
  get contactNumber() { return this.profileForm.get('contact_number'); }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.profile;
        if (this.profile) {
          this.profileForm.patchValue({
            first_name: this.profile.first_name,
            last_name: this.profile.last_name,
            employee_id: this.profile.employee_id || '',
            department: this.profile.department || '',
            position: this.profile.position || '',
            office: this.profile.office || '',
            contact_number: this.profile.contact_number || ''
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';

    this.profileService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.success = 'Profile updated successfully!';
        this.profile = response.profile;
        this.saving = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to update profile';
        this.saving = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
