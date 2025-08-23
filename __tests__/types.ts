import { Mock } from 'vitest'

export interface StorageArea {
  get: Mock
  set: Mock
  remove: Mock
}

export interface ChromeStorage {
  local: StorageArea
}

export interface ChromeAPI {
  storage: ChromeStorage
}

declare global {
  // Extend the existing Window interface
  interface Window {
    chrome: ChromeAPI
  }

  // Extend the NodeJS global
  namespace NodeJS {
    interface Global {
      chrome: ChromeAPI
    }
  }
}

// This prevents TS error about this being a module
export {}
