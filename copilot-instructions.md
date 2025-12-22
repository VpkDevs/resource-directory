# GitHub Copilot Instructions for AI Resource Directory

## Project Overview

This is a Chrome extension that provides a comprehensive directory of AI resource platforms and interactive AI models. The extension helps users discover, organize, and access AI tools efficiently.

**Tech Stack:**
- TypeScript (strict mode)
- Chrome Extension Manifest V3
- Vitest for testing
- ESLint + Prettier for code quality
- Winston for logging
- Vite for development and building

## Architecture

The project follows a modular architecture:

```
src/
├── config.ts          # Centralized configuration and feature flags
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions (storage, DOM, string, date)
├── logger.js          # Winston logger configuration
├── core/              # Core functionality
│   └── errorHandler.ts
└── services/          # Service layer
    ├── resourceService.ts    # Resource management
    ├── stateManager.ts       # State management
    └── analyticsService.ts   # Analytics tracking
```

## Code Style & Conventions

### TypeScript Configuration
- **Strict mode enabled** - all strict TypeScript checks are on
- Use TypeScript for all new files (`.ts` extension)
- Path aliases configured:
  - `@/*` maps to `src/*`
  - `@/types` maps to `src/types`
  - `@/services` maps to `src/services`
  - `@/utils` maps to `src/utils`

### Prettier Formatting
- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **2 spaces** for indentation (`tabWidth: 2`)
- **ES5 trailing commas** (`trailingComma: 'es5'`)
- **100 character line width** (`printWidth: 100`)
- **Arrow function parens: avoid** (`arrowParens: 'avoid'`)

### ESLint Rules
- TypeScript recommended rules enabled
- `@typescript-eslint/explicit-function-return-type`: off (allow type inference)
- `@typescript-eslint/no-explicit-any`: warn (discourage but allow with warning)
- `no-console`: warn except for `console.warn` and `console.error`

### Naming Conventions
- **Files**: camelCase for modules (e.g., `resourceService.ts`, `stateManager.ts`)
- **Classes**: PascalCase (e.g., `ResourceService`, `StateManager`)
- **Constants**: UPPER_SNAKE_CASE for config constants (e.g., `CACHE_KEYS`, `CONFIG`)
- **Variables/Functions**: camelCase
- **Interfaces**: PascalCase (e.g., `AIResource`, `FilterOptions`)

### Code Organization
- Each file should have a JSDoc header explaining its purpose
- Group imports: external dependencies first, then internal imports
- Use ES modules (`import`/`export`, not CommonJS)
- Prefer `const` over `let`, avoid `var`
- Destructure imports when using multiple exports from a module

### Chrome Extension Patterns
- Use Chrome Extension APIs with TypeScript types from `@types/chrome`
- Store data using `chrome.storage.sync` or `chrome.storage.local`
- Follow Manifest V3 conventions (service workers, not background pages)
- Always handle Chrome API errors appropriately

## Configuration Management

All configuration is centralized in `src/config.ts`:
- Feature flags control optional functionality
- Storage keys are defined in `CONFIG.STORAGE_KEYS`
- UI configuration settings are in `CONFIG.UI`
- Never hardcode values that should be configurable

## Error Handling

- Use try-catch blocks for async operations
- Log errors using Winston logger: `logger.error('message', { error })`
- Display user-friendly error messages, not raw error objects
- Error messages are defined in `CONFIG.ERRORS`

## Storage & Caching

- Use `storageUtils` from `src/utils.ts` for Chrome storage operations
- Resources are cached for 1 hour (`CONFIG.CACHE_DURATION`)
- Cache keys are defined in `CACHE_KEYS` constant
- Always check cache validity before using cached data

## Testing

### Framework: Vitest
- Test files: `__tests__/*.test.ts`
- Setup file: `__tests__/setup.ts`
- Environment: jsdom (simulates browser DOM)

