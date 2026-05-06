import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { gmailValidator } from '../../validators/email.validator';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  loading = false;
  creating = false;
  error = '';
  success = '';
  userName = '';
  isAdmin = false;
  showCreateForm = false;
  mobileMenuOpen = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.email || '';
    this.isAdmin = this.authService.isAdmin();

    this.userForm = this.fb.group({
      email: ['', [Validators.required, gmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get firstName() { return this.userForm.get('first_name'); }
  get lastName() { return this.userForm.get('last_name'); }
  get role() { return this.userForm.get('role'); }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['gmail']) return 'Invalid email';
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.userForm.reset({
      role: 'user'
    });
    this.error = '';
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.error = '';
    this.success = '';

    try {
      await this.modalService.withLoading(
        () => this.userService.createUser(this.userForm.value).toPromise(),
        'Creating user...'
      );

      this.success = 'User created successfully!';
      this.showCreateForm = false;
      this.resetForm();
      this.loadUsers();
      setTimeout(() => this.success = '', 3000);
    } catch (err: any) {
      this.error = err.error?.error || 'Failed to create user';
    }
  }

  async deleteUser(id: number): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await this.modalService.withLoading(
        () => this.userService.deleteUser(id).toPromise(),
        'Deleting user...'
      );

      this.success = 'User deleted successfully!';
      this.loadUsers();
      setTimeout(() => this.success = '', 3000);
    } catch (err) {
      this.error = 'Failed to delete user';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  async logout(): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (confirmed) {
      this.authService.logout();
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
