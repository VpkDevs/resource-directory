/**
 * Resource Service (resourceService.ts)
 * 
 * This service provides functionality for managing AI resources including
 * loading, filtering, sorting, and searching the resource collection.
 */

import { CONFIG, CACHE_KEYS } from '../config';
import { 
  AIResource, 
  Category, 
  FilterOptions, 
  ResourceCollection, 
  SearchQuery, 
  SortOptions,
  ApiResponse,
  ResourcesResponse
} from '../types';
import { storageUtils, networkUtils } from '../utils';

class ResourceService {
  private resources: ResourceCollection = {
    byId: {},
    allIds: [],
    byCategory: {} as Record<Category, string[]>,
    byTag: {},
    featured: [],
    trending: [],
    newest: []
  };

  private isInitialized: boolean = false;

  constructor() {
    // Initialize category arrays
    Object.values(CONFIG.CATEGORIES).forEach(category => {
      this.resources.byCategory[category] = [];
    });
  }

  /**
   * Initializes the resource service by loading resources
   * from cache or network
   */
  async initialize(): Promise<boolean> {
    try {
      // Try to load from cache first
      const cachedResources = await storageUtils.get<AIResource[]>(CACHE_KEYS.RESOURCES);
      const lastUpdateTime = await storageUtils.get<number>(CACHE_KEYS.LAST_UPDATE);
      
      const cacheExpired = !lastUpdateTime || 
        Date.now() - lastUpdateTime > CONFIG.CACHE_DURATION * 1000;
      
      if (cachedResources && !cacheExpired) {
        this.processResources(cachedResources);
        this.isInitialized = true;
        return true;
      }
      
      // Cache expired or not available, fetch from network
      const fetchedResources = await this.fetchResources();
      if (fetchedResources) {
        this.processResources(fetchedResources);
        // Update cache
        await storageUtils.set(CACHE_KEYS.RESOURCES, fetchedResources);
        await storageUtils.set(CACHE_KEYS.LAST_UPDATE, Date.now());
        this.isInitialized = true;
        return true;
      }
      
      // If network fetch failed but we have cached resources, use them anyway
      if (cachedResources) {
        this.processResources(cachedResources);
        this.isInitialized = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize resource service:', error);
      return false;
    }
  }

  /**
   * Fetches resources from the API
   */
  private async fetchResources(): Promise<AIResource[] | null> {
    try {
      const isOnline = await networkUtils.checkConnectivity();
      if (!isOnline) {
        throw new Error('No internet connection');
      }
      
      const response = await networkUtils.fetchWithTimeout(
        `${CONFIG.API_ENDPOINT}/${CONFIG.API_VERSION}/resources`,
        { timeout: 10000 }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: ApiResponse<ResourcesResponse> = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Invalid API response');
      }
      
      return data.data.resources;
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      return null;
    }
  }

  /**
   * Processes resources and organizes them into the collection
   */
  private processResources(resources: AIResource[]): void {
    // Reset collections
    this.resources = {
      byId: {},
      allIds: [],
      byCategory: {} as Record<Category, string[]>,
      byTag: {},
      featured: [],
      trending: [],
      newest: []
    };
    
    // Initialize category arrays
    Object.values(CONFIG.CATEGORIES).forEach(category => {
      this.resources.byCategory[category] = [];
    });
    
    // Process each resource
    resources.forEach(resource => {
      // Add to byId map
      this.resources.byId[resource.id] = resource;
      
      // Add to allIds array
      this.resources.allIds.push(resource.id);
      
      // Add to category maps
      resource.category.forEach(category => {
        if (!this.resources.byCategory[category]) {
          this.resources.byCategory[category] = [];
        }
        this.resources.byCategory[category].push(resource.id);
      });
      
      // Add to tag maps
      resource.tags.forEach(tag => {
        if (!this.resources.byTag[tag]) {
          this.resources.byTag[tag] = [];
        }
        this.resources.byTag[tag].push(resource.id);
      });
      
      // Add to featured if applicable
      if (resource.isFeatured) {
        this.resources.featured.push(resource.id);
      }
      
      // Add to trending if applicable
      if (resource.isTrending) {
        this.resources.trending.push(resource.id);
      }
    });
    
    // Sort newest by date added
    this.resources.newest = [...this.resources.allIds].sort((a, b) => {
      const dateA = new Date(this.resources.byId[a].dateAdded).getTime();
      const dateB = new Date(this.resources.byId[b].dateAdded).getTime();
      return dateB - dateA;
    }).slice(0, 10);
  }

  /**
   * Gets all resources
   */
  getAllResources(): AIResource[] {
    return this.resources.allIds.map(id => this.resources.byId[id]);
  }

  /**
   * Gets a resource by ID
   */
  getResourceById(id: string): AIResource | null {
    return this.resources.byId[id] || null;
  }

  /**
   * Gets resources by category
   */
  getResourcesByCategory(category: Category): AIResource[] {
    const ids = this.resources.byCategory[category] || [];
    return ids.map(id => this.resources.byId[id]);
  }

  /**
   * Gets resources by tag
   */
  getResourcesByTag(tag: string): AIResource[] {
    const ids = this.resources.byTag[tag] || [];
    return ids.map(id => this.resources.byId[id]);
  }

  /**
   * Gets featured resources
   */
  getFeaturedResources(): AIResource[] {
    return this.resources.featured.map(id => this.resources.byId[id]);
  }

  /**
   * Gets trending resources
   */
  getTrendingResources(): AIResource[] {
    return this.resources.trending.map(id => this.resources.byId[id]);
  }

  /**
   * Gets newest resources
   */
  getNewestResources(): AIResource[] {
    return this.resources.newest.map(id => this.resources.byId[id]);
  }

  /**
   * Searches resources based on query parameters
   */
  searchResources(query: SearchQuery): AIResource[] {
    let results = this.resources.allIds.map(id => this.resources.byId[id]);
    
    // Filter by text search
    if (query.text && query.text.length >= CONFIG.SEARCH_CONFIG.MIN_SEARCH_CHARS) {
      const searchText = query.text.toLowerCase();
      results = results.filter(resource => 
        resource.name.toLowerCase().includes(searchText) ||
        resource.description.toLowerCase().includes(searchText) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchText))
      );
    }
    
