# Modal System Usage Guide

## Setup

### 1. Add Modal Container to App Component

Update `client/src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalContainerComponent } from './components/shared/modal-container/modal-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-modal-container></app-modal-container>
  `
})
export class AppComponent {
  title = 'file-management-portal-client';
}
```

## Usage Examples

### 1. Confirmation Modal (Delete, Logout, etc.)

```typescript
import { ModalService } from '../../services/modal.service';

constructor(private modalService: ModalService) {}

async deleteFile(id: number): Promise<void> {
  // Show confirmation modal
  const confirmed = await this.modalService.confirm({
    title: 'Delete File',
    message: 'Are you sure you want to delete this file? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger' // 'danger' | 'warning' | 'info'
  });

  if (!confirmed) return;

  // Show loading and execute delete
  await this.modalService.withLoading(
    () => this.fileService.deleteFile(id).toPromise(),
    'Deleting file...'
  );

  this.success = 'File deleted successfully!';
  this.loadFiles();
}
```

### 2. Logout with Confirmation

```typescript
async logout(): Promise<void> {
  const confirmed = await this.modalService.confirm({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmText: 'Logout',
    type: 'warning'
  });

  if (confirmed) {
    this.authService.logout();
  }
}
```

### 3. Upload with Loading

```typescript
async uploadFile(): Promise<void> {
  if (!this.selectedFile) {
    this.error = 'Please select a file';
    return;
  }

  try {
    await this.modalService.withLoading(
      () => this.fileService.uploadFile(this.selectedFile!).toPromise(),
      'Uploading file...'
    );

    this.success = 'File uploaded successfully!';
    this.selectedFile = null;
    this.loadFiles();
  } catch (err: any) {
    this.error = err.error?.error || 'Failed to upload file';
  }
}
```

### 4. Manual Loading Control

```typescript
async processData(): Promise<void> {
  this.modalService.showLoading('Processing data...');
  
  try {
    await this.someService.process();
    // Keep loading for at least 500ms for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
  } finally {
    this.modalService.hideLoading();
  }
}
```

## Modal Types

### Confirmation Modal
- **danger**: Red button (for delete, remove actions)
- **warning**: Yellow button (for logout, cancel actions)
- **info**: Green button (for general confirmations)

### Loading Modal
- Automatically shows spinner
- Minimum display time of 500ms for better UX
- Blocks user interaction during operation

## Styling

Modals use Tailwind CSS with Spotify theme colors:
- `spotify-darker` - Modal background
- `spotify-border` - Borders
- `spotify-green` - Primary actions
- Smooth animations (fadeIn, slideUp)

## Best Practices

1. **Always use confirmation for destructive actions** (delete, remove, etc.)
2. **Show loading for operations > 300ms**
3. **Use appropriate modal types** (danger for delete, warning for logout)
4. **Keep messages clear and concise**
5. **Use async/await** for cleaner code with modals
