/**
 * Utility Functions (utils.ts)
 * 
 * This file provides a comprehensive collection of utility functions used throughout
 * the AI Resource Directory Chrome extension. It's organized into logical modules,
 * each handling specific types of operations.
 */

import { CONFIG } from './config'
import { AppError, Category } from './types'

interface DOMAttributes {
    className?: string
    dataset?: Record<string, string>
    [key: string]: any
}

// Time and Date Utilities
export const dateUtils = {
    formatTimestamp(timestamp: number): string {
        const minutes = Math.floor((Date.now() - timestamp) / 60000)
        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    },

    isExpired(timestamp: number, maxAge: number): boolean {
        return Date.now() - timestamp > maxAge
    }
}

// DOM Utilities
export const domUtils = {
    createElement(tag: string, attributes: DOMAttributes = {}, children: (string | HTMLElement)[] = []): HTMLElement {
        const element = document.createElement(tag)
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue
                })
            } else {
                element.setAttribute(key, value)
            }
        })
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child))
            } else {
                element.appendChild(child)
            }
        })
        return element
    },

    removeElement(element: HTMLElement): void {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element)
        }
    },

    setVisibility(element: HTMLElement, visible: boolean): void {
        if (element) {
            element.style.display = visible ? '' : 'none'
            element.setAttribute('aria-hidden', (!visible).toString())
        }
    }
}

// String Utilities
export const stringUtils = {
    truncate(str: string, length: number = CONFIG.UI.MAX_DESCRIPTION_LENGTH): string {
        if (str.length <= length) return str
        return str.slice(0, length) + '...'
    },

    escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
    },

    slugify(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }
}

// Array and Object Utilities
export const dataUtils = {
    groupBy<T>(array: T[], key: keyof T): Record<string | number, T[]> {
        return array.reduce((result, item) => {
            const keyValue = item[key] as string | number
            ;(result[keyValue] = result[keyValue] || []).push(item)
            return result
        }, {} as Record<string | number, T[]>)
    },

    sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
        return [...array].sort((a, b) => {
            const valueA = typeof a[key] === 'string' ? (a[key] as string).toLowerCase() : a[key]
            const valueB = typeof b[key] === 'string' ? (b[key] as string).toLowerCase() : b[key]
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1
            if (valueA > valueB) return direction === 'asc' ? 1 : -1
            return 0
        })
    },

    deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj))
    }
}

// Storage Utilities
export const storageUtils = {
    async get<T>(key: string): Promise<T | undefined> {
        try {
            const result = await chrome.storage.local.get(key)
            return result[key] as T
        } catch (error) {
            throw new AppError(
                CONFIG.ERRORS.STORAGE.LOAD_FAILED,
                'STORAGE_GET_ERROR',
                error as Error
            )
        }
    },

    async set<T>(key: string, value: T): Promise<void> {
        try {
            await chrome.storage.local.set({ [key]: value })
        } catch (error) {
            if ((error as Error).message.includes('QUOTA_BYTES')) {
                throw new AppError(
                    CONFIG.ERRORS.STORAGE.QUOTA_EXCEEDED,
                    'STORAGE_QUOTA_ERROR',
                    error as Error
                )
            }
            throw new AppError(
                CONFIG.ERRORS.STORAGE.SAVE_FAILED,
                'STORAGE_SET_ERROR',
                error as Error
            )
        }
    },

    async remove(key: string): Promise<void> {
        try {
            await chrome.storage.local.remove(key)
        } catch (error) {
            throw new AppError(
                CONFIG.ERRORS.STORAGE.SAVE_FAILED,
                'STORAGE_REMOVE_ERROR',
                error as Error
            )
        }
    }
}

// Performance Utilities
export const performanceUtils = {
    debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout
        return function executedFunction(...args: Parameters<T>) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    },

    throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
        let inThrottle: boolean
        return function executedFunction(...args: Parameters<T>) {
            if (!inThrottle) {
                func(...args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    },

    measureExecutionTime<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => Promise<ReturnType<T>> {
        return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
            const start = performance.now()
            const result = await func.apply(this, args)
            const end = performance.now()
            console.debug(`${func.name} execution time: ${end - start}ms`)
            return result
        }
    }
}

// Network Utilities
interface FetchOptions extends RequestInit {
    timeout?: number
}

export const networkUtils = {
    async checkConnectivity(): Promise<boolean> {
        return navigator.onLine
    },

    async fetchWithTimeout(resource: RequestInfo, options: FetchOptions = {}): Promise<Response> {
        const { timeout = 5000, ...fetchOptions } = options
        
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), timeout)

        try {
            const response = await fetch(resource, {
                ...fetchOptions,
                signal: controller.signal
            })
            clearTimeout(id)
            return response
        } catch (error) {
            clearTimeout(id)
            throw new AppError(
                CONFIG.ERRORS.NETWORK.REQUEST_FAILED,
                'NETWORK_ERROR',
                error as Error
            )
        }
    }
}

// Validation Utilities
export const validationUtils = {
    isValidUrl(string: string): boolean {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    },

    isValidResourceId(id: string): boolean {
        return typeof id === 'string' && id.length > 0
    },

    isValidCategory(category: string): category is Category {
        return Object.values(CONFIG.CATEGORIES).includes(category as Category)
    }
}

// Event Bus for pub/sub pattern
type Callback = (data: any) => void
type Unsubscribe = () => void

export class EventBus {
    private subscribers: Record<string, Callback[]>

    constructor() {
        this.subscribers = {}
    }

    subscribe(event: string, callback: Callback): Unsubscribe {
        if (!this.subscribers[event]) {
            this.subscribers[event] = []
        }
        this.subscribers[event].push(callback)

        return () => {
            this.subscribers[event] = this.subscribers[event].filter(
                cb => cb !== callback
            )
        }
    }

    publish(event: string, data: any): void {
        if (!this.subscribers[event]) return
        this.subscribers[event].forEach(callback => callback(data))
    }
}

// Export a singleton instance of EventBus
export const eventBus = new EventBus()
