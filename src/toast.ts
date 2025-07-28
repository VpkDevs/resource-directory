/**
 * Toast Notification System (toast.ts)
 * 
 * This file implements a toast notification system for the AI Resource Directory
 * Chrome extension. It provides a non-intrusive way to display temporary messages,
 * alerts, and feedback to users.
 */

import { ToastOptions } from './types';

// Toast Notification System
class ToastManager {
  private container: HTMLDivElement | null;

  constructor() {
    this.container = null;
    // We need to check if we're in a browser environment before initializing
    if (typeof document !== 'undefined') {
      this.initializeContainer();
    }
  }

  private initializeContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.setAttribute('role', 'alert');
    this.container.setAttribute('aria-live', 'polite');
    
    // Ensure the document.body exists before appending
    if (document.body) {
      document.body.appendChild(this.container);
    } else {
      // If document.body doesn't exist yet, wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(this.container!);
      });
    }
  }

  /**
   * Shows a toast notification with the specified message, type, and duration
   * @param message The message to display
   * @param options Additional options for the toast
   */
  show(message: string, options: ToastOptions = {}): HTMLDivElement {
    if (!this.container) {
      this.initializeContainer();
    }

    const { 
      type = 'info', 
      duration = 3000, 
      action, 
      onClose 
    } = options;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    
    const icon = this.getIconForType(type);
    
    let content = `
      <div class="toast-content">
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
      </div>
    `;

    // Add action button if provided
    if (action) {
      content += `
        <button class="toast-action" aria-label="${action.text}">${action.text}</button>
      `;
    }

    content += `<button class="toast-close" aria-label="Close notification">×</button>`;
    
    toast.innerHTML = content;
    this.container!.appendChild(toast);

    // Add action button functionality
    if (action) {
      const actionBtn = toast.querySelector('.toast-action');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          action.handler();
          this.dismiss(toast);
        });
      }
    }

    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dismiss(toast);
        if (onClose) onClose();
      });
    }

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
        if (onClose) onClose();
      }, duration);
    }

    // Accessibility: Remove after animation
    toast.addEventListener('animationend', (e) => {
      if ((e as AnimationEvent).animationName === 'toast-fade-out') {
        toast.remove();
      }
    });

    return toast;
  }

  /**
   * Dismisses a toast notification
   * @param toast The toast element to dismiss
   */
  dismiss(toast: HTMLDivElement): void {
    toast.classList.remove('show');
    toast.classList.add('hiding');
  }

  /**
   * Gets the appropriate icon for the toast type
   * @param type The type of toast
   * @returns The icon string
   */
  private getIconForType(type: ToastOptions['type'] = 'info'): string {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  /**
   * Displays a success toast
   * @param message The message to display
   * @param duration The duration to show the toast
   * @returns The toast element
   */
  success(message: string, options?: Omit<ToastOptions, 'type'>): HTMLDivElement {
    return this.show(message, { ...options, type: 'success' });
  }

  /**
   * Displays an error toast
   * @param message The message to display
   * @param duration The duration to show the toast
   * @returns The toast element
   */
  error(message: string, options?: Omit<ToastOptions, 'type'>): HTMLDivElement {
    return this.show(message, { ...options, type: 'error' });
  }

  /**
   * Displays a warning toast
   * @param message The message to display
   * @param duration The duration to show the toast
   * @returns The toast element
   */
  warning(message: string, options?: Omit<ToastOptions, 'type'>): HTMLDivElement {
    return this.show(message, { ...options, type: 'warning' });
  }

  /**
   * Displays an info toast
   * @param message The message to display
   * @param duration The duration to show the toast
   * @returns The toast element
   */
  info(message: string, options?: Omit<ToastOptions, 'type'>): HTMLDivElement {
    return this.show(message, { ...options, type: 'info' });
  }

  /**
   * Clears all active toast notifications
   */
  clearAll(): void {
    if (this.container) {
      const toasts = this.container.querySelectorAll('.toast');
      toasts.forEach(toast => {
        this.dismiss(toast as HTMLDivElement);
      });
    }
  }
}

// Export a singleton instance of ToastManager
export const toastManager = new ToastManager();
