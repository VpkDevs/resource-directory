export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private maxRetries = 3;
  private retryDelay = 1000;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  async handleError(error: AppError, context?: string): Promise<void> {
    // Log error with context
    logger.error(`Error in ${context}:`, {
      message: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Add to error queue for retry logic
    this.errorQueue.push(error);

    // Show user-friendly notification
    await this.showUserNotification(error);

    // Report to analytics if enabled
    if (CONFIG.ANALYTICS_ENABLED) {
      await this.reportError(error, context);
    }
  }

  private async showUserNotification(error: AppError): Promise<void> {
    const userMessage = this.getUserFriendlyMessage(error);
    toastManager.error(userMessage);
  }

  private getUserFriendlyMessage(error: AppError): string {
    const errorMessages = {
      'NETWORK_ERROR': 'Connection issue. Please check your internet.',
      'STORAGE_QUOTA_EXCEEDED': 'Storage full. Please clear some data.',
      'PERMISSION_DENIED': 'Permission required. Please check settings.',
      'RESOURCE_NOT_FOUND': 'Resource not available.',
      'VALIDATION_ERROR': 'Invalid input. Please check your data.'
    };
    return errorMessages[error.code] || 'An unexpected error occurred.';
  }
}