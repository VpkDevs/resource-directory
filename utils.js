/**
 * Utility Functions (utils.js)
 * 
 * This file provides a comprehensive collection of utility functions used throughout
 * the AI Resource Directory Chrome extension. It's organized into logical modules,
 * each handling specific types of operations.
 * 
 * Modules:
 * - dateUtils: Date formatting and timestamp operations
 * - domUtils: DOM manipulation and element management
 * - stringUtils: String manipulation and sanitization
 * - dataUtils: Array and object operations
 * - storageUtils: Chrome storage operations
 * - performanceUtils: Performance optimization utilities
 * - networkUtils: Network operations and connectivity checks
 * - validationUtils: Input validation functions
 * - EventBus: Pub/sub pattern implementation
 * 
 * Dependencies:
 * - config.js: For configuration constants
 * - types.ts: For TypeScript type definitions and error types
 * 
 * Used By:
 * - script.js: Main application logic
 * - options.js: Settings page functionality
 * - toast.js: For utility functions
 * - serviceWorker.js: For network and cache utilities
 * 
 * Each utility function is designed to be pure when possible, with clear inputs
 * and outputs. Error handling is implemented consistently using AppError types.
 * The utilities are optimized for performance and include TypeScript support.
 */

import { CONFIG } from './config.js';
import { AppError } from './types.ts';

// Time and Date Utilities
export const dateUtils = {
    formatTimestamp(timestamp) {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    },

    isExpired(timestamp, maxAge) {
        return Date.now() - timestamp > maxAge;
    }
};

// DOM Utilities
export const domUtils = {
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    setVisibility(element, visible) {
        if (element) {
            element.classList.toggle('hidden', !visible);
            element.setAttribute('aria-hidden', !visible);
        }
    }
};

// String Utilities
export const stringUtils = {
    truncate(str, length = CONFIG.UI.MAX_DESCRIPTION_LENGTH) {
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
    },

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};

// Array and Object Utilities
export const dataUtils = {
    groupBy(array, key) {
        return array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    },

    sortBy(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            const valueA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
            const valueB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    },

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

// Storage Utilities
export const storageUtils = {
    async get(key) {
        try {
            const result = await chrome.storage.local.get(key);
            return result[key];
        } catch (error) {
            throw new AppError(
                CONFIG.ERRORS.STORAGE.LOAD_FAILED,
                'STORAGE_GET_ERROR',
                error
            );
        }
    },

    async set(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
        } catch (error) {
            if (error.message.includes('QUOTA_BYTES')) {
                throw new AppError(
                    CONFIG.ERRORS.STORAGE.QUOTA_EXCEEDED,
                    'STORAGE_QUOTA_ERROR',
                    error
                );
            }
            throw new AppError(
                CONFIG.ERRORS.STORAGE.SAVE_FAILED,
                'STORAGE_SET_ERROR',
                error
            );
        }
    },

    async remove(key) {
        try {
            await chrome.storage.local.remove(key);
        } catch (error) {
            throw new AppError(
                CONFIG.ERRORS.STORAGE.SAVE_FAILED,
                'STORAGE_REMOVE_ERROR',
                error
            );
        }
    }
};

// Performance Utilities
export const performanceUtils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    measureExecutionTime(func) {
        return async function (...args) {
            const start = performance.now();
            const result = await func.apply(this, args);
            const end = performance.now();
            console.debug(`${func.name} execution time: ${end - start}ms`);
            return result;
        };
    }
};

// Network Utilities
export const networkUtils = {
    async checkConnectivity() {
        return navigator.onLine;
    },

    async fetchWithTimeout(resource, options = {}) {
        const { timeout = 5000 } = options;
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw new AppError(
                CONFIG.ERRORS.NETWORK.REQUEST_FAILED,
                'NETWORK_ERROR',
                error
            );
        }
    }
};

// Validation Utilities
export const validationUtils = {
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },

    isValidResourceId(id) {
        return typeof id === 'string' && id.length > 0;
    },

    isValidCategory(category) {
        return Object.values(CONFIG.CATEGORIES).includes(category);
    }
};

// Event Bus for pub/sub pattern
export class EventBus {
    constructor() {
        this.subscribers = {};
    }

    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);

        return () => {
            this.subscribers[event] = this.subscribers[event].filter(
                cb => cb !== callback
            );
        };
    }

    publish(event, data) {
        if (!this.subscribers[event]) return;
        this.subscribers[event].forEach(callback => callback(data));
    }
}

// Export a singleton instance of EventBus
export const eventBus = new EventBus();