    // Filter by categories
    if (query.categories && query.categories.length > 0) {
      results = results.filter(resource => 
        resource.category.some(category => 
          query.categories!.includes(category)
        )
      );
    }
    
    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(resource => 
        resource.tags.some(tag => 
          query.tags!.includes(tag)
        )
      );
    }
    
    // Filter by pricing
    if (query.pricing && query.pricing.length > 0) {
      results = results.filter(resource => 
        query.pricing!.includes(resource.pricing.type)
      );
    }
    
    // Filter by verification
    if (query.verifiedOnly) {
      results = results.filter(resource => resource.verified);
    }
    
    // Filter by minimum rating
    if (query.minRating !== undefined) {
      results = results.filter(resource => 
        resource.rating && resource.rating.score >= query.minRating!
      );
    }
    
    // Filter by features
    if (query.features && query.features.length > 0) {
      results = results.filter(resource => 
        query.features!.every(feature => 
          resource.features.includes(feature)
        )
      );
    }
    
    // Limit results
    return results.slice(0, CONFIG.SEARCH_CONFIG.MAX_SEARCH_RESULTS);
  }

  /**
   * Filters resources based on filter options
   */
  filterResources(options: FilterOptions): AIResource[] {
    let results = this.resources.allIds.map(id => this.resources.byId[id]);
    
    // Filter by categories
    if (options.categories.length > 0) {
      results = results.filter(resource => 
        resource.category.some(category => 
          options.categories.includes(category)
        )
      );
    }
    
    // Filter by tags
    if (options.tags.length > 0) {
      results = results.filter(resource => 
        resource.tags.some(tag => 
          options.tags.includes(tag)
        )
      );
    }
    
    // Filter by pricing
    if (options.pricing.length > 0) {
      results = results.filter(resource => 
        options.pricing.includes(resource.pricing.type)
      );
    }
    
    // Filter by verification
    if (options.verification) {
      results = results.filter(resource => resource.verified);
    }
    
    // Filter by features
    if (options.features.length > 0) {
      results = results.filter(resource => 
        options.features.every(feature => 
          resource.features.includes(feature)
        )
      );
    }
    
    return results;
  }

  /**
   * Sorts resources based on sort options
   */
  sortResources(resources: AIResource[], options: SortOptions): AIResource[] {
    const { field, direction } = options;
    
    return [...resources].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (field) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'rating':
          valueA = a.rating?.score || 0;
          valueB = b.rating?.score || 0;
          break;
        case 'dateAdded':
          valueA = new Date(a.dateAdded).getTime();
          valueB = new Date(b.dateAdded).getTime();
          break;
        case 'lastUpdated':
          valueA = new Date(a.lastUpdated).getTime();
          valueB = new Date(b.lastUpdated).getTime();
          break;
        case 'popularity':
          valueA = a.stats?.views || 0;
          valueB = b.stats?.views || 0;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Adds a new resource
   */
  async addResource(resource: AIResource): Promise<boolean> {
    try {
      // Validate resource
      if (!resource.id || !resource.name || !resource.url) {
        throw new Error('Invalid resource data');
      }
      
      // Add resource to collection
      this.resources.byId[resource.id] = resource;
      this.resources.allIds.push(resource.id);
      
      // Update category maps
      resource.category.forEach(category => {
        if (!this.resources.byCategory[category]) {
          this.resources.byCategory[category] = [];
        }
        this.resources.byCategory[category].push(resource.id);
      });
      
      // Update tag maps
      resource.tags.forEach(tag => {
        if (!this.resources.byTag[tag]) {
          this.resources.byTag[tag] = [];
        }
        this.resources.byTag[tag].push(resource.id);
      });
      
      // Update cache
      const allResources = this.getAllResources();
      await storageUtils.set(CACHE_KEYS.RESOURCES, allResources);
      
      return true;
    } catch (error) {
      console.error('Failed to add resource:', error);
      return false;
    }
  }

  /**
   * Updates an existing resource
   */
  async updateResource(resource: AIResource): Promise<boolean> {
    try {
      // Check if resource exists
      if (!this.resources.byId[resource.id]) {
        throw new Error('Resource not found');
      }
      
      // Update resource in collection
      this.resources.byId[resource.id] = resource;
      
      // Update cache
      const allResources = this.getAllResources();
      await storageUtils.set(CACHE_KEYS.RESOURCES, allResources);
      
      return true;
    } catch (error) {
      console.error('Failed to update resource:', error);
      return false;
    }
  }

  /**
   * Deletes a resource
   */
  async deleteResource(id: string): Promise<boolean> {
    try {
      // Check if resource exists
      if (!this.resources.byId[id]) {
        throw new Error('Resource not found');
      }
      
      const resource = this.resources.byId[id];
      
      // Remove resource from collection
      delete this.resources.byId[id];
      this.resources.allIds = this.resources.allIds.filter(resId => resId !== id);
      
      // Remove from category maps
      resource.category.forEach(category => {
        this.resources.byCategory[category] = 
          this.resources.byCategory[category].filter(resId => resId !== id);
      });
      
      // Remove from tag maps
      resource.tags.forEach(tag => {
        this.resources.byTag[tag] = 
          this.resources.byTag[tag].filter(resId => resId !== id);
      });
      
      // Remove from featured/trending/newest
      this.resources.featured = this.resources.featured.filter(resId => resId !== id);
      this.resources.trending = this.resources.trending.filter(resId => resId !== id);
      this.resources.newest = this.resources.newest.filter(resId => resId !== id);
      
      // Update cache
      const allResources = this.getAllResources();
      await storageUtils.set(CACHE_KEYS.RESOURCES, allResources);
      
      return true;
    } catch (error) {
      console.error('Failed to delete resource:', error);
      return false;
    }
  }

  /**
   * Refreshes resources from the network
   */
  async refreshResources(): Promise<boolean> {
    try {
      const fetchedResources = await this.fetchResources();
      if (fetchedResources) {
        this.processResources(fetchedResources);
        await storageUtils.set(CACHE_KEYS.RESOURCES, fetchedResources);
        await storageUtils.set(CACHE_KEYS.LAST_UPDATE, Date.now());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh resources:', error);
      return false;
    }
  }

  /**
   * Exports resources as JSON
   */
  exportResourcesAsJson(): string {
    return JSON.stringify(this.getAllResources(), null, 2);
  }

  /**
   * Gets resource statistics
   */
  getResourceStats() {
    const allResources = this.getAllResources();
    
    // Count resources by category
    const categoryCounts = {} as Record<Category, number>;
    Object.values(CONFIG.CATEGORIES).forEach(category => {
      categoryCounts[category] = this.resources.byCategory[category]?.length || 0;
    });
    
    // Get most popular categories
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([category, count]) => ({
        category: category as Category,
        count
      }));
    
    // Get most viewed resources
    const mostViewed = [...allResources]
      .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
      .slice(0, 5)
      .map(resource => ({
        id: resource.id,
        name: resource.name,
        views: resource.stats?.views || 0
      }));
    
    // Get most saved resources
    const mostSaved = [...allResources]
      .sort((a, b) => (b.stats?.saves || 0) - (a.stats?.saves || 0))
      .slice(0, 5)
      .map(resource => ({
        id: resource.id,
        name: resource.name,
        saves: resource.stats?.saves || 0
      }));
    
    return {
      totalResources: allResources.length,
      totalCategories: Object.values(CONFIG.CATEGORIES).length,
      dailyActive: 0, // This would come from analytics
      mostPopularCategories: sortedCategories,
      mostViewedResources: mostViewed,
      mostSavedResources: mostSaved
    };
  }
}

// Export a singleton instance of ResourceService
export const resourceService = new ResourceService();
