import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { Template } from '../../models/template.model';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  templateForm: FormGroup;
  loading = false;
  creating = false;
  error = '';
  success = '';
  userName = '';
  isAdmin = false;
  showCreateForm = false;
  selectedFile: File | null = null;
  mobileMenuOpen = false;

  categories = [
    'Document',
    'Spreadsheet',
    'Presentation',
    'Form',
    'Report',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private templateService: TemplateService,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.email || '';
    this.isAdmin = this.authService.isAdmin();

    this.templateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      file_type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
  }

  get templateName() { return this.templateForm.get('name'); }
  get description() { return this.templateForm.get('description'); }
  get fileType() { return this.templateForm.get('file_type'); }

  getFieldError(fieldName: string): string {
    const field = this.templateForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Auto-detect file type from extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      this.templateForm.patchValue({ file_type: ext });
    }
  }

  loadTemplates(): void {
    this.loading = true;
    this.templateService.getAllTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load templates';
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
    this.templateForm.reset();
    this.selectedFile = null;
    this.error = '';
  }

  async onSubmit(): Promise<void> {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.error = 'Please select a file to upload';
      return;
    }

    this.error = '';
    this.success = '';

    const formData = {
      ...this.templateForm.value,
      file: this.selectedFile
    };

    try {
      await this.modalService.withLoading(
        () => this.templateService.createTemplate(formData).toPromise(),
        'Creating template...'
      );

      this.success = 'Template created successfully!';
      this.showCreateForm = false;
      this.resetForm();
      this.loadTemplates();
      setTimeout(() => this.success = '', 3000);
    } catch (err: any) {
      this.error = err.error?.error || 'Failed to create template';
    }
  }

  async deleteTemplate(id: number): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: 'Delete Template',
      message: 'Are you sure you want to delete this template? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await this.modalService.withLoading(
        () => this.templateService.deleteTemplate(id).toPromise(),
        'Deleting template...'
      );

      this.success = 'Template deleted successfully!';
      this.loadTemplates();
      setTimeout(() => this.success = '', 3000);
    } catch (err) {
      this.error = 'Failed to delete template';
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
