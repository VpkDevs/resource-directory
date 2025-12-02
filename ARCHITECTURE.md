# AI Resource Directory - Architecture Documentation

## 📐 System Architecture

### Overview
AI Resource Directory is a Chrome browser extension built using Manifest V3, providing a comprehensive directory of AI tools and resources. The architecture follows a modular, event-driven design with separation of concerns.

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Browser                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Extension Runtime                         │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Popup UI   │  │   Options    │  │   Offline   │ │ │
│  │  │ (popup.html) │  │(options.html)│  │ (offline.   │ │ │
│  │  │              │  │              │  │   html)     │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └─────────────┘ │ │
│  │         │                  │                          │ │
│  │         └──────────┬───────┘                          │ │
│  │                    │                                  │ │
│  │         ┌──────────▼───────────┐                     │ │
│  │         │   Application Core    │                     │ │
│  │         │                       │                     │ │
│  │         │  ┌─────────────────┐ │                     │ │
│  │         │  │  StateManager   │ │                     │ │
│  │         │  │  (script.js)    │ │                     │ │
│  │         │  └────────┬────────┘ │                     │ │
│  │         │           │           │                     │ │
│  │         │  ┌────────▼────────┐ │                     │ │
│  │         │  │   UIManager     │ │                     │ │
│  │         │  └────────┬────────┘ │                     │ │
│  │         │           │           │                     │ │
│  │         │  ┌────────▼────────┐ │                     │ │
│  │         │  │  Utilities      │ │                     │ │
│  │         │  │  (utils.js)     │ │                     │ │
│  │         │  └─────────────────┘ │                     │ │
│  │         └───────────┬───────────┘                     │ │
│  │                     │                                 │ │
│  │         ┌───────────▼───────────┐                     │ │
│  │         │   Service Worker      │                     │ │
│  │         │  (serviceWorker.js)   │                     │ │
│  │         │                       │                     │ │
│  │         │  - Caching Strategy   │                     │ │
│  │         │  - Background Tasks   │                     │ │
│  │         │  - Offline Support    │                     │ │
│  │         └───────────┬───────────┘                     │ │
│  │                     │                                 │ │
│  └─────────────────────┼─────────────────────────────────┘ │
│                        │                                   │
│         ┌──────────────▼──────────────┐                    │
│         │    Chrome Storage API       │                    │
│         │  (sync, local, session)     │                    │
│         └─────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Structure

### 1. User Interface Layer

#### Popup Interface (`popup.html`, `script.js`)
**Purpose**: Main user interface displayed when clicking the extension icon

**Key Features**:
- Resource browsing and display
- Search and filtering
- Favorites management
- Dark mode toggle
- Category navigation

**State Management**:
- Local component state
- Synced with Chrome storage
- Real-time updates

**Event Handlers**:
- Search input
- Category filter changes
- Favorite button clicks
- Dark mode toggle
- Resource link clicks

#### Options Page (`options.html`, `options.js`)
**Purpose**: Extension settings and preferences

**Features**:
- User preferences configuration
- Feature flag toggles
- Data management (import/export)
- Privacy settings

#### Offline Page (`offline.html`)
**Purpose**: Fallback page when offline

**Features**:
- Cached resources display
- Offline status indicator
- Limited functionality

### 2. Application Core Layer

#### StateManager (`script.js`)
**Purpose**: Centralized state management

**Responsibilities**:
- Manage application state
- Handle favorites
- Track visited resources
- Persist settings
- Notify observers of changes

**State Properties**:
```javascript
{
    favorites: Set<string>,
    darkMode: boolean,
    lastVisitedItems: Array<LastVisitedItem>,
    isLoading: boolean,
    settings: UserSettings
}
```

**Key Methods**:
- `initialize()`: Load initial state
- `saveFavorites()`: Persist favorites
- `addToHistory()`: Track visited items
- `toggleDarkMode()`: Theme management
- `notifyObservers()`: Event propagation

#### UIManager (`script.js`)
**Purpose**: UI rendering and updates

