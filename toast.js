/**
 * Toast Notification System (toast.js)
 *
 * This file implements a toast notification system for the AI Resource Directory
 * Chrome extension. It provides a non-intrusive way to display temporary messages,
 * alerts, and feedback to users.
 *
 * Features:
 * - Four notification types: success, error, warning, info
 * - Automatic dismissal with configurable duration
 * - Manual dismissal via close button
 * - Accessibility support with ARIA attributes
 * - Smooth animations for show/hide
 * - Icon support for different message types
 * - Stacking support for multiple notifications
 *
 * Implementation Details:
 * - Uses a singleton pattern for global access
 * - Implements requestAnimationFrame for smooth animations
 * - Handles cleanup through animation events
 * - Provides type-specific helper methods
 *
 * Used By:
 * - script.js: For user feedback on actions
 * - options.js: For settings feedback
 * - serviceWorker.js: For offline notifications
 * - utils.js: For error notifications
 *
 * CSS Dependencies:
 * - Requires corresponding toast styles in styles.css
 * - Uses CSS animations for transitions
 *
 * Accessibility:
 * - Uses appropriate ARIA roles and attributes
 * - Supports screen readers through live regions
 * - Keyboard accessible close button
 */

// Toast Notification System
class ToastManager {
  constructor() {
    this.container = null
    this.initializeContainer()
  }

  initializeContainer() {
    this.container = document.createElement('div')
    this.container.id = 'toast-container'
    this.container.setAttribute('role', 'alert')
    this.container.setAttribute('aria-live', 'polite')
    document.body.appendChild(this.container)
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`
    toast.setAttribute('role', 'status')

    const icon = this.getIconForType(type)
    const content = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="Close notification">×</button>
        `

    toast.innerHTML = content
    this.container.appendChild(toast)

    // Add close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.dismiss(toast)
    })

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show')
    })

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast)
      }, duration)
    }

    // Accessibility: Remove after animation
    toast.addEventListener('animationend', e => {
      if (e.animationName === 'toast-fade-out') {
        toast.remove()
      }
    })
  }

  dismiss(toast) {
    toast.classList.remove('show')
    toast.classList.add('hiding')
  }

  getIconForType(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    }
    return icons[type] || icons.info
  }

  // Helper methods for common toast types
  success(message, duration) {
    this.show(message, 'success', duration)
  }

  error(message, duration) {
    this.show(message, 'error', duration)
  }

  warning(message, duration) {
    this.show(message, 'warning', duration)
  }

  info(message, duration) {
    this.show(message, 'info', duration)
  }
}

// Export for use in other files
export const toastManager = new ToastManager()
