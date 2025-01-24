export const CONFIG = {
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
};
export const CACHE_KEYS = {
    RESOURCES: 'cached_resources',
    CATEGORIES: 'cached_categories',
    USER_PREFS: 'user_preferences',
    LAST_UPDATE: 'last_update_check',
    USAGE_STATS: 'usage_statistics'
};
//# sourceMappingURL=config.js.map