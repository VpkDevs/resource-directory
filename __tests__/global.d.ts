import { Mock } from 'vitest'

declare global {
  interface StorageArea {
    get: Mock
    set: Mock
    remove: Mock
  }

  interface ChromeStorage {
    local: StorageArea
  }

  interface Chrome {
    storage: ChromeStorage
  }

  // Declare chrome as a global variable
  const chrome: Chrome
}

// This needs to be a module
export {}
