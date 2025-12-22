# AI Resource Directory - GitHub Copilot Instructions

## Project Overview

This is a Chrome browser extension called **AI Resource Directory** (resourcehub-ai) that provides a comprehensive directory of AI resource platforms and interactive AI models. It helps users discover, organize, and access various AI tools across different categories like Text Generation, Image Generation, Code Assistants, and more.

## Technology Stack

- **Language**: TypeScript (with JavaScript support for legacy files)
- **Module System**: ES Modules (ESNext)
- **Runtime Environment**: Chrome Extension (Manifest V3)
- **Testing**: Vitest with jsdom
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **Documentation**: JSDoc
- **Logging**: Winston

## Project Structure

```
/
├── .github/              # GitHub configuration
├── __tests__/            # Test files (*.test.ts, *.test.js)
│   ├── setup.ts          # Test setup and configuration
│   └── *.test.ts         # Unit tests
├── src/                  # Source code (TypeScript)
│   ├── config.ts         # Configuration and constants
│   ├── types.ts          # Core type definitions
│   ├── utils.ts          # Utility functions
│   ├── logger.js         # Winston logger configuration
│   ├── toast.ts          # Toast notification system
│   ├── core/             # Core functionality modules
│   └── services/         # Service layer modules
├── *.js                  # Root-level JavaScript files (legacy/compiled)
├── *.ts                  # Root-level TypeScript files
├── *.html                # Extension UI pages
├── manifest.json         # Chrome extension manifest
└── package.json          # Dependencies and scripts
```

## Build, Test, and Lint Commands

```bash
# Install dependencies
npm install

# Run tests
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report

# Development
npm run dev               # Start Vite dev server

# Build
npm run build             # Build with Vite

# Code quality
npm run lint              # Run ESLint
npm run format            # Format with Prettier
```

## Code Style and Conventions

### TypeScript/JavaScript

- **Semicolons**: NO semicolons (Prettier config: `"semi": false`)
- **Quotes**: Single quotes for strings (Prettier config: `"singleQuote": true`)
- **Indentation**: 2 spaces (Prettier config: `"tabWidth": 2`)
- **Line length**: 100 characters (Prettier config: `"printWidth": 100`)
- **Trailing commas**: ES5 style (Prettier config: `"trailingComma": "es5"`)
- **Arrow function parens**: Avoid when possible (Prettier config: `"arrowParens": "avoid"`)
- **Console usage**: Avoid `console.log`; use `console.warn` and `console.error` only (ESLint rule)
- **TypeScript strict mode**: Enabled with strict type checking
- **Type annotations**: Explicit function return types are optional but encouraged for public APIs

### File Naming

- TypeScript source files: Use `.ts` extension
- Test files: Use `.test.ts` or `.test.js` extension
- Configuration files: Use `.config.ts` or `.config.js` extension

### Documentation

- Use JSDoc comments for all exported functions, classes, and types
- Include `@param` and `@returns` tags
- Add file-level documentation at the top of each file explaining its purpose

### Error Handling

- Use the custom `AppError` class from `src/types.ts` for application errors
- Always provide error codes and wrap original errors
- Store error messages in `CONFIG.ERRORS` from `src/config.ts`

Example:
```typescript
throw new AppError(
  CONFIG.ERRORS.STORAGE.LOAD_FAILED,
  'STORAGE_GET_ERROR',
  error as Error
)
```

### Utility Functions

The project uses modular utility functions organized in `src/utils.ts`:
- `dateUtils` - Time and date formatting
- `domUtils` - DOM manipulation helpers
- `stringUtils` - String operations (truncate, escapeHtml, slugify)
- `dataUtils` - Array and object operations (groupBy, sortBy, deepClone)
- `storageUtils` - Chrome storage API wrappers with error handling
- `performanceUtils` - Debounce, throttle, performance measurement
- `networkUtils` - Network utilities with timeout support
- `validationUtils` - Input validation helpers
- `EventBus` - Pub/sub pattern implementation

Always use these utilities instead of creating duplicate functionality.

## Key Concepts and Types

### Core Types (from `src/types.ts`)

- **`AIResource`**: Main data model for AI tools with categories, pricing, ratings, features, etc.
- **`Category`**: Union type of 15 AI tool categories (Text Generation, Image Generation, Code Assistant, etc.)
- **`PricingType`**: 'Free' | 'Freemium' | 'Paid' | 'Enterprise'
- **`UserPreferences`**: User settings (theme, view, sort preferences, etc.)
- **`AppState`**: Global application state
- **`ResourceCollection`**: Organized collection of resources by ID, category, and tag
- **`SearchQuery`** and **`FilterOptions`**: Search and filtering interfaces

