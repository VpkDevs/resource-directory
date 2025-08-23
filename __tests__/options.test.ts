import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OptionsManager } from '../options.js'
import { storageUtils } from '../utils.js'
import { CONFIG } from '../src/config.js'

describe('OptionsManager', () => {
  let optionsManager: OptionsManager

  beforeEach(() => {
    document.body.innerHTML = `
            <input id="darkMode" type="checkbox">
            <input id="reducedMotion" type="checkbox">
            <select id="defaultCategory">
                <option value="all">All</option>
            </select>
            <input id="maxLastVisited" type="number" value="5">
            <input id="offlineAccess" type="checkbox">
            <input id="enableNotifications" type="checkbox">
            <button id="saveButton">Save</button>
            <button id="resetButton">Reset</button>
            <div id="statusMessage"></div>
        `
    optionsManager = new OptionsManager()
  })

  it('should save settings correctly', async () => {
    (optionsManager.elements.darkMode as HTMLInputElement).checked = true
    ;(optionsManager.elements.maxLastVisited as HTMLInputElement).value = '10'
    await optionsManager.saveSettings()
    expect(await storageUtils.get('settings')).toEqual({
      darkMode: true,
      reducedMotion: false,
      defaultCategory: 'all',
      maxLastVisited: 10,
      offlineAccess: true,
      enableNotifications: true,
    })
  })

  it('should reset settings to defaults', async () => {
    (optionsManager.elements.darkMode as HTMLInputElement).checked = true
    await optionsManager.saveSettings()
    await optionsManager.resetSettings()
    expect(await storageUtils.get('settings')).toEqual(optionsManager.defaultSettings)
  })

  it('should import data correctly', async () => {
    const mockData = {
      settings: {
        darkMode: false,
        reducedMotion: true,
        defaultCategory: 'all',
        maxLastVisited: 5,
        offlineAccess: true,
        enableNotifications: false,
      },
    }
    const blob = new Blob([JSON.stringify(mockData)], { type: 'application/json' })
    const file = new File([blob], 'backup.json', { type: 'application/json' })
    const input = document.createElement('input')
    input.type = 'file'
    Object.defineProperty(input, 'files', {
      value: [file],
    })
    await optionsManager.importData()
    expect(await storageUtils.get('settings')).toEqual(mockData.settings)
  })

  it('should export data correctly', async () => {
    await optionsManager.saveSettings()
    const data = await storageUtils.get('settings')
    expect(data).toEqual(optionsManager.currentSettings)
  })
})
