import type { Category, ErrorMessages } from './types'

interface Config {
    API_ENDPOINT: string;
    API_VERSION: string;
    CACHE_DURATION: number;
    
    FEATURES: {
        RATINGS: boolean;
        USAGE_STATS: boolean;
        PRICE_COMPARISON: boolean;
        TRENDING_SECTION: boolean;
        DAILY_UPDATES: boolean;
        OFFLINE_ACCESS: boolean;
        RESOURCE_VERIFICATION: boolean;
        COMMUNITY_REVIEWS: boolean;
        AI_POWERED_SEARCH: boolean;
        PRICE_ALERTS: boolean;
    };

    CATEGORY_CONFIG: {
        FEATURED_CATEGORIES: Category[];
        MAX_CATEGORIES_DISPLAY: number;
        ENABLE_SUBCATEGORIES: boolean;
    };

    UI: {
        MAX_DESCRIPTION_LENGTH: number;
        GRID_ITEMS_PER_ROW: {
            desktop: number;
            tablet: number;
            mobile: number;
        };
        INFINITE_SCROLL_THRESHOLD: number;
        ANIMATION_DURATION: number;
        MAX_RECENT_ITEMS: number;
        TOAST_DURATION: number;
    };

    SEARCH_CONFIG: {
        MIN_SEARCH_CHARS: number;
        SEARCH_DEBOUNCE_MS: number;
        FUZZY_SEARCH_THRESHOLD: number;
        MAX_SEARCH_RESULTS: number;
        ENABLE_VOICE_SEARCH: boolean;
    };

    ANALYTICS_CONFIG: {
        ENABLE_USAGE_TRACKING: boolean;
        TRACK_SEARCH_QUERIES: boolean;
        TRACK_RESOURCE_CLICKS: boolean;
        TRACK_FAVORITES: boolean;
        TRACK_SHARE_ACTIONS: boolean;
    };

    RESOURCE_CONFIG: {
        ENABLE_PREVIEW: boolean;
        SHOW_PRICING_BADGE: boolean;
        SHOW_RATING: boolean;
        SHOW_USAGE_STATS: boolean;
        SHOW_LAST_UPDATED: boolean;
        VERIFIED_BADGE_ENABLED: boolean;
    };

    UPDATE_CONFIG: {
        CHECK_INTERVAL: number;
        AUTO_UPDATE_ENABLED: boolean;
        UPDATE_NOTIFICATION: boolean;
    };

    SORT_OPTIONS: Array<{
        id: string;
        label: string;
    }>;

    FILTER_OPTIONS: {
        pricing: string[];
        verification: string[];
        updateFrequency: string[];
        features: string[];
    };

    COMMUNITY_CONFIG: {
        ENABLE_REVIEWS: boolean;
        ENABLE_RATINGS: boolean;
        ENABLE_COMMENTS: boolean;
        REQUIRE_VERIFICATION: boolean;
        MAX_REVIEW_LENGTH: number;
        MIN_REVIEW_LENGTH: number;
    };

    COMPETITIVE_FEATURES: {
        PRICE_TRACKING: boolean;
        ALTERNATIVE_SUGGESTIONS: boolean;
        FEATURE_COMPARISON: boolean;
        INTEGRATION_GUIDES: boolean;
        USAGE_TUTORIALS: boolean;
        ROI_CALCULATOR: boolean;
    };

    ERRORS: ErrorMessages;

    CATEGORIES: Record<string, Category>;
}

export const CONFIG: Config = {
    API_ENDPOINT: 'https://api.airesourcedirectory.com',
    API_VERSION: 'v1',
    CACHE_DURATION: 3600,

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
        PRICE_ALERTS: true
    },

    CATEGORY_CONFIG: {
        FEATURED_CATEGORIES: [
            'Text Generation',
            'Image Generation',
            'Code Assistant',
            'Business'
        ],
        MAX_CATEGORIES_DISPLAY: 15,
        ENABLE_SUBCATEGORIES: true
    },

    UI: {
        MAX_DESCRIPTION_LENGTH: 150,
        GRID_ITEMS_PER_ROW: {
            desktop: 3,
            tablet: 2,
            mobile: 1
        },
        INFINITE_SCROLL_THRESHOLD: 0.8,
        ANIMATION_DURATION: 300,
        MAX_RECENT_ITEMS: 10,
        TOAST_DURATION: 3000
    },

    SEARCH_CONFIG: {
        MIN_SEARCH_CHARS: 2,
        SEARCH_DEBOUNCE_MS: 300,
        FUZZY_SEARCH_THRESHOLD: 0.6,
        MAX_SEARCH_RESULTS: 50,
        ENABLE_VOICE_SEARCH: true
    },

    ANALYTICS_CONFIG: {
        ENABLE_USAGE_TRACKING: true,
        TRACK_SEARCH_QUERIES: true,
        TRACK_RESOURCE_CLICKS: true,
        TRACK_FAVORITES: true,
        TRACK_SHARE_ACTIONS: true
    },

    RESOURCE_CONFIG: {
        ENABLE_PREVIEW: true,
        SHOW_PRICING_BADGE: true,
        SHOW_RATING: true,
        SHOW_USAGE_STATS: true,
        SHOW_LAST_UPDATED: true,
        VERIFIED_BADGE_ENABLED: true
    },

    UPDATE_CONFIG: {
        CHECK_INTERVAL: 86400,
        AUTO_UPDATE_ENABLED: true,
        UPDATE_NOTIFICATION: true
    },

    SORT_OPTIONS: [
        { id: 'rating', label: 'Highest Rated' },
        { id: 'newest', label: 'Newest First' },
        { id: 'popular', label: 'Most Popular' },
        { id: 'trending', label: 'Trending' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' }
    ],

    FILTER_OPTIONS: {
        pricing: ['Free', 'Freemium', 'Paid', 'Enterprise'],
        verification: ['Verified', 'All'],
        updateFrequency: ['Daily', 'Weekly', 'Monthly'],
        features: [
            'API Access',
            'Browser Extension',
            'Mobile App',
            'Offline Mode',
            'Team Collaboration'
        ]
    },

    COMMUNITY_CONFIG: {
        ENABLE_REVIEWS: true,
        ENABLE_RATINGS: true,
        ENABLE_COMMENTS: true,
        REQUIRE_VERIFICATION: true,
        MAX_REVIEW_LENGTH: 1000,
        MIN_REVIEW_LENGTH: 50
    },

    COMPETITIVE_FEATURES: {
        PRICE_TRACKING: true,
        ALTERNATIVE_SUGGESTIONS: true,
        FEATURE_COMPARISON: true,
        INTEGRATION_GUIDES: true,
        USAGE_TUTORIALS: true,
        ROI_CALCULATOR: true
    },

    ERRORS: {
        STORAGE: {
            LOAD_FAILED: 'Failed to load data from storage',
            SAVE_FAILED: 'Failed to save data to storage',
            QUOTA_EXCEEDED: 'Storage quota exceeded'
        },
        NETWORK: {
            REQUEST_FAILED: 'Network request failed'
        }
    },

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
        CUSTOMER_SERVICE: 'Customer Service'
    }
};

export const DEFAULT_USER_PREFERENCES = {
    theme: 'system',
    defaultView: 'grid',
    defaultSort: 'rating',
    favoriteCategories: [],
    hiddenResources: []
} as const;

export const CACHE_KEYS = {
    RESOURCES: 'cached_resources',
    CATEGORIES: 'cached_categories',
    USER_PREFS: 'user_preferences',
    LAST_UPDATE: 'last_update_check',
    USAGE_STATS: 'usage_statistics'
} as const;