**Responsibilities**:
- DOM manipulation
- Event binding
- Search/filter implementation
- Animation handling
- Accessibility features

**Key Methods**:
- `renderResources()`: Display resource list
- `updateFavorites()`: Update favorite indicators
- `handleSearch()`: Process search queries
- `applyFilters()`: Filter resources
- `showToast()`: Display notifications

### 3. Service Layer

#### Service Worker (`serviceWorker.js`)
**Purpose**: Background tasks and offline support

**Responsibilities**:
- Cache management
- Network request interception
- Background synchronization
- Notification handling
- Update checking

**Caching Strategy**:
```
Cache-first with network fallback:
1. Check cache
2. Return if found
3. Fetch from network
4. Update cache
5. Return response
```

**Cached Resources**:
- HTML pages (popup, options, offline)
- CSS stylesheets
- JavaScript files
- Images and icons
- Frequently accessed data

### 4. Utility Layer

#### Storage Utilities (`utils.js`)
**Purpose**: Chrome storage API wrapper

**Methods**:
- `get(key)`: Retrieve data
- `set(key, value)`: Store data
- `remove(key)`: Delete data
- `clear()`: Clear all data

#### Performance Utilities (`utils.js`)
**Purpose**: Performance monitoring and optimization

**Methods**:
- `debounce()`: Delay function execution
- `throttle()`: Limit execution rate
- `memoize()`: Cache function results
- `measurePerformance()`: Track metrics

#### DOM Utilities (`utils.js`)
**Purpose**: DOM manipulation helpers

**Methods**:
- `createElement()`: Create elements
- `querySelector()`: Safe querying
- `addClass()/removeClass()`: Class management
- `setAttributes()`: Batch attribute setting

#### String Utilities (`utils.js`)
**Purpose**: String manipulation

**Methods**:
- `sanitize()`: XSS prevention
- `truncate()`: Limit length
- `highlight()`: Search highlighting
- `slugify()`: URL-safe strings

### 5. Configuration Layer

#### Config (`config.js`)
**Purpose**: Centralized configuration

**Sections**:
- API endpoints
- Feature flags
- UI configuration
- Search settings
- Analytics config
- Resource categories
- Default preferences
- Cache keys

## 🔄 Data Flow

### User Interaction Flow
```
User Action
    ↓
Event Listener (UIManager)
    ↓
State Update (StateManager)
    ↓
Persist to Storage (storageUtils)
    ↓
Notify Observers
    ↓
UI Update (UIManager)
    ↓
Visual Feedback (Toast)
```

### Resource Loading Flow
```
Extension Startup
    ↓
StateManager.initialize()
    ↓
Load from Storage (Chrome Storage API)
    ↓
Check Cache Validity
    ↓
Fetch Updates (if needed)
    ↓
Update Cache (Service Worker)
    ↓
Render UI (UIManager)
```

### Search Flow
```
Search Input
    ↓
Debounce (300ms)
    ↓
Normalize Query
    ↓
Filter Resources (fuzzy matching)
    ↓
Apply Category Filter
    ↓
Sort Results
    ↓
Render Filtered List
    ↓
Update URL State
```

## 💾 Data Storage

### Storage Types

#### Chrome Sync Storage
**Purpose**: Cross-device synchronization
**Data**:
- User preferences
- Favorites
- Settings

**Limits**:
- 100KB total
- 8KB per item

#### Chrome Local Storage
**Purpose**: Local-only data
**Data**:
- Cache data
- Usage statistics
- Temporary state

**Limits**:
- 5MB total

#### Chrome Session Storage
**Purpose**: Session-specific data
**Data**:
- Current session state
- Temporary filters
- UI state

**Limits**:
- 10MB total

### Data Schema

```typescript
interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    defaultView: 'grid' | 'list';
    defaultSort: string;
    favoriteCategories: string[];
    hiddenResources: string[];
}

interface Resource {
    id: string;
    name: string;
    url: string;
    description: string;
    category: string;
    tags: string[];
    verified: boolean;
    rating?: number;
    pricing?: string;
}

interface LastVisitedItem {
    id: string;
    name: string;
    url: string;
    timestamp: number;
}
```

