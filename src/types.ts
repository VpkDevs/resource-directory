/**
 * Core Type Definitions (types.ts)
 * 
 * This file defines the main TypeScript interfaces and types used throughout
 * the AI Resource Directory Chrome extension. These types provide strong typing
 * and better code organization for the application.
 */

// Error handling
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
    // Maintains proper stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Error message structure for configuration
export interface ErrorMessages {
  STORAGE: {
    LOAD_FAILED: string;
    SAVE_FAILED: string;
    QUOTA_EXCEEDED: string;
  };
  NETWORK: {
    REQUEST_FAILED: string;
  };
}

// Category definition
export type Category = 
  | 'Text Generation'
  | 'Image Generation'
  | 'Code Assistant'
  | 'Audio Generation'
  | 'Video Generation'
  | 'Data Analysis'
  | 'Research'
  | 'Productivity'
  | 'Education'
  | 'Business'
  | 'Development'
  | 'Design'
  | 'Marketing'
  | 'Writing'
  | 'Customer Service';

// Pricing structure
export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Enterprise';

export interface PricingInfo {
  type: PricingType;
  startingPrice?: string;
  hasTrial?: boolean;
  trialDuration?: string;
  hasFreeTier?: boolean;
  pricingUrl?: string;
  pricingModel?: 'subscription' | 'one-time' | 'usage-based' | 'tiered';
  currency?: string;
}

// Rating and stats structure
export interface RatingInfo {
  score: number;
  count: number;
  breakdown?: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  lastUpdated?: Date;
}

export interface StatisticsInfo {
  views: number;
  saves: number;
  shares?: number;
  clicks?: number;
  installCount?: number;
  averageUsageTime?: number;
}

// Integration and platform support
export interface IntegrationInfo {
  platforms: string[];
  apis: string[];
  plugins: string[];
  importExport: string[];
}

// Company/provider information
export interface ProviderInfo {
  name: string;
  url: string;
  foundedYear?: number;
  headquarters?: string;
  employees?: string;
  fundingStage?: string;
}

// Updated AI Resource model
export interface AIResource {
  // Core fields
  id: string;
  name: string;
  url: string;
  description: string;
  longDescription?: string;
  logoUrl?: string;
  screenshotUrls?: string[];
  
  // Categorization
  category: Category[];
  tags: string[];
  
  // Business model
  pricing: PricingInfo;
  
  // User feedback
  rating?: RatingInfo;
  stats?: StatisticsInfo;
  
  // Technical details
  features: string[];
  integrations?: IntegrationInfo;
  apiDocumentation?: string;
  
  // Metadata
  lastUpdated: Date;
  dateAdded: Date;
  verified: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  
  // Provider information
  provider?: ProviderInfo;
  
  // Related resources
  alternatives?: string[]; // IDs of alternative resources
  
  // Status info
  status?: 'active' | 'deprecated' | 'beta';
  
  // Terms and privacy
  termsUrl?: string;
  privacyUrl?: string;
  
  // Resource usage metrics
  usageMetrics?: {
    averageResponseTime?: number;
    uptime?: number;
    userSatisfaction?: number;
  };
}

// Resource Collection for better type safety
export interface ResourceCollection {
  byId: Record<string, AIResource>;
  allIds: string[];
  byCategory: Record<Category, string[]>;
  byTag: Record<string, string[]>;
  featured: string[];
  trending: string[];
  newest: string[];
}

// Search and filter system
export interface SearchQuery {
  text: string;
  categories?: Category[];
  tags?: string[];
  pricing?: PricingType[];
  verifiedOnly?: boolean;
  minRating?: number;
  features?: string[];
}

export interface FilterOptions {
  categories: Category[];
  tags: string[];
  pricing: PricingType[];
  features: string[];
  verification: boolean;
}

export interface SortOptions {
  field: 'name' | 'rating' | 'dateAdded' | 'lastUpdated' | 'popularity';
  direction: 'asc' | 'desc';
}

// User preferences and settings
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  defaultSort: 'rating' | 'newest' | 'popular';
  favoriteCategories: Category[];
  hiddenResources: string[];
  showFeaturedSection: boolean;
  showTrendingSection: boolean;
  enableAnimations: boolean;
  enableNotifications: boolean;
  maxLastVisited: number;
  compactView: boolean;
  developerMode: boolean;
}

// User interaction tracking
export interface UserInteraction {
  resourceId: string;
  action: 'view' | 'save' | 'rate' | 'share';
  timestamp: Date;
  rating?: number;
  timeSpent?: number;
  searchQuery?: string;
  referrer?: string;
}

// Application statistics
export interface ResourceStats {
  totalResources: number;
  totalCategories: number;
  dailyActive: number;
  mostPopularCategories: {
    category: Category;
    count: number;
  }[];
  mostViewedResources: {
    id: string;
    name: string;
    views: number;
  }[];
  mostSavedResources: {
    id: string;
    name: string;
    saves: number;
  }[];
}

// Application state
export interface AppState {
  resources: ResourceCollection;
  favorites: Set<string>;
  darkMode: boolean;
  lastVisitedItems: LastVisitedItem[];
  isLoading: boolean;
  settings: UserPreferences | null;
  searchQuery: string;
  activeFilter: FilterOptions;
  activeSort: SortOptions;
  isOffline: boolean;
  notifications: Notification[];
}

// Last visited item
export interface LastVisitedItem {
  id: string;
  title: string;
  url: string;
  description: string;
  timestamp: number;
  category?: Category;
}

// Notification structure
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    text: string;
    url: string;
  };
}

// API Response structures
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ResourcesResponse {
  resources: AIResource[];
  categories: Category[];
  tags: string[];
  features: string[];
}

// Observer pattern interfaces
export interface Observer {
  onStateChange(event: string, data: any): void;
}

export interface Observable {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(event: string, data: any): void;
}

// Toast system interfaces
export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    text: string;
    handler: () => void;
  };
  onClose?: () => void;
}
