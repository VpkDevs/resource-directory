import { vi } from 'vitest';
// Create mock implementations
const getMock = vi.fn().mockImplementation(() => Promise.resolve({}));
const setMock = vi.fn().mockImplementation(() => Promise.resolve());
const removeMock = vi.fn().mockImplementation(() => Promise.resolve());
// Setup Chrome API mock
const mockChrome = {
    storage: {
        local: {
            get: getMock,
            set: setMock,
            remove: removeMock
        }
    }
};
// Make chrome available globally
global.chrome = mockChrome;
// Export for test usage
export const chromeMock = mockChrome;
//# sourceMappingURL=setup.js.map