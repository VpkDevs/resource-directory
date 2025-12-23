/**
 * Configuration Settings (config.ts)
 *
 * This file defines the configuration settings and constants used throughout
 * the AI Resource Directory Chrome extension. It provides a centralized
 * location for all configurable parameters.
 */

import { Category, ErrorMessages, PricingType, UserPreferences } from './types'

/**
 * Configuration interface for the application
 */
interface Config {
  // API Configuration
  API_ENDPOINT: string
  API_VERSION: string
  CACHE_DURATION: number

  // Storage Keys
  STORAGE_KEYS: {
    FAVORITES: string
    DARK_MODE: string
    LAST_VISITED: string
    RESOURCES: string
    CATEGORIES: string
    USER_PREFS: string
    LAST_UPDATE: string
    USAGE_STATS: string
  }

  // Default Settings
  DEFAULTS: UserPreferences

  // Feature Flags
  FEATURES: {
    RATINGS: boolean
    USAGE_STATS: boolean
    PRICE_COMPARISON: boolean
    TRENDING_SECTION: boolean
    DAILY_UPDATES: boolean
    OFFLINE_ACCESS: boolean
    RESOURCE_VERIFICATION: boolean
    COMMUNITY_REVIEWS: boolean
    AI_POWERED_SEARCH: boolean
    PRICE_ALERTS: boolean
  }

  // Categories Configuration
  CATEGORY_CONFIG: {
    FEATURED_CATEGORIES: Category[]
    MAX_CATEGORIES_DISPLAY: number
    ENABLE_SUBCATEGORIES: boolean
  }

  // UI Configuration
  UI: {
    MAX_DESCRIPTION_LENGTH: number
    GRID_ITEMS_PER_ROW: {
      desktop: number
      tablet: number
      mobile: number
    }
    INFINITE_SCROLL_THRESHOLD: number
    ANIMATION_DURATION: number
    MAX_LAST_VISITED: number
    TOAST_DURATION: number
    SEARCH_DEBOUNCE_TIME: number
  }

  // Search Configuration
  SEARCH_CONFIG: {
    MIN_SEARCH_CHARS: number
    SEARCH_DEBOUNCE_MS: number
    FUZZY_SEARCH_THRESHOLD: number
    MAX_SEARCH_RESULTS: number
    ENABLE_VOICE_SEARCH: boolean
  }

  // Analytics Configuration
  ANALYTICS_CONFIG: {
    ENABLE_USAGE_TRACKING: boolean
    TRACK_SEARCH_QUERIES: boolean
    TRACK_RESOURCE_CLICKS: boolean
    TRACK_FAVORITES: boolean
    TRACK_SHARE_ACTIONS: boolean
  }

  // Resource Display Configuration
  RESOURCE_CONFIG: {
    ENABLE_PREVIEW: boolean
    SHOW_PRICING_BADGE: boolean
    SHOW_RATING: boolean
    SHOW_USAGE_STATS: boolean
    SHOW_LAST_UPDATED: boolean
    VERIFIED_BADGE_ENABLED: boolean
  }

  // Update Configuration
  UPDATE_CONFIG: {
    CHECK_INTERVAL: number
    AUTO_UPDATE_ENABLED: boolean
    UPDATE_NOTIFICATION: boolean
  }

  // Sorting Options
  SORT_OPTIONS: Array<{
    id: string
    label: string
  }>

  // Filter Options
  FILTER_OPTIONS: {
    pricing: PricingType[]
    verification: string[]
    updateFrequency: string[]
    features: string[]
  }

  // Community Configuration
  COMMUNITY_CONFIG: {
    ENABLE_REVIEWS: boolean
    ENABLE_RATINGS: boolean
    ENABLE_COMMENTS: boolean
    REQUIRE_VERIFICATION: boolean
    MAX_REVIEW_LENGTH: number
    MIN_REVIEW_LENGTH: number
  }

  // Competitive Features
  COMPETITIVE_FEATURES: {
    PRICE_TRACKING: boolean
    ALTERNATIVE_SUGGESTIONS: boolean
    FEATURE_COMPARISON: boolean
    INTEGRATION_GUIDES: boolean
    USAGE_TUTORIALS: boolean
    ROI_CALCULATOR: boolean
  }

  // Error Messages
  ERRORS: ErrorMessages

  // Categories Mapping
  CATEGORIES: Record<string, Category>
}

/**
 * Configuration settings for the application
 */
