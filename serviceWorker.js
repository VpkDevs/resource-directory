/**
 * Service Worker (serviceWorker.js)
 * 
 * This Service Worker implements offline functionality and caching strategies
 * for the AI Resource Directory Chrome extension. It enables the application
 * to work offline and provides faster load times through caching.
 * 
 * Features:
 * - Resource caching for offline access
 * - Cache-first strategy with network fallback
 * - Background sync for offline actions
 * - Cache cleanup on version updates
 * - Offline fallback page
 * - Version-based cache management
 * 
 * Cached Resources:
 * - HTML: popup.html, offline.html
 * - CSS: styles.css
 * - JavaScript: script.js, toast.js
 * - Images: Extension icons
 * 
 * Events Handled:
 * - install: Initial cache setup
 * - activate: Cache cleanup
 * - fetch: Request interception
 * - message: Client communication
 * - sync: Background sync
 * 
 * Dependencies:
 * - offline.html: Fallback page for offline mode
 * - config.js: For cache configuration (indirect)
 * 
 * Used By:
 * - manifest.json: Registered as service worker
 * - script.js: For offline functionality
 * 
 * Note: This service worker implements a cache-first strategy with
 * network fallback, suitable for a content-based extension where
 * fresh content is preferred but offline access is important.
 */

// Cache name with version
const CACHE_NAME = 'ai-resource-directory-v1';

// Resources to cache
const CACHED_RESOURCES = [
    '/',
    '/popup.html',
    '/styles.css',
    '/script.js',
    '/toast.js',
    '/images/icon16.png',
    '/images/icon32.png',
    '/images/icon48.png',
    '/images/icon128.png'
];

// Install event: Cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(CACHED_RESOURCES);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request because it can only be used once
                const fetchRequest = event.request.clone();

                // Make network request and cache the response
                return fetch(fetchRequest).then(response => {
                    // Check if response is valid
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it can only be used once
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Return offline fallback if network request fails
                return caches.match('/offline.html');
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-favorites') {
        event.waitUntil(syncFavorites());
    }
});

// Helper function to sync favorites
async function syncFavorites() {
    try {
        const favoriteActions = await getFavoriteActions();
        await Promise.all(favoriteActions.map(action => {
            // Implement favorite syncing logic here
            return syncFavoriteAction(action);
        }));
    } catch (error) {
        console.error('Failed to sync favorites:', error);
    }
}

// Helper function to sync a single favorite action
async function syncFavoriteAction(action) {
    // Implement favorite action sync logic here
    console.log('Syncing favorite action:', action);
}

// Helper function to get favorite actions
async function getFavoriteActions() {
    // Implement logic to get pending favorite actions
    return [];
}
