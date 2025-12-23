import { CONFIG } from './config.js'
import { storageUtils, domUtils } from './utils.js'
import { toastManager } from './toast.js'

class OptionsManager {
  constructor() {
    this.elements = {
      // Display settings
      darkMode: document.getElementById('darkMode'),
      reducedMotion: document.getElementById('reducedMotion'),
      defaultCategory: document.getElementById('defaultCategory'),

      // Data management
      maxLastVisited: document.getElementById('maxLastVisited'),
      offlineAccess: document.getElementById('offlineAccess'),
      favoritesCount: document.getElementById('favoritesCount'),
      storageUsed: document.getElementById('storageUsed'),

      // Notifications
      enableNotifications: document.getElementById('enableNotifications'),

      // Buttons
      resetButton: document.getElementById('resetButton'),
      exportButton: document.getElementById('exportButton'),
      importButton: document.getElementById('importButton'),
      saveButton: document.getElementById('saveButton'),

      // Status message
      statusMessage: document.getElementById('statusMessage'),
    }

    this.defaultSettings = {
      darkMode: false,
      reducedMotion: false,
      defaultCategory: 'all',
      maxLastVisited: CONFIG.UI.MAX_RECENT_ITEMS,
      offlineAccess: true,
      enableNotifications: true,
    }

    this.currentSettings = { ...this.defaultSettings }
    this.setupEventListeners()
  }

  async initialize() {
    try {
      // Load current settings
      const settings = (await storageUtils.get('settings')) || {}
      this.currentSettings = { ...this.defaultSettings, ...settings }

      // Update UI with current settings
      this.updateUI()

      // Load statistics
      await this.updateStatistics()
    } catch (error) {
      console.error('Failed to initialize options:', error)
      this.showStatus('Failed to load settings', 'error')
    }
  }

  setupEventListeners() {
    // Save button
    this.elements.saveButton.addEventListener('click', () => this.saveSettings())

    // Reset button
    this.elements.resetButton.addEventListener('click', () => this.resetSettings())

    // Export button
    this.elements.exportButton.addEventListener('click', () => this.exportData())

    // Import button
    this.elements.importButton.addEventListener('click', () => this.importData())

    // Theme preview
    this.elements.darkMode.addEventListener('change', e => {
      document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light')
    })

    // Input validation for maxLastVisited
    this.elements.maxLastVisited.addEventListener('input', e => {
      const value = parseInt(e.target.value)
      if (value < 1) e.target.value = 1
      if (value > 20) e.target.value = 20
    })
  }

  updateUI() {
    // Update form elements with current settings
    this.elements.darkMode.checked = this.currentSettings.darkMode
    this.elements.reducedMotion.checked = this.currentSettings.reducedMotion
    this.elements.defaultCategory.value = this.currentSettings.defaultCategory
    this.elements.maxLastVisited.value = this.currentSettings.maxLastVisited
    this.elements.offlineAccess.checked = this.currentSettings.offlineAccess
    this.elements.enableNotifications.checked = this.currentSettings.enableNotifications

    // Update theme
    document.documentElement.setAttribute(
      'data-theme',
      this.currentSettings.darkMode ? 'dark' : 'light'
    )
  }

  async updateStatistics() {
    try {
      // Get favorites count
      const favorites = (await storageUtils.get(CONFIG.STORAGE_KEYS.FAVORITES)) || []
      this.elements.favoritesCount.textContent = favorites.length

      // Calculate storage usage
      const storageUsed = await this.calculateStorageUsage()
      this.elements.storageUsed.textContent = (storageUsed / 1024).toFixed(2)
    } catch (error) {
      console.error('Failed to update statistics:', error)
    }
  }

  async calculateStorageUsage() {
    try {
      const data = await chrome.storage.local.get(null)
      const dataStr = JSON.stringify(data)
      return new Blob([dataStr]).size
    } catch (error) {
      console.error('Failed to calculate storage usage:', error)
      return 0
    }
  }

