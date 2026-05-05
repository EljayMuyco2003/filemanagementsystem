import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface LoadingConfig {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private confirmationSubject = new BehaviorSubject<ConfirmationConfig | null>(null);
  private loadingSubject = new BehaviorSubject<LoadingConfig | null>(null);

  confirmation$ = this.confirmationSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  /**
   * Show confirmation modal and return a promise that resolves when user confirms or rejects
   */
  confirm(config: ConfirmationConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const fullConfig = {
        ...config,
        confirmText: config.confirmText || 'Confirm',
        cancelText: config.cancelText || 'Cancel',
        type: config.type || 'warning'
      };
      
      this.confirmationSubject.next(fullConfig);
      
      // Store resolve function to be called by component
      (window as any).__modalResolve = resolve;
    });
  }

  /**
   * Close confirmation modal
   */
  closeConfirmation(result: boolean) {
    this.confirmationSubject.next(null);
    if ((window as any).__modalResolve) {
      (window as any).__modalResolve(result);
      delete (window as any).__modalResolve;
    }
  }

  /**
   * Show loading modal
   */
  showLoading(message: string = 'Loading...') {
    this.loadingSubject.next({ message });
  }

  /**
   * Hide loading modal
   */
  hideLoading() {
    this.loadingSubject.next(null);
  }

  /**
   * Execute an async operation with loading modal
   */
  async withLoading<T>(
    operation: () => Promise<T>,
    message: string = 'Processing...'
  ): Promise<T> {
    this.showLoading(message);
    try {
      const result = await operation();
      // Keep loading visible for at least 500ms for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      return result;
    } finally {
      this.hideLoading();
    }
  }
}
