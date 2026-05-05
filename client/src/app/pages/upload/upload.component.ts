import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FileService } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
import { UploadedFile, FileWithUser } from '../../models/file.model';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  files: FileWithUser[] = [];
  loading = false;
  uploading = false;
  error = '';
  success = '';
  userName = '';
  isAdmin = false;
  selectedFile: File | null = null;
  dragOver = false;
  mobileMenuOpen = false;

  constructor(
    private fileService: FileService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.email || '';
    this.isAdmin = this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.loading = true;
    this.fileService.getFiles().subscribe({
      next: (files) => {
        this.files = files;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load files';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    this.uploading = true;
    this.error = '';
    this.success = '';

    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.success = 'File uploaded successfully!';
        this.selectedFile = null;
        this.uploading = false;
        this.loadFiles();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to upload file';
        this.uploading = false;
      }
    });
  }

  deleteFile(id: number): void {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        this.success = 'File deleted successfully!';
        this.loadFiles();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = 'Failed to delete file';
      }
    });
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  getUploaderName(file: any): string {
    if (file.first_name && file.last_name) {
      return `${file.first_name} ${file.last_name}`;
    }
    return file.email || 'Unknown';
  }

  getUploaderInitial(file: any): string {
    if (file.first_name) {
      return file.first_name.charAt(0).toUpperCase();
    }
    if (file.email) {
      return file.email.charAt(0).toUpperCase();
    }
    return 'U';
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
