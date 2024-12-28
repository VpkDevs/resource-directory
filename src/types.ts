export interface AIResource {
    id: string;
    name: string;
    url: string;
    description: string;
    category: Category[];
    tags: string[];
    pricing: {
        type: 'Free' | 'Freemium' | 'Paid' | 'Enterprise';
        startingPrice?: string;
    };
    rating?: {
        score: number;
        count: number;
    };
    stats?: {
        uses: number;
        saves: number;
    };
    lastUpdated: Date;
    features: string[];
    verified: boolean;
    isNew?: boolean;
}

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

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultView: 'grid' | 'list';
    defaultSort: 'rating' | 'newest' | 'popular';
    favoriteCategories: Category[];
    hiddenResources: string[];
}

export interface ResourceStats {
    totalResources: number;
    totalCategories: number;
    dailyActive: number;
    mostPopularCategories: {
        category: Category;
        count: number;
    }[];
}

export interface UserInteraction {
    resourceId: string;
    action: 'view' | 'save' | 'rate' | 'share';
    timestamp: Date;
    rating?: number;
    timeSpent?: number;
}

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'AppError';
    }
}

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
