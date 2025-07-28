/**
 * State Manager (stateManager.ts)
 * 
 * This service manages the application state including favorites,
 * dark mode, last visited items, and user settings.
 */

import { CONFIG } from '../config';
import { 
  AppState, 
  LastVisitedItem, 
  Observer, 
  Observable, 
  UserPreferences 
} from '../types';
import { storageUtils } from '../utils';
import { toastManager } from '../toast';
import { resourceService } from './resourceService';

/**
 * StateManager class manages the application state, following the Observable pattern
 */
export class StateManager implements Observable {
  // Core state properties
  private _favorites: Set<string>;
  private _darkMode: boolean;
  private _lastVisitedItems: LastVisitedItem[];
  private _isLoading: boolean;
  private _settings: UserPreferences | null;
  private _isOffline: boolean;
  private _searchQuery: string;
  
  // Observer pattern implementation
  private _observers: Set<Observer>;
  
  constructor() {
    // Initialize state
    this._favorites = new Set();
    this._darkMode = false;
    this._lastVisitedItems = [];
    this._isLoading = true;
    this._settings = null;
    this._isOffline = !navigator.onLine;
    this._searchQuery = '';
    this._observers = new Set();
    
    // Setup offline detection
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnlineStatus);
      window.addEventListener('offline', this.handleOnlineStatus);
    }
  }
  
  /**
   * Handles online/offline status changes
   */
  private handleOnlineStatus = (): void => {
    const wasOffline = this._isOffline;
    this._isOffline = !navigator.onLine;
    
    if (wasOffline && !this._isOffline) {
      // Went from offline to online
      toastManager.success('You are back online');
      this.notifyObservers('onlineStatusChanged', this._isOffline);
    } else if (!wasOffline && this._isOffline) {
      // Went from online to offline
      toastManager.warning('You are offline. Some features may be limited.');
      this.notifyObservers('onlineStatusChanged', this._isOffline);
    }
  };
  
  /**
   * Initializes the state manager by loading settings and data
   */
  async initialize(): Promise<boolean> {
    try {
      this._isLoading = true;
      this.notifyObservers('loadingChanged', this._isLoading);
      
      // Load settings first as they affect other initializations
      this._settings = await storageUtils.get<UserPreferences>(CONFIG.STORAGE_KEYS.USER_PREFS) || 
        CONFIG.DEFAULTS;
      
      // Load other data in parallel
      const [favorites, darkMode, lastVisited] = await Promise.all([
        storageUtils.get<string[]>(CONFIG.STORAGE_KEYS.FAVORITES),
        storageUtils.get<boolean>(CONFIG.STORAGE_KEYS.DARK_MODE),
        storageUtils.get<LastVisitedItem[]>(CONFIG.STORAGE_KEYS.LAST_VISITED)
      ]);
      
      this._favorites = new Set(favorites || []);
      this._darkMode = darkMode ?? (this._settings.theme === 'dark' || 
        (this._settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
      this._lastVisitedItems = lastVisited || [];
      
      // Initialize resource service
      await resourceService.initialize();
      
      this._isLoading = false;
      
      this.notifyObservers('initialized', { 
        favorites: this._favorites,
        darkMode: this._darkMode,
        lastVisited: this._lastVisitedItems,
        settings: this._settings
      });
      
      this.notifyObservers('loadingChanged', this._isLoading);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize state:', error);
      toastManager.error('Failed to load settings');
      
      this._isLoading = false;
      this.notifyObservers('loadingChanged', this._isLoading);
      
      return false;
    }
  }
  
  /**
   * Adds an observer to the state manager
   */
  addObserver(observer: Observer): void {
    this._observers.add(observer);
  }
  
  /**
   * Removes an observer from the state manager
   */
  removeObserver(observer: Observer): void {
    this._observers.delete(observer);
  }
  
  /**
   * Notifies all observers of a state change
   */
  notifyObservers(event: string, data: any): void {
    this._observers.forEach(observer => {
      if (observer.onStateChange) {
        observer.onStateChange(event, data);
      }
    });
  }
  
  /**
   * Toggles a favorite resource
   */
  async toggleFavorite(resourceId: string): Promise<boolean> {
    try {
      const isFavorite = this._favorites.has(resourceId);
      
      if (isFavorite) {
        this._favorites.delete(resourceId);
      } else {
        this._favorites.add(resourceId);
      }
      
      this.notifyObservers('favoritesChanged', {
        resourceId,
        isFavorite: !isFavorite
      });
      
      await this.saveFavorites();
      return true;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toastManager.error('Failed to update favorites');
      return false;
    }
  }
  
  /**
   * Saves the current favorites to storage
   */
  async saveFavorites(): Promise<void> {
    try {
      const favoritesArray = Array.from(this._favorites);
      await storageUtils.set(CONFIG.STORAGE_KEYS.FAVORITES, favoritesArray);
      this.notifyObservers('favoritesUpdated', favoritesArray);
    } catch (error) {
      console.error('Failed to save favorites:', error);
      toastManager.error('Failed to update favorites');
      throw error;
    }
  }
  
  /**
   * Toggles the theme between dark and light mode
   */
  async toggleTheme(): Promise<void> {
    try {
      this._darkMode = !this._darkMode;
      this.notifyObservers('themeChanged', this._darkMode);
      await this.saveTheme();
    } catch (error) {
      console.error('Failed to toggle theme:', error);
      toastManager.error('Failed to update theme');
      throw error;
    }
  }
  
  /**
   * Saves the current theme preference to storage
   */
  async saveTheme(): Promise<void> {
    try {
      await storageUtils.set(CONFIG.STORAGE_KEYS.DARK_MODE, this._darkMode);
      this.notifyObservers('themeUpdated', this._darkMode);
    } catch (error) {
      console.error('Failed to save theme:', error);
      toastManager.error('Failed to save theme preference');
      throw error;
    }
  }
  
  /**
   * Adds a resource to the last visited items
   */
  async addLastVisited(item: LastVisitedItem): Promise<void> {
    try {
      // Remove existing entry if present
      this._lastVisitedItems = this._lastVisitedItems.filter(
        existing => existing.id !== item.id
      );
      
      // Add to beginning of array
      this._lastVisitedItems.unshift(item);
      
      // Limit to maximum number of items
      const maxItems = this._settings?.maxLastVisited || CONFIG.UI.MAX_LAST_VISITED;
      if (this._lastVisitedItems.length > maxItems) {
        this._lastVisitedItems = this._lastVisitedItems.slice(0, maxItems);
      }
      
      this.notifyObservers('lastVisitedChanged', this._lastVisitedItems);
      await this.saveLastVisited();
    } catch (error) {
      console.error('Failed to add last visited item:', error);
      // Non-critical error, don't show toast
    }
  }
  
  /**
   * Clears the last visited items
   */
  async clearLastVisited(): Promise<void> {
    try {
      this._lastVisitedItems = [];
      this.notifyObservers('lastVisitedChanged', this._lastVisitedItems);
      await this.saveLastVisited();
      toastManager.success('Cleared recently visited');
    } catch (error) {
      console.error('Failed to clear last visited:', error);
      toastManager.error('Failed to clear recently visited');
      throw error;
    }
  }
  
  /**
   * Saves the last visited items to storage
   */
  async saveLastVisited(): Promise<void> {
    try {
      await storageUtils.set(CONFIG.STORAGE_KEYS.LAST_VISITED, this._lastVisitedItems);
      this.notifyObservers('lastVisitedUpdated', this._lastVisitedItems);
    } catch (error) {
      console.error('Failed to save last visited:', error);
      // Non-critical error, don't show toast
      throw error;
    }
  }
  
  /**
   * Updates user settings
   */
  async updateSettings(settings: Partial<UserPreferences>): Promise<void> {
    try {
      // Update settings
      this._settings = {
        ...this._settings!,
        ...settings
      };
      
      // Save to storage
      await storageUtils.set(CONFIG.STORAGE_KEYS.USER_PREFS, this._settings);
      
      // Notify observers
      this.notifyObservers('settingsUpdated', this._settings);
      
      toastManager.success('Settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toastManager.error('Failed to update settings');
      throw error;
    }
  }
  
  /**
   * Updates search query
   */
  setSearchQuery(query: string): void {
    this._searchQuery = query;
    this.notifyObservers('searchQueryChanged', query);
  }
  
  /**
   * Gets the current state
   */
  getState(): AppState {
    return {
      resources: {
        byId: {},
        allIds: [],
        byCategory: {} as any,
        byTag: {},
        featured: [],
        trending: [],
        newest: []
      }, // This would be populated from ResourceService
      favorites: this._favorites,
      darkMode: this._darkMode,
      lastVisitedItems: this._lastVisitedItems,
      isLoading: this._isLoading,
      settings: this._settings,
      searchQuery: this._searchQuery,
      activeFilter: {
        categories: [],
        tags: [],
        pricing: [],
        features: [],
        verification: false
      },
      activeSort: {
        field: 'rating',
        direction: 'desc'
      },
      isOffline: this._isOffline,
      notifications: []
    };
  }
  
  /**
   * Gets favorites
   */
  get favorites(): Set<string> {
    return this._favorites;
  }
  
  /**
   * Gets dark mode
   */
  get darkMode(): boolean {
    return this._darkMode;
  }
  
  /**
   * Sets dark mode
   */
  set darkMode(value: boolean) {
    if (this._darkMode !== value) {
      this._darkMode = value;
      this.notifyObservers('themeChanged', value);
      this.saveTheme().catch(console.error);
    }
  }
  
  /**
   * Gets last visited items
   */
  get lastVisitedItems(): LastVisitedItem[] {
    return this._lastVisitedItems;
  }
  
  /**
   * Gets loading state
   */
  get isLoading(): boolean {
    return this._isLoading;
  }
  
  /**
   * Gets user settings
   */
  get settings(): UserPreferences | null {
    return this._settings;
  }
  
  /**
   * Gets offline state
   */
  get isOffline(): boolean {
    return this._isOffline;
  }
  
  /**
   * Gets search query
   */
  get searchQuery(): string {
    return this._searchQuery;
  }
  
  /**
   * Cleans up resources
   */
  cleanup(): void {
    this._observers.clear();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnlineStatus);
      window.removeEventListener('offline', this.handleOnlineStatus);
    }
  }
}

// Export a singleton instance of StateManager
export const stateManager = new StateManager();