### Configuration (from `src/config.ts`)

- All configuration constants are centralized in `CONFIG` object
- Feature flags in `CONFIG.FEATURES`
- Storage keys in `CONFIG.STORAGE_KEYS`
- Default user preferences in `CONFIG.DEFAULTS`
- UI configuration in `CONFIG.UI`
- Categories mapping in `CONFIG.CATEGORIES`

### Chrome Extension APIs

This extension uses Manifest V3 APIs:
- **Storage API**: `chrome.storage.local` for persistent data (use `storageUtils` helpers)
- **Service Worker**: Background script (`serviceWorker.js`)
- **Action API**: Popup and icon management
- **Commands API**: Keyboard shortcuts
- **Tabs API**: Tab management
- **Context Menus**: Right-click menu integration
- **Notifications**: User notifications
- **Bookmarks**: Integration with browser bookmarks

### State Management

- The project uses an Observer pattern for state management
- Main state manager in `script.js` (StateManager class)
- Use `addObserver()` and `notifyObservers()` for state changes
- Alternative: Use the `EventBus` singleton from `utils.ts` for pub/sub

### Toast Notifications

- Use `toastManager` from `toast.js` for user notifications
- Supports types: 'success', 'error', 'warning', 'info'
- Configurable duration and actions

## Path Aliases

The TypeScript configuration defines path aliases:
- `@/*` → `src/*`
- `@/types` → `src/types`
- `@/services` → `src/services`
- `@/utils` → `src/utils`

Use these aliases when importing from the src directory.

## Testing

- Test framework: Vitest with jsdom environment
- Test files: Located in `__tests__/` directory
- Setup file: `__tests__/setup.ts`
- Global test utilities are available (vi, describe, it, expect, beforeEach, afterEach)
- Run tests before committing changes
- Aim for meaningful test coverage of new features

## Security Considerations

- Always use `stringUtils.escapeHtml()` to sanitize user input before displaying in DOM
- Validate URLs with `validationUtils.isValidUrl()` before navigation
- Use Content Security Policy defined in manifest.json
- Handle sensitive data according to Chrome extension best practices
- Log security-related events using the Winston logger

## Common Patterns

### Creating DOM Elements

Use `domUtils.createElement()` instead of direct DOM manipulation:

```typescript
const element = domUtils.createElement('div', {
  className: 'resource-card',
  dataset: { resourceId: resource.id }
}, [child1, child2])
```

### Async Storage Operations

```typescript
// Get from storage
const data = await storageUtils.get<ResourceType>('key')

// Save to storage
await storageUtils.set('key', data)

// Remove from storage
await storageUtils.remove('key')
```

### Debouncing User Input

```typescript
const debouncedSearch = performanceUtils.debounce(searchFunction, 300)
```

### Event Subscriptions

```typescript
const unsubscribe = eventBus.subscribe('event-name', (data) => {
  // Handle event
})

// Later, unsubscribe
unsubscribe()
```

## Important Notes

- This is a Chrome browser extension - all code must be compatible with Chrome's extension environment
- Manifest V3 restrictions apply (no remote code execution, service workers instead of background pages)
- The extension works offline with cached data
- Resources are categorized and can have multiple categories and tags
- User preferences are stored locally using Chrome's storage API
- The extension includes analytics tracking (can be toggled in settings)

## When Making Changes

1. **Maintain type safety**: Always use TypeScript types and interfaces
2. **Follow existing patterns**: Use established utilities and patterns
3. **Test your changes**: Write or update tests in `__tests__/`
4. **Update documentation**: Keep JSDoc comments current
5. **Run linter**: Ensure code passes ESLint checks
6. **Format code**: Run Prettier before committing
7. **Handle errors**: Use AppError with appropriate error codes
8. **Consider offline mode**: Extension should work without internet
9. **Respect user preferences**: Check user settings before applying changes
10. **Log appropriately**: Use Winston logger for important events

## Dependencies to Note

- **axios**: HTTP client for API requests
- **winston**: Logging framework
- **vitest**: Testing framework
- **vite**: Build tool
- **@types/chrome**: TypeScript definitions for Chrome APIs

## Git Workflow

- Work on feature branches
- Keep commits atomic and well-described
- Test before pushing
- Ensure build passes before merging