### Testing Patterns
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('ComponentName', () => {
  it('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected)
  })
})
```

### Chrome API Mocking
- Chrome APIs are mocked in `__tests__/setup.ts`
- Use the `chromeMock` for testing Chrome extension functionality

### Coverage
- Run tests with coverage: `npm run test:coverage`
- Excluded from coverage: `node_modules/`, `dist/`, `**/*.test.ts`, `**/*.config.ts`

## Build & Development

### Commands
```bash
npm run dev           # Start development server with Vite
npm run build         # Build for production
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm test              # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Build Process
1. TypeScript compilation with type checking
2. Vite bundles the extension
3. Output directory: `dist/`

### CI/CD
- CI runs on: push to main, pull requests to main
- CI checks: linting → tests with coverage → build
- Node.js version: 18
- Uses `npm ci` for consistent dependency installation

## Security Best Practices

1. **Input Sanitization**: Always use `stringUtils.escapeHtml()` for user input before rendering
2. **API Keys**: Store sensitive data in Chrome storage, never commit to code
3. **Content Security Policy**: Follow Manifest V3 CSP requirements
4. **XSS Prevention**: Never use `innerHTML` with unsanitized content
5. **Permissions**: Request minimal necessary Chrome permissions

## Common Patterns

### Loading Resources
```typescript
const resourceService = new ResourceService()
await resourceService.initialize()
const resources = resourceService.getAllResources()
```

### Using Storage
```typescript
import { storageUtils } from '@/utils'

// Save
await storageUtils.set('key', value)

// Load
const value = await storageUtils.get<Type>('key')
```

### Error Handling
```typescript
try {
  await riskyOperation()
} catch (error) {
  logger.error('Operation failed', { error })
  throw new Error(CONFIG.ERRORS.NETWORK.REQUEST_FAILED)
}
```

## Analytics & Tracking

- Analytics configuration in `CONFIG.ANALYTICS_CONFIG`
- Use `analyticsService` for tracking user interactions
- Tracked events: searches, clicks, favorites, shares
- Privacy-conscious: configurable tracking options

## Feature Flags

Before implementing features, check if they're enabled:
```typescript
if (CONFIG.FEATURES.AI_POWERED_SEARCH) {
  // Implement AI search
}
```

Current feature flags:
- `RATINGS`: User ratings system
- `USAGE_STATS`: Usage statistics tracking
- `PRICE_COMPARISON`: Price comparison features
- `TRENDING_SECTION`: Trending resources display
- `OFFLINE_ACCESS`: Offline functionality
- And more in `CONFIG.FEATURES`

## Documentation

- Use JSDoc comments for functions, classes, and complex logic
- Document parameters, return types, and examples where helpful
- Keep documentation up-to-date with code changes
- API documentation is generated with JSDoc

## Performance Considerations

- Use `performanceUtils` for measuring operations
- Implement debouncing for search (300ms default)
- Lazy load resources using infinite scroll
- Cache frequently accessed data
- Optimize images and assets

## Working with Issues

When assigned to work on issues:
1. Read the issue description and acceptance criteria carefully
2. Check related files mentioned in the issue
3. Make minimal, focused changes
4. Add tests for new functionality
5. Update documentation if needed
6. Run linting, tests, and build before submitting
7. Follow the existing patterns and conventions

## Making Changes

1. **Small & Focused**: Make the smallest possible changes to address the issue
2. **Test First**: Add or update tests before changing implementation
3. **Validate**: Run `npm run lint && npm test && npm run build`
4. **Document**: Update relevant documentation
5. **Review**: Self-review changes before submission

## Dependencies

When adding dependencies:
- Prefer well-maintained packages with TypeScript support
- Check bundle size impact (this is a Chrome extension)
- Update `package.json` with exact versions when possible
- Document why the dependency is needed

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation works
- Maintain good contrast ratios
- Support dark mode (theme: 'dark' | 'light' | 'system')

## Important Notes

- This is a **Chrome Extension** - follow browser extension best practices
- **TypeScript strict mode** is enabled - handle all null/undefined cases
- **No semicolons** in code - Prettier will remove them
- Use **Winston logger** instead of console.log for persistent logging
- All **user preferences** should be stored using Chrome storage APIs
- The extension supports **offline mode** via service workers and caching
