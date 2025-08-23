import { CONFIG } from './config.js';
import { storageUtils, performanceUtils, domUtils, stringUtils } from './utils.js';
import { toastManager } from './toast.js';
import { SAMPLE_RESOURCES } from './sample-data.js';

/**
 * StateManager class manages the application state, including favorites,
 * dark mode, last visited items, and loading state.
 */
class StateManager {
    constructor() {
        this.favorites = new Set(); // Stores favorite resources
        this.darkMode = false; // Indicates if dark mode is enabled
        this.lastVisitedItems = []; // Stores last visited items
        this.isLoading = true; // Indicates if the application is loading
        this.settings = null; // Stores user settings
        this.resources = []; // Stores available resources
        this._observers = new Set(); // Observers for state changes
    }

    /**
     * Adds an observer to the state manager.
     * @param {Object} observer - The observer to add.
     */
    addObserver(observer) {
        this._observers.add(observer);
    }

    /**
     * Removes an observer from the state manager.
     * @param {Object} observer - The observer to remove.
     */
    removeObserver(observer) {
        this._observers.delete(observer);
    }

    /**
     * Notifies all observers of a state change.
     * @param {string} event - The event type.
     * @param {Object} data - The data associated with the event.
     */
    notifyObservers(event, data) {
        this._observers.forEach(observer => {
            if (observer.onStateChange) {
                observer.onStateChange(event, data);
            }
        });
    }

    /**
     * Initializes the state manager by loading settings and data.
     * @returns {Promise<boolean>} - Returns true if initialization is successful.
     */
    async initialize() {
        try {
            // Load settings first as they affect other initializations  
            this.settings = await storageUtils.get('settings') || CONFIG.DEFAULT_USER_PREFERENCES;
            
            // Load other data in parallel
            const [favorites, darkMode, lastVisited] = await Promise.all([
                storageUtils.get(CONFIG.CACHE_KEYS?.FAVORITES || 'favorites'),
                storageUtils.get('darkMode'),
                storageUtils.get('lastVisited')
            ]);

            this.favorites = new Set(favorites || []);
            this.darkMode = darkMode ?? this.settings.darkMode;
            this.lastVisitedItems = lastVisited || [];
            this.isLoading = false;
            
            // Load sample resources for MVP
            this.resources = SAMPLE_RESOURCES;

            this.notifyObservers('initialized', { 
                favorites: this.favorites,
                darkMode: this.darkMode,
                lastVisited: this.lastVisitedItems,
                resources: this.resources
            });

            return true;
        } catch (error) {
            console.error('Failed to initialize state:', error);
            toastManager.error('Failed to load settings');
            return false;
        }
    }

    /**
     * Saves the current favorites to storage.
     */
    async saveFavorites() {
        try {
            const favoritesArray = Array.from(this.favorites);
            await storageUtils.set(CONFIG.STORAGE_KEYS.FAVORITES, favoritesArray);
            this.notifyObservers('favoritesUpdated', favoritesArray);
            toastManager.success('Favorites updated');
        } catch (error) {
            console.error('Failed to save favorites:', error);
            toastManager.error('Failed to update favorites');
            throw error;
        }
    }

    /**
     * Saves the current theme preference to storage.
     */
    async saveTheme() {
        try {
            await storageUtils.set(CONFIG.STORAGE_KEYS.DARK_MODE, this.darkMode);
            this.notifyObservers('themeUpdated', this.darkMode);
        } catch (error) {
            console.error('Failed to save theme:', error);
            toastManager.error('Failed to save theme preference');
            throw error;
        }
    }

    /**
     * Saves the last visited items to storage.
     */
    async saveLastVisited() {
        try {
            await storageUtils.set(CONFIG.STORAGE_KEYS.LAST_VISITED, this.lastVisitedItems);
            this.notifyObservers('lastVisitedUpdated', this.lastVisitedItems);
        } catch (error) {
            console.error('Failed to save last visited:', error);
            toastManager.error('Failed to update recently visited');
            throw error;
        }
    }

