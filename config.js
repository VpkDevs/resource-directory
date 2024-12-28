export const CONFIG = {
    // API Configuration
    API_ENDPOINT: 'https://api.airesourcedirectory.com',
    API_VERSION: 'v1',
    CACHE_DURATION: 3600, // 1 hour in seconds

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
        PRICE_ALERTS: true
    },

    // Categories Configuration
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

    // UI Configuration
    UI_CONFIG: {
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

    // Search Configuration
    SEARCH_CONFIG: {
        MIN_SEARCH_CHARS: 2,
        SEARCH_DEBOUNCE_MS: 300,
        FUZZY_SEARCH_THRESHOLD: 0.6,
        MAX_SEARCH_RESULTS: 50,
        ENABLE_VOICE_SEARCH: true
    },

    // Analytics Configuration
    ANALYTICS_CONFIG: {
        ENABLE_USAGE_TRACKING: true,
        TRACK_SEARCH_QUERIES: true,
        TRACK_RESOURCE_CLICKS: true,
        TRACK_FAVORITES: true,
        TRACK_SHARE_ACTIONS: true
    },

    // Resource Display Configuration
    RESOURCE_CONFIG: {
        ENABLE_PREVIEW: true,
        SHOW_PRICING_BADGE: true,
        SHOW_RATING: true,
        SHOW_USAGE_STATS: true,
        SHOW_LAST_UPDATED: true,
        VERIFIED_BADGE_ENABLED: true
    },

    // Update Configuration
    UPDATE_CONFIG: {
        CHECK_INTERVAL: 86400, // 24 hours in seconds
        AUTO_UPDATE_ENABLED: true,
        UPDATE_NOTIFICATION: true
    },

    // Sorting Options
    SORT_OPTIONS: [
        { id: 'rating', label: 'Highest Rated' },
        { id: 'newest', label: 'Newest First' },
        { id: 'popular', label: 'Most Popular' },
        { id: 'trending', label: 'Trending' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' }
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
            'Team Collaboration'
        ]
    },

    // Community Features
    COMMUNITY_CONFIG: {
        ENABLE_REVIEWS: true,
        ENABLE_RATINGS: true,
        ENABLE_COMMENTS: true,
        REQUIRE_VERIFICATION: true,
        MAX_REVIEW_LENGTH: 1000,
        MIN_REVIEW_LENGTH: 50
    },

    // Competitive Features
    COMPETITIVE_FEATURES: {
        PRICE_TRACKING: true,
        ALTERNATIVE_SUGGESTIONS: true,
        FEATURE_COMPARISON: true,
        INTEGRATION_GUIDES: true,
        USAGE_TUTORIALS: true,
        ROI_CALCULATOR: true
    }
};

export const RESOURCE_CATEGORIES = [
    'Text Generation',
    'Image Generation',
    'Code Assistant',
    'Audio Generation',
    'Video Generation',
    'Data Analysis',
    'Research',
    'Productivity',
    'Education',
    'Business',
    'Development',
    'Design',
    'Marketing',
    'Writing',
    'Customer Service'
];

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
