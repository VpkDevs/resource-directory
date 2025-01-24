import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageUtils, performanceUtils, domUtils, stringUtils, dateUtils } from '../src/utils';
import { chromeMock } from './setup';
describe('Utils', () => {
    describe('stringUtils', () => {
        it('should escape HTML correctly', () => {
            const input = '<script>alert("xss")</script>';
            const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
            expect(stringUtils.escapeHtml(input)).toBe(expected);
        });
        it('should slugify text correctly', () => {
            const input = 'Hello World! This is a Test';
            const expected = 'hello-world-this-is-a-test';
            expect(stringUtils.slugify(input)).toBe(expected);
        });
    });
    describe('dateUtils', () => {
        it('should format timestamp correctly', () => {
            const now = Date.now();
            const result = dateUtils.formatTimestamp(now);
            expect(typeof result).toBe('string');
        });
        it('should check if timestamp is expired', () => {
            const now = Date.now();
            const hourAgo = now - (60 * 60 * 1000);
            expect(dateUtils.isExpired(hourAgo, 30 * 60 * 1000)).toBe(true); // 30 minutes
            expect(dateUtils.isExpired(now, 30 * 60 * 1000)).toBe(false);
        });
    });
    describe('domUtils', () => {
        it('should set visibility correctly', () => {
            const element = document.createElement('div');
            domUtils.setVisibility(element, false);
            expect(element.style.display).toBe('none');
            domUtils.setVisibility(element, true);
            expect(element.style.display).toBe('');
        });
        it('should create element with attributes and children', () => {
            const element = domUtils.createElement('div', {
                className: 'test-class',
                dataset: { testId: 'test-123' }
            }, ['Child text']);
            expect(element.tagName).toBe('DIV');
            expect(element.className).toBe('test-class');
            expect(element.dataset.testId).toBe('test-123');
            expect(element.textContent).toBe('Child text');
        });
    });
    describe('performanceUtils', () => {
        it('should debounce function calls', async () => {
            let counter = 0;
            const increment = () => counter++;
            const debouncedIncrement = performanceUtils.debounce(increment, 100);
            debouncedIncrement();
            debouncedIncrement();
            debouncedIncrement();
            expect(counter).toBe(0);
            await new Promise(resolve => setTimeout(resolve, 150));
            expect(counter).toBe(1);
        });
        it('should throttle function calls', () => {
            let counter = 0;
            const increment = () => counter++;
            const throttledIncrement = performanceUtils.throttle(increment, 100);
            throttledIncrement();
            throttledIncrement();
            throttledIncrement();
            expect(counter).toBe(1);
        });
    });
    describe('storageUtils', () => {
        const mockData = { testKey: 'testValue' };
        beforeEach(() => {
            vi.clearAllMocks();
            chromeMock.storage.local.get.mockImplementation(() => Promise.resolve(mockData));
        });
        it('should set items in storage', async () => {
            const key = 'testKey';
            const value = { test: 'data' };
            await storageUtils.set(key, value);
            expect(chromeMock.storage.local.set).toHaveBeenCalledWith({ [key]: value });
        });
        it('should get items from storage', async () => {
            const key = 'testKey';
            const result = await storageUtils.get(key);
            expect(result).toBe('testValue');
            expect(chromeMock.storage.local.get).toHaveBeenCalledWith(key);
        });
        it('should remove items from storage', async () => {
            const key = 'testKey';
            await storageUtils.remove(key);
            expect(chromeMock.storage.local.remove).toHaveBeenCalledWith(key);
        });
    });
});
//# sourceMappingURL=utils.test.js.map