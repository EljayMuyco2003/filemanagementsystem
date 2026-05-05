import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ConfirmationConfig, LoadingConfig } from '../../../services/modal.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { LoadingModalComponent } from '../loading-modal/loading-modal.component';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent, LoadingModalComponent],
  template: `
    <app-confirmation-modal
      [isOpen]="!!confirmationConfig"
      [title]="confirmationConfig?.title || ''"
      [message]="confirmationConfig?.message || ''"
      [confirmText]="confirmationConfig?.confirmText || 'Confirm'"
      [cancelText]="confirmationConfig?.cancelText || 'Cancel'"
      [type]="confirmationConfig?.type || 'warning'"
      (confirm)="onConfirm()"
      (cancel)="onCancel()">
    </app-confirmation-modal>

    <app-loading-modal
      [isOpen]="!!loadingConfig"
      [message]="loadingConfig?.message || 'Loading...'">
    </app-loading-modal>
  `
})
export class ModalContainerComponent {
  confirmationConfig: ConfirmationConfig | null = null;
  loadingConfig: LoadingConfig | null = null;

  constructor(private modalService: ModalService) {
    this.modalService.confirmation$.subscribe(config => {
      this.confirmationConfig = config;
    });

    this.modalService.loading$.subscribe(config => {
      this.loadingConfig = config;
    });
  }

  onConfirm() {
    this.modalService.closeConfirmation(true);
  }

  onCancel() {
    this.modalService.closeConfirmation(false);
  }
}
