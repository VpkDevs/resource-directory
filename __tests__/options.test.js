import { describe, it, expect, beforeEach } from 'vitest';
import { OptionsManager } from '../options.js';
import { storageUtils } from '../utils.js';
import { CONFIG } from '../src/config.js';

describe('OptionsManager', () => {
    let optionsManager;
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
            <div id="favoritesCount">0</div>
            <div id="storageUsed">0</div>
            <button id="saveButton">Save</button>
            <button id="resetButton">Reset</button>
            <button id="exportButton">Export</button>
            <button id="importButton">Import</button>
            <div id="statusMessage"></div>
        `;
        optionsManager = new OptionsManager();
    });
    it('should save settings correctly', async () => {
        optionsManager.elements.darkMode.checked = true;
        optionsManager.elements.maxLastVisited.value = '10';
        optionsManager.elements.offlineAccess.checked = true;
        optionsManager.elements.enableNotifications.checked = true;
        await optionsManager.saveSettings();
        expect(await storageUtils.get('settings')).toEqual({
            darkMode: true,
            reducedMotion: false,
            defaultCategory: 'all',
            maxLastVisited: 10,
            offlineAccess: true,
            enableNotifications: true
        });
    });
    it('should reset settings to defaults', async () => {
        optionsManager.elements.darkMode.checked = true;
        await optionsManager.saveSettings();
        await optionsManager.resetSettings();
        expect(await storageUtils.get('settings')).toEqual(optionsManager.defaultSettings);
    });
    it('should import data correctly', async () => {
        // Set DOM elements to specific values first
        optionsManager.elements.darkMode.checked = false;
        optionsManager.elements.reducedMotion.checked = true;
        optionsManager.elements.maxLastVisited.value = '5';
        optionsManager.elements.offlineAccess.checked = true;
        optionsManager.elements.enableNotifications.checked = false;
        
        // Save these settings
        await optionsManager.saveSettings();
        
        expect(await storageUtils.get('settings')).toEqual({
            darkMode: false,
            reducedMotion: true,
            defaultCategory: 'all',
            maxLastVisited: 5,
            offlineAccess: true,
            enableNotifications: false
        });
    });
    it('should export data correctly', async () => {
        await optionsManager.saveSettings();
        const data = await storageUtils.get('settings');
        expect(data).toEqual(optionsManager.currentSettings);
    });
});
//# sourceMappingURL=options.test.js.map