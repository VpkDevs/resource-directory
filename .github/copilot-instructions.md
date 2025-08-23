# AI Resource Directory Chrome Extension

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Dependencies
- Install dependencies: `npm ci` -- takes ~5 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Code formatting: `npm run format` -- takes ~2-3 seconds. NEVER CANCEL.

### Working Commands (With Timings)
- `npm ci` -- Install dependencies (~5 seconds, NEVER CANCEL)
- `npm run format` -- Format code with Prettier (~2-3 seconds, NEVER CANCEL)
- `npm run build` -- Build Chrome extension (~0.7 seconds, NEVER CANCEL)
- `npm run test` -- Run tests (~3.7 seconds, PARTIALLY WORKS: 14/30 tests pass, NEVER CANCEL)
- `npm run lint -- --fix` -- Auto-fix lint issues (~2 seconds, reduces problems)

### Partially Working Commands
- `npm run lint` -- WORKS but shows 77 problems (51 errors, 26 warnings)
- `npm run test` -- WORKS but 16/30 tests fail due to missing dependencies (logger, config issues)
- `npm run lint -- --fix` -- WORKS and can auto-fix some issues

### Build Process - NOW WORKING ✅
**FIXED**: The build process works after fixing import paths!
- `npm run build` -- takes ~0.7 seconds, produces working Chrome extension in `dist/` folder
- Build output includes: popup.html, options.html, popup.js, options.js, background.js, styles
- Extension can be loaded from `dist/` folder in Chrome Developer Mode

### Known Issues Still Present
- **TypeScript types mismatch**: script.js imports `AppState`, `Resource`, `LastVisitedItem` which don't exist in src/types.ts
- **Missing logger**: Several utility functions reference undefined `logger` 
- **Config issues**: Some CONFIG properties are undefined (CONFIG.UI.MAX_RECENT_ITEMS)
- **HTML escaping bug**: escapeHtml function not working correctly in tests
- **Lint warnings**: 77 problems (51 errors, 26 warnings) but many are in docs/prettify files

### Chrome Extension Development

**CRITICAL**: This is a Chrome Extension (manifest v3), NOT a web application.

**Primary Development Workflow**:
1. Make changes to source files in the root directory
2. Run `npm run build` (~0.7 seconds) to create dist/ folder
3. Load the extension in Chrome from the `dist/` folder
4. Test functionality manually in Chrome
5. Reload extension when making changes

**Loading the Extension**:
1. Run `npm run build` to create dist/ folder
2. Open Chrome browser → `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist/` directory (NOT the root directory)
6. Extension will load and be available

### Key Project Structure
```
/
├── manifest.json           # Extension manifest (entry point)
├── popup.html             # Extension popup UI  
├── options.html           # Extension options page
├── serviceWorker.js       # Background service worker
├── script.js             # Main popup logic
├── utils.js              # Utility functions
├── styles.css            # Styles
├── vite.config.ts        # Build configuration (WORKS)
├── dist/                 # Built extension (load this in Chrome)
│   ├── popup.html
│   ├── options.html  
│   ├── popup.js
│   ├── options.js
│   └── background.js
├── src/                  # TypeScript sources
│   ├── types.ts          # Type definitions
│   ├── utils.ts          # TypeScript utilities
│   └── services/         # Service classes
└── __tests__/            # Test files (partially working)
```

### Validation Steps - NEVER CANCEL
**ALWAYS** perform these validation steps after making changes:

1. **Format Check**: `npm run format` (~2-3 seconds)
2. **Build**: `npm run build` (~0.7 seconds)
3. **Lint Check**: `npm run lint` (~2 seconds, expect warnings)
4. **Test**: `npm run test` (~3.7 seconds, expect some failures)
5. **Extension Loading**: Load `dist/` folder in Chrome Developer Mode
6. **Manual Testing**: Test extension functionality

**Manual Validation Scenarios**:
After building and loading extension, ALWAYS test:
1. Click extension icon to open popup
2. Test search functionality in popup
3. Test category filtering 
4. Test favorites toggle
5. Test dark mode toggle
6. Open options page (right-click extension → Options)
7. Check browser DevTools console for errors

### Time Expectations - NEVER CANCEL
- **Dependency install**: `npm ci` takes ~5 seconds
- **Code formatting**: `npm run format` takes ~2-3 seconds
- **Build**: `npm run build` takes ~0.7 seconds -- NEVER CANCEL
- **Tests**: `npm run test` takes ~3.7 seconds -- NEVER CANCEL  
- **Linting**: `npm run lint` takes ~2 seconds
- **Extension reload**: Manual reload in Chrome takes ~1-2 seconds
- **Manual testing**: Allow 5-10 minutes for comprehensive testing

### Working Development Cycle
```bash
# 1. Install dependencies (first time only)
npm ci                    # ~5 seconds

# 2. Make code changes in root directory files
# Edit popup.html, script.js, utils.js, styles.css, etc.

# 3. Format and validate
npm run format           # ~2-3 seconds
npm run build           # ~0.7 seconds - creates dist/ folder

# 4. Test in Chrome
# Load dist/ folder in Chrome Extensions (Developer mode)
# Test functionality manually

# 5. Optional: Run tests and lint
npm run test            # ~3.7 seconds (14/30 tests pass)
npm run lint            # ~2 seconds (shows warnings)
```

### Frequently Used Commands
```bash
# Essential commands
npm ci                   # Install dependencies (~5 seconds)
npm run format          # Format code (~2-3 seconds)  
npm run build           # Build extension (~0.7 seconds)

# Validation commands  
npm run test            # Run tests (~3.7 seconds, some failures expected)
npm run lint            # Check code quality (~2 seconds, warnings expected)
npm run lint -- --fix  # Auto-fix lint issues (~2 seconds)
```

### Package.json Scripts Status
```json
{
  "test": "vitest run",           // WORKS - 14/30 tests pass (~3.7s)
  "test:watch": "vitest",         // WORKS - watch mode
  "test:coverage": "vitest run --coverage", // WORKS - with coverage
  "dev": "vite",                  // WORKS - but not useful for Chrome extension
  "build": "vite build",          // WORKS - builds to dist/ (~0.7s) ✅
  "lint": "eslint .",             // WORKS - shows 77 problems (~2s)
  "format": "prettier --write ."  // WORKS - formats code (~2-3s) ✅
}
```

## CRITICAL REMINDERS

1. **Always build before testing**: Run `npm run build` to create `dist/` folder
2. **Load `dist/` in Chrome**: NOT the root directory
3. **Expect test failures**: Only 14/30 tests currently pass
4. **Expect lint warnings**: 77 problems but build still works  
5. **Manual testing is essential**: Automated testing is limited
6. **Format before committing**: Always run `npm run format`

## Getting Started (First Time Setup)
1. `npm ci` (install dependencies, ~5 seconds)
2. `npm run build` (create dist/ folder, ~0.7 seconds) 
3. Open Chrome → `chrome://extensions/` → Enable "Developer mode"
4. Click "Load unpacked" → select `dist/` directory
5. Test extension functionality manually
6. For changes: edit files → `npm run build` → reload extension in Chrome