    /**
     * Cleans up observers when no longer needed.
     */
    cleanup() {
        this._observers.clear();
    }
}

/**
 * UIManager class handles user interface elements and interactions.
 */
class UIManager {
    constructor(stateManager) {
        this.state = stateManager; // Reference to the state manager
        this.elements = {}; // Cached DOM elements
        this.eventListeners = new Map(); // Event listeners for cleanup
        this.virtualScroller = null; // Virtual scroller for performance
        this.intersectionObserver = null; // Intersection observer for lazy loading
        this.debouncedFilter = null; // Debounced filter function
        
        // Initialize components
        this.initializeElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupVirtualScroller();
        
        // Register as state observer
        this.state.addObserver(this);
    }

    /**
     * Initializes DOM elements by caching them for later use.
     */
    initializeElements() {
        // Cache DOM queries
        const elements = {
            searchInput: document.getElementById('search'),
            categoryFilter: document.getElementById('categoryFilter'),
            darkModeToggle: document.getElementById('darkModeToggle'),
            showFavoritesBtn: document.getElementById('showFavorites'),
            resourceSections: document.querySelectorAll('section'),
            lastVisited: document.getElementById('lastVisited'),
            lastVisitedList: document.getElementById('lastVisited'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            resourceCards: document.querySelectorAll('.resource-card'),
            favoriteButtons: document.querySelectorAll('.favorite-btn'),
            resourceLinks: document.querySelectorAll('.resource-card a')
        };

        // Validate required elements
        Object.entries(elements).forEach(([key, element]) => {
            if (!element) {
                console.error(`Required element not found: ${key}`);
            }
        });

        this.elements = elements;
    }

    /**
     * Sets up event listeners for user interactions.
     */
    setupEventListeners() {
        // Create debounced filter function
        this.debouncedFilter = performanceUtils.debounce(
            () => this.filterResources(),
            CONFIG.SEARCH_CONFIG?.SEARCH_DEBOUNCE_MS || 300
        );

        // Store event listeners for cleanup
        const listeners = [
            [this.elements.searchInput, 'input', () => this.debouncedFilter()],
            [this.elements.categoryFilter, 'change', () => this.filterResources()],
            [this.elements.darkModeToggle, 'click', () => this.toggleTheme()],
            [this.elements.showFavoritesBtn, 'click', () => this.toggleFavorites()]
        ];

        // Add event listeners and store them for cleanup
        listeners.forEach(([element, event, handler]) => {
            if (element) {
                element.addEventListener(event, handler);
                this.eventListeners.set(element, { event, handler });
            }
        });

        // Delegate events for dynamic elements
        this.setupEventDelegation();

        // Listen for settings changes
        this.setupMessageListener();
    }

    /**
     * Sets up event delegation for dynamic elements.
     */
    setupEventDelegation() {
        // Event delegation for resource cards
        const delegatedHandler = (event) => {
            const resourceLink = event.target.closest('.resource-card a');
            if (resourceLink) {
                this.handleResourceClick(event);
                return;
            }

            const favoriteBtn = event.target.closest('.favorite-btn');
            if (favoriteBtn) {
                this.toggleFavoriteItem(event);
            }
        };

        document.addEventListener('click', delegatedHandler);
        this.eventListeners.set(document, { 
            event: 'click', 
            handler: delegatedHandler 
        });
    }

    /**
     * Sets up a message listener for settings updates.
     */
    setupMessageListener() {
        const messageHandler = (message) => {
            if (message.type === 'SETTINGS_UPDATED') {
                this.handleSettingsUpdate(message.settings);
            }
        };
        chrome.runtime.onMessage.addListener(messageHandler);
        this.eventListeners.set('chrome.runtime', messageHandler);
    }

    /**
     * Sets up an intersection observer for lazy loading resource cards.
     */
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target;
                        card.classList.add('visible');
                        // Load lazy images if any
                        card.querySelectorAll('img[data-src]').forEach(img => {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observe resource cards
        this.elements.resourceCards.forEach(card => {
            this.intersectionObserver.observe(card);
        });
    }

    /**
     * Sets up a virtual scroller for performance optimization.
     */
    setupVirtualScroller() {
        if (this.elements.lastVisitedList) {
            this.virtualScroller = {
                itemHeight: 100, // Approximate height of each item
                visibleItems: 10, // Number of items visible at once
                totalItems: 0,
                startIndex: 0,
                endIndex: 0,
                scrollContainer: this.elements.lastVisitedList,
                
                update: (items) => {
                    this.totalItems = items.length;
                    const scrollTop = this.scrollContainer.scrollTop;
                    this.startIndex = Math.floor(scrollTop / this.itemHeight);
                    this.endIndex = this.startIndex + this.visibleItems;
                    this.render(items);
                },

                render: (items) => {
                    const visibleItems = items.slice(this.startIndex, this.endIndex);
                    const html = this.generateLastVisitedHTML(visibleItems);
                    requestAnimationFrame(() => {
                        this.scrollContainer.innerHTML = html;
                    });
                }
            };

            // Add scroll listener for virtual scrolling
            const scrollHandler = performanceUtils.throttle(() => {
                if (this.state.lastVisitedItems.length > this.virtualScroller.visibleItems) {
                    this.virtualScroller.update(this.state.lastVisitedItems);
                }
            }, 16); // ~60fps

            this.elements.lastVisitedList.addEventListener('scroll', scrollHandler);
            this.eventListeners.set(this.elements.lastVisitedList, {
                event: 'scroll',
                handler: scrollHandler
            });
        }
    }

    /**
     * Handles state changes from the state manager.
     * @param {string} event - The event type.
     * @param {Object} data - The data associated with the event.
     */
    onStateChange(event, data) {
        switch (event) {
            case 'initialized':
                this.updateTheme();
                this.updateFavoriteButtons();
                this.updateLastVisited();
                this.filterResources();
                break;
            case 'favoritesUpdated':
                this.updateFavoriteButtons();
                this.filterResources();
                break;
            case 'themeUpdated':
                this.updateTheme();
                break;
            case 'lastVisitedUpdated':
                this.updateLastVisited();
                break;
        }
    }

    /**
     * Toggles the theme between dark and light mode.
     */
    async toggleTheme() {
        this.state.darkMode = !this.state.darkMode;
        this.updateTheme();
        await this.state.saveTheme();
    }

    /**
     * Updates the theme based on the current state.
     */
    updateTheme() {
        const isDark = this.state.darkMode;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        if (this.elements.darkModeToggle) {
            this.elements.darkModeToggle.textContent = isDark ? '☀️' : '🌓';
            this.elements.darkModeToggle.setAttribute(
                'aria-label',
                `Switch to ${isDark ? 'light' : 'dark'} mode`
            );
        }
    }

    /**
     * Toggles a favorite item based on user interaction.
     * @param {Event} event - The click event.
     */
    async toggleFavoriteItem(event) {
        try {
            const btn = event.target;
            const resourceId = btn.dataset.id;
            const isFavorite = this.state.favorites.has(resourceId);
            
            // Optimistic UI update
            btn.classList.add('processing');
            
            if (isFavorite) {
                this.state.favorites.delete(resourceId);
                btn.textContent = '☆';
                btn.setAttribute('aria-label', 'Add to favorites');
            } else {
                this.state.favorites.add(resourceId);
                btn.textContent = '⭐';
                btn.setAttribute('aria-label', 'Remove from favorites');
            }

            await this.state.saveFavorites();
            
            // Animate button
            btn.classList.remove('processing');
            btn.classList.toggle('active', !isFavorite);
            requestAnimationFrame(() => {
                btn.classList.add('animate');
                setTimeout(() => btn.classList.remove('animate'), 300);
            });
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            this.updateFavoriteButtons();
        }
    }

    /**
     * Updates the favorite buttons based on the current state.
     */
    updateFavoriteButtons() {
        this.elements.favoriteButtons.forEach(btn => {
            const resourceId = btn.dataset.id;
            const isFavorite = this.state.favorites.has(resourceId);
            btn.textContent = isFavorite ? '⭐' : '☆';
            btn.setAttribute('aria-label', 
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
            );
            btn.classList.toggle('active', isFavorite);
        });
    }

    /**
     * Toggles the visibility of favorite items.
     */
    toggleFavorites() {
        if (this.elements.showFavoritesBtn) {
            this.elements.showFavoritesBtn.classList.toggle('active');
            this.filterResources();
        }
    }

    /**
     * Filters resources based on user input and selected category.
     */
    filterResources() {
        if (!this.elements.searchInput || !this.elements.categoryFilter) return;

        const query = this.elements.searchInput.value.toLowerCase();
        const category = this.elements.categoryFilter.value;
        const showOnlyFavorites = this.elements.showFavoritesBtn?.classList.contains('active');

        // Create a DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        let visibleSections = 0;

        this.elements.resourceSections.forEach(section => {
            const sectionId = section.id;
            const items = section.querySelectorAll('li');
            let hasVisibleItems = false;

            if (category !== 'all' && category !== sectionId) {
                domUtils.setVisibility(section, false);
                return;
            }

            items.forEach(item => {
                const card = item.querySelector('.resource-card');
                const link = card.querySelector('a');
                const description = card.querySelector('.description');
                const tags = Array.from(card.querySelectorAll('.tag'))
                    .map(tag => tag.textContent);
                const resourceId = card.querySelector('.favorite-btn').dataset.id;
                
                const matchesSearch = 
                    link.textContent.toLowerCase().includes(query) ||
                    description.textContent.toLowerCase().includes(query) ||
                    tags.some(tag => tag.toLowerCase().includes(query));
                
                const matchesFavorites = !showOnlyFavorites || 
                    this.state.favorites.has(resourceId);

                const isVisible = matchesSearch && matchesFavorites;
                domUtils.setVisibility(item, isVisible);
                
                if (isVisible) {
                    hasVisibleItems = true;
                    fragment.appendChild(item.cloneNode(true));
                }
            });

            domUtils.setVisibility(section, hasVisibleItems);
            if (hasVisibleItems) visibleSections++;
        });

        // Update UI with results
        this.updateFilterResults(visibleSections, fragment);
    }

    /**
     * Updates the filter results based on the number of visible sections.
     * @param {number} visibleSections - The number of visible sections.
     * @param {DocumentFragment} fragment - The fragment containing visible items.
     */
    updateFilterResults(visibleSections, fragment) {
        const noResults = visibleSections === 0;
        const noResultsEl = document.getElementById('noResults');
        
        if (noResults) {
            if (!noResultsEl) {
                const message = document.createElement('div');
                message.id = 'noResults';
                message.className = 'no-results';
                message.textContent = 'No matching resources found';
                this.elements.resourceSections[0].parentNode.appendChild(message);
            }
        } else if (noResultsEl) {
            noResultsEl.remove();
        }

        // Update aria-live region for screen readers
        const liveRegion = document.getElementById('filterResults') || 
            (() => {
                const region = document.createElement('div');
                region.id = 'filterResults';
                region.setAttribute('aria-live', 'polite');
                region.className = 'visually-hidden';
                document.body.appendChild(region);
                return region;
            })();

        liveRegion.textContent = noResults ? 
            'No matching resources found' : 
            `Found ${fragment.children.length} matching resources in ${visibleSections} categories`;
    }

    /**
     * Handles clicks on resource cards to update last visited items.
     * @param {Event} event - The click event.
     */
    async handleResourceClick(event) {
        const card = event.target.closest('.resource-card');
        if (!card) return;

        const resourceData = {
            id: card.querySelector('.favorite-btn').dataset.id,
            title: event.target.textContent.trim(),
            url: event.target.href,
            description: card.querySelector('.description').textContent.trim(),
            timestamp: Date.now()
        };

        this.state.lastVisitedItems = [
            resourceData,
            ...this.state.lastVisitedItems
                .filter(item => item.id !== resourceData.id)
        ].slice(0, this.state.settings.maxLastVisited || CONFIG.UI.MAX_LAST_VISITED);

        await this.state.saveLastVisited();
    }

    /**
     * Generates HTML for the last visited items.
     * @param {Array} items - The last visited items.
     * @returns {string} - The generated HTML.
     */
    generateLastVisitedHTML(items) {
        return items.map(item => `
            <li>
                <div class="resource-card">
                    <div class="resource-header">
                        <a href="${stringUtils.escapeHtml(item.url)}" 
                           target="_blank"
                           rel="noopener noreferrer">
                            ${stringUtils.escapeHtml(item.title)}
                        </a>
                        <span class="timestamp" 
                              title="${new Date(item.timestamp).toLocaleString()}">
                            ${stringUtils.formatTimestamp(item.timestamp)}
                        </span>
                    </div>
                    <p class="description">
                        ${stringUtils.escapeHtml(item.description)}
                    </p>
                </div>
            </li>
        `).join('');
    }

    /**
     * Updates the last visited section in the UI.
     */
    updateLastVisited() {
        if (!this.elements.lastVisited || !this.elements.lastVisitedList) return;

        if (this.state.lastVisitedItems.length === 0) {
            domUtils.setVisibility(this.elements.lastVisited, false);
            return;
        }

        domUtils.setVisibility(this.elements.lastVisited, true);

        if (this.virtualScroller && this.state.lastVisitedItems.length > this.virtualScroller.visibleItems) {
            this.virtualScroller.update(this.state.lastVisitedItems);
        } else {
            requestAnimationFrame(() => {
                this.elements.lastVisitedList.innerHTML = 
                    this.generateLastVisitedHTML(this.state.lastVisitedItems);
            });
        }
    }

    /**
     * Handles settings updates from the background script.
     * @param {Object} newSettings - The updated settings.
     */
    handleSettingsUpdate(newSettings) {
        this.state.settings = newSettings;
        this.updateTheme();
        this.updateLastVisited();
        this.filterResources();
    }

    /**
     * Shows the loading spinner.
     */
    showLoading() {
        domUtils.setVisibility(this.elements.loadingSpinner, true);
    }

    /**
     * Hides the loading spinner.
     */
    hideLoading() {
        domUtils.setVisibility(this.elements.loadingSpinner, false);
    }

    /**
     * Cleans up event listeners and observers.
     */
    cleanup() {
        // Remove event listeners
        this.eventListeners.forEach((config, element) => {
            if (element === 'chrome.runtime') {
                chrome.runtime.onMessage.removeListener(config);
            } else {
                element.removeEventListener(config.event, config.handler);
            }
        });
        this.eventListeners.clear();

        // Cleanup intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }

        // Clear debounced functions
        if (this.debouncedFilter) {
            this.debouncedFilter.cancel();
            this.debouncedFilter = null;
        }

        // Clear virtual scroller
        this.virtualScroller = null;

        // Remove as state observer
        this.state.removeObserver(this);

        // Clear element references
        this.elements = {};
    }
}

// Initialize Application
async function initializeApp() {
    let stateManager = null;
    let uiManager = null;

    try {
        // Create managers
        stateManager = new StateManager();
        uiManager = new UIManager(stateManager);
        
        // Show loading state
        uiManager.showLoading();
        
        // Initialize state
        await stateManager.initialize();

        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('serviceWorker.js');
                console.log('Service Worker registered successfully');

                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            toastManager.info('Update available! Reload to update.');
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                // Non-critical error, continue without service worker
            }
        }

        // Setup error boundary
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            toastManager.error('An unexpected error occurred');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            toastManager.error('An unexpected error occurred');
        });

    } catch (error) {
        console.error('Failed to initialize app:', error);
        toastManager.error('Failed to initialize application');
    } finally {
        if (uiManager) {
            uiManager.hideLoading();
        }
    }

    // Cleanup on unload
    window.addEventListener('unload', () => {
        if (stateManager) stateManager.cleanup();
        if (uiManager) uiManager.cleanup();
    });
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
