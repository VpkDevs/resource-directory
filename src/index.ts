/**
 * AI Resource Directory (index.ts)
 * 
 * This file serves as the main entry point for the AI Resource Directory
 * Chrome extension, bringing together all the various TypeScript modules.
 */

// Core types
export * from './types';

// Configuration
export { CONFIG, DEFAULT_USER_PREFERENCES, CACHE_KEYS } from './config';

// Services
export { resourceService } from './services/resourceService';
export { stateManager } from './services/stateManager';

// Utilities
export {
  dateUtils,
  domUtils,
  stringUtils,
  dataUtils,
  storageUtils,
  performanceUtils,
  networkUtils,
  validationUtils,
  EventBus,
  eventBus
} from './utils';

// UI Components
export { toastManager } from './toast';

/**
 * Initialize the application
 * This function can be called to bootstrap the entire extension
 */
export async function initializeApp(): Promise<boolean> {
  try {
    // Import stateManager locally to avoid re-export issues
    const { stateManager } = await import('./services/stateManager');
    
    // First initialize state manager
    const stateInitialized = await stateManager.initialize();
    
    if (!stateInitialized) {
      console.error('Failed to initialize state manager');
      return false;
    }
    
    // Setup error boundary
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
      });

      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    return false;
  }
}
