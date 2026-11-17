import { vi } from 'vitest'

// Create a mock storage for testing
const mockStorage = new Map()

// Create mock implementations that simulate chrome.storage behavior
const getMock = vi.fn().mockImplementation((key) => {
  if (typeof key === 'string') {
    return Promise.resolve({ [key]: mockStorage.get(key) })
  }
  if (Array.isArray(key)) {
    const result = {}
    key.forEach(k => {
      result[k] = mockStorage.get(k)
    })
    return Promise.resolve(result)
  }
  return Promise.resolve({})
})

const setMock = vi.fn().mockImplementation((items) => {
  Object.entries(items).forEach(([key, value]) => {
    mockStorage.set(key, value)
  })
  return Promise.resolve()
})

const removeMock = vi.fn().mockImplementation((key) => {
  if (typeof key === 'string') {
    mockStorage.delete(key)
  } else if (Array.isArray(key)) {
    key.forEach(k => mockStorage.delete(k))
  }
  return Promise.resolve()
})

// Setup Chrome API mock
const mockChrome = {
  storage: {
    local: {
      get: getMock,
      set: setMock,
      remove: removeMock
    }
  },
  runtime: {
    sendMessage: vi.fn().mockResolvedValue(undefined)
  }
}

// Make chrome available globally
global.chrome = mockChrome as any

// Mock window.confirm
global.confirm = vi.fn().mockReturnValue(true)

// Export for test usage
export const chromeMock = mockChrome