## 🔐 Security Architecture

### Content Security Policy
```javascript
{
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
}
```

### Permissions Model
- **Required**: storage, theme, alarms, offline
- **Optional**: identity, downloads
- **Host**: Specific AI platform domains

### Security Measures
1. Input sanitization (XSS prevention)
2. CSP headers
3. Secure storage
4. HTTPS-only resources
5. Limited permissions
6. No external script execution

## 🎯 Design Patterns

### Observer Pattern
Used in StateManager for state change notifications
```javascript
class StateManager {
    addObserver(observer) { }
    notifyObservers(event, data) { }
}
```

### Singleton Pattern
StateManager and UIManager are singletons
```javascript
const stateManager = new StateManager();
// Single instance throughout application
```

### Module Pattern
Utilities organized as modules
```javascript
export const storageUtils = {
    get() { },
    set() { }
};
```

### Factory Pattern
Resource card creation
```javascript
function createResourceCard(resource) {
    // Creates DOM elements
}
```

## 📊 Performance Considerations

### Optimization Techniques
1. **Debouncing**: Search input (300ms)
2. **Caching**: Service Worker caching
3. **Lazy Loading**: Resources loaded on demand
4. **Virtual Scrolling**: For large lists (planned)
5. **Code Splitting**: Separate bundles (planned)
6. **Memoization**: Expensive calculations cached

### Performance Metrics
- Initial load: < 500ms
- Search response: < 100ms
- UI interaction: < 16ms (60fps)
- Cache hit rate: > 90%

## 🧪 Testing Architecture

### Test Structure
```
__tests__/
├── setup.ts          # Test configuration
├── utils.test.ts     # Utility tests
├── options.test.ts   # Options page tests
└── types.ts          # Test type definitions
```

### Testing Strategy
- **Unit Tests**: Individual functions
- **Integration Tests**: Component interactions
- **E2E Tests**: User workflows (planned)

### Test Coverage Goals
- Overall: > 80%
- Critical paths: > 95%
- Utilities: > 90%

## 🔄 Update & Deployment Flow

```
Code Changes
    ↓
Lint & Format (ESLint, Prettier)
    ↓
Run Tests (Vitest)
    ↓
Build (Vite)
    ↓
Version Bump (package.json, manifest.json)
    ↓
Generate Docs (JSDoc)
    ↓
Create Release Package
    ↓
Upload to Chrome Web Store
    ↓
Auto-update (Chrome Extension API)
```

## 📱 Extension Lifecycle

### Installation
1. User installs from Chrome Web Store
2. Service Worker registered
3. Initial cache setup
4. Default settings applied
5. Welcome page shown (optional)

### Activation
1. User clicks extension icon
2. popup.html loaded
3. StateManager initialized
4. UI rendered
5. Event listeners attached

### Updates
1. Chrome checks for updates
2. New version downloaded
3. Service Worker updated
4. Cache refreshed
5. User notified (optional)

### Uninstallation
1. User removes extension
2. Clean up storage
3. Unregister Service Worker
4. Clear cache

## 🎨 UI/UX Architecture

### Design System
- **Colors**: CSS variables for theming
- **Typography**: System fonts
- **Spacing**: 8px grid
- **Components**: Modular, reusable

### Accessibility
- **ARIA**: Labels and roles
- **Keyboard**: Full navigation
- **Screen Readers**: Semantic HTML
- **Contrast**: WCAG AA compliant

### Responsive Design
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: Single column

## 🔮 Future Architecture Considerations

### Scalability
- Database integration for large datasets
- API backend for real-time updates
- CDN for static assets
- Microservices architecture

### Performance
- Virtual scrolling for infinite lists
- Web Workers for heavy computations
- Progressive enhancement
- Optimistic UI updates

### Features
- Real-time collaboration
- Cloud synchronization
- Multi-platform support
- AI-powered recommendations

---

**Last Updated**: 2024-12-02  
**Version**: 1.2.0  
**Maintainer**: AI Resource Directory Team