  async saveSettings() {
    try {
      // Collect current values
      const newSettings = {
        darkMode: this.elements.darkMode.checked,
        reducedMotion: this.elements.reducedMotion.checked,
        defaultCategory: this.elements.defaultCategory.value,
        maxLastVisited: parseInt(this.elements.maxLastVisited.value),
        offlineAccess: this.elements.offlineAccess.checked,
        enableNotifications: this.elements.enableNotifications.checked,
      }

      // Validate settings
      if (!this.validateSettings(newSettings)) {
        return
      }

      // Save to storage
      await storageUtils.set('settings', newSettings)
      this.currentSettings = newSettings

      // Update UI and show success message
      this.showStatus('Settings saved successfully', 'success')

      // Notify background script of settings change
      chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings: newSettings })
    } catch (error) {
      console.error('Failed to save settings:', error)
      this.showStatus('Failed to save settings', 'error')
    }
  }

  validateSettings(settings) {
    if (settings.maxLastVisited < 1 || settings.maxLastVisited > 20) {
      this.showStatus('Maximum recent items must be between 1 and 20', 'error')
      return false
    }
    return true
  }

  async resetSettings() {
    try {
      // Confirm reset
      if (!confirm('Are you sure you want to reset all settings to defaults?')) {
        return
      }

      // Reset to defaults
      await storageUtils.set('settings', this.defaultSettings)
      this.currentSettings = { ...this.defaultSettings }

      // Update UI
      this.updateUI()
      this.showStatus('Settings reset to defaults', 'success')

      // Notify background script
      chrome.runtime.sendMessage({
        type: 'SETTINGS_UPDATED',
        settings: this.defaultSettings,
      })
    } catch (error) {
      console.error('Failed to reset settings:', error)
      this.showStatus('Failed to reset settings', 'error')
    }
  }

  async exportData() {
    try {
      // Collect all data
      const data = await chrome.storage.local.get(null)

      // Create download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)

      // Trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-resource-directory-backup-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      this.showStatus('Data exported successfully', 'success')
    } catch (error) {
      console.error('Failed to export data:', error)
      this.showStatus('Failed to export data', 'error')
    }
  }

  async importData() {
    try {
      // Create file input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = async e => {
        try {
          const file = e.target.files[0]
          if (!file) return

          const reader = new FileReader()
          reader.onload = async e => {
            try {
              const data = JSON.parse(e.target.result)

              // Validate data structure
              if (!this.validateImportData(data)) {
                this.showStatus('Invalid backup file format', 'error')
                return
              }

              // Confirm import
              if (!confirm('This will override your current settings and data. Continue?')) {
                return
              }

              // Import data
              await chrome.storage.local.clear()
              await chrome.storage.local.set(data)

              // Reload settings and UI
              await this.initialize()
              this.showStatus('Data imported successfully', 'success')

              // Notify background script
              chrome.runtime.sendMessage({ type: 'DATA_IMPORTED' })
            } catch (error) {
              console.error('Failed to process import file:', error)
              this.showStatus('Failed to process import file', 'error')
            }
          }
          reader.readAsText(file)
        } catch (error) {
          console.error('Failed to read import file:', error)
          this.showStatus('Failed to read import file', 'error')
        }
      }

      input.click()
    } catch (error) {
      console.error('Failed to import data:', error)
      this.showStatus('Failed to import data', 'error')
    }
  }

  validateImportData(data) {
    // Add validation logic for imported data structure
    return typeof data === 'object' && data !== null
  }

  showStatus(message, type = 'success') {
    this.elements.statusMessage.textContent = message
    this.elements.statusMessage.className = `status-message ${type}`
    this.elements.statusMessage.style.display = 'block'

    setTimeout(() => {
      this.elements.statusMessage.style.display = 'none'
    }, 3000)
  }
}

// Initialize options page
document.addEventListener('DOMContentLoaded', () => {
  const optionsManager = new OptionsManager()
  optionsManager.initialize()
})

export { OptionsManager }