export const CONFIG: Config = {
  // API Configuration
  API_ENDPOINT: process.env.API_ENDPOINT || 'https://api.airesourcedirectory.com',
  API_VERSION: 'v1',
  CACHE_DURATION: 3600, // 1 hour in seconds

  // Storage Keys
  STORAGE_KEYS: {
    FAVORITES: 'favorites',
    DARK_MODE: 'darkMode',
    LAST_VISITED: 'lastVisited',
    RESOURCES: 'cached_resources',
    CATEGORIES: 'cached_categories',
    USER_PREFS: 'user_preferences',
    LAST_UPDATE: 'last_update_check',
    USAGE_STATS: 'usage_statistics',
  },

  // Default Settings
  DEFAULTS: {
    theme: 'system',
    defaultView: 'grid',
    defaultSort: 'rating',
    favoriteCategories: [],
    hiddenResources: [],
    showFeaturedSection: true,
    showTrendingSection: true,
    enableAnimations: true,
    enableNotifications: true,
    maxLastVisited: 10,
    compactView: false,
    developerMode: false,
  },

  // Feature Flags
  FEATURES: {
    RATINGS: true,
    USAGE_STATS: true,
    PRICE_COMPARISON: true,
    TRENDING_SECTION: true,
    DAILY_UPDATES: true,
    OFFLINE_ACCESS: true,
    RESOURCE_VERIFICATION: true,
    COMMUNITY_REVIEWS: true,
    AI_POWERED_SEARCH: true,
    PRICE_ALERTS: true,
  },

  // Categories Configuration
  CATEGORY_CONFIG: {
    FEATURED_CATEGORIES: ['Text Generation', 'Image Generation', 'Code Assistant', 'Business'],
    MAX_CATEGORIES_DISPLAY: 15,
    ENABLE_SUBCATEGORIES: true,
  },

  // UI Configuration
  UI: {
    MAX_DESCRIPTION_LENGTH: 150,
    GRID_ITEMS_PER_ROW: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
    INFINITE_SCROLL_THRESHOLD: 0.8,
    ANIMATION_DURATION: 300,
    MAX_LAST_VISITED: 10,
    TOAST_DURATION: 3000,
    SEARCH_DEBOUNCE_TIME: 300,
  },

  // Search Configuration
  SEARCH_CONFIG: {
    MIN_SEARCH_CHARS: 2,
    SEARCH_DEBOUNCE_MS: 300,
    FUZZY_SEARCH_THRESHOLD: 0.6,
    MAX_SEARCH_RESULTS: 50,
    ENABLE_VOICE_SEARCH: true,
  },

  // Analytics Configuration
  ANALYTICS_CONFIG: {
    ENABLE_USAGE_TRACKING: true,
    TRACK_SEARCH_QUERIES: true,
    TRACK_RESOURCE_CLICKS: true,
    TRACK_FAVORITES: true,
    TRACK_SHARE_ACTIONS: true,
  },

  // Resource Display Configuration
  RESOURCE_CONFIG: {
    ENABLE_PREVIEW: true,
    SHOW_PRICING_BADGE: true,
    SHOW_RATING: true,
    SHOW_USAGE_STATS: true,
    SHOW_LAST_UPDATED: true,
    VERIFIED_BADGE_ENABLED: true,
  },

  // Update Configuration
  UPDATE_CONFIG: {
    CHECK_INTERVAL: 86400, // 24 hours in seconds
    AUTO_UPDATE_ENABLED: true,
    UPDATE_NOTIFICATION: true,
  },

  // Sorting Options
  SORT_OPTIONS: [
    { id: 'rating', label: 'Highest Rated' },
    { id: 'newest', label: 'Newest First' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'trending', label: 'Trending' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
  ],

  // Filter Options
  FILTER_OPTIONS: {
    pricing: ['Free', 'Freemium', 'Paid', 'Enterprise'],
    verification: ['Verified', 'All'],
    updateFrequency: ['Daily', 'Weekly', 'Monthly'],
    features: [
      'API Access',
      'Browser Extension',
      'Mobile App',
      'Offline Mode',
      'Team Collaboration',
    ],
  },

  // Community Configuration
  COMMUNITY_CONFIG: {
    ENABLE_REVIEWS: true,
    ENABLE_RATINGS: true,
    ENABLE_COMMENTS: true,
    REQUIRE_VERIFICATION: true,
    MAX_REVIEW_LENGTH: 1000,
    MIN_REVIEW_LENGTH: 50,
  },

  // Competitive Features
  COMPETITIVE_FEATURES: {
    PRICE_TRACKING: true,
    ALTERNATIVE_SUGGESTIONS: true,
    FEATURE_COMPARISON: true,
    INTEGRATION_GUIDES: true,
    USAGE_TUTORIALS: true,
    ROI_CALCULATOR: true,
  },

  // Error Messages
  ERRORS: {
    STORAGE: {
      LOAD_FAILED: 'Failed to load data from storage',
      SAVE_FAILED: 'Failed to save data to storage',
      QUOTA_EXCEEDED: 'Storage quota exceeded',
    },
    NETWORK: {
      REQUEST_FAILED: 'Network request failed',
    },
  },

  // Categories Mapping
  CATEGORIES: {
    TEXT: 'Text Generation',
    IMAGE: 'Image Generation',
    CODE: 'Code Assistant',
    AUDIO: 'Audio Generation',
    VIDEO: 'Video Generation',
    DATA: 'Data Analysis',
    RESEARCH: 'Research',
    PRODUCTIVITY: 'Productivity',
    EDUCATION: 'Education',
    BUSINESS: 'Business',
    DEVELOPMENT: 'Development',
    DESIGN: 'Design',
    MARKETING: 'Marketing',
    WRITING: 'Writing',
    CUSTOMER_SERVICE: 'Customer Service',
  },
}

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultView: 'grid',
  defaultSort: 'rating',
  favoriteCategories: [],
  hiddenResources: [],
  showFeaturedSection: true,
  showTrendingSection: true,
  enableAnimations: true,
  enableNotifications: true,
  maxLastVisited: 10,
  compactView: false,
  developerMode: false,
}

/**
 * Cache keys for browser storage
 */
export const CACHE_KEYS = {
  RESOURCES: 'cached_resources',
  CATEGORIES: 'cached_categories',
  USER_PREFS: 'user_preferences',
  LAST_UPDATE: 'last_update_check',
  USAGE_STATS: 'usage_statistics',
} as const
