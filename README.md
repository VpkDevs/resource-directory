# AI Resource Directory 🤖

A comprehensive Chrome browser extension for discovering, organizing, and accessing AI tools, platforms, and resources.

## 📋 Overview

**AI Resource Directory** helps you navigate the rapidly expanding AI ecosystem by providing a curated, searchable directory of AI tools across multiple categories. Whether you're looking for image generators, code assistants, or learning resources, find everything in one place.

## ✨ Features

### Core Functionality
- 🔍 **Smart Search**: Quick search across all resources with real-time filtering
- 📁 **Category Organization**: Browse by directories, models, development, and learning
- ⭐ **Favorites System**: Bookmark your most-used tools for quick access
- 🌓 **Dark Mode**: Easy on the eyes with system-aware theme switching
- 📝 **Recently Visited**: Track your recently accessed resources
- ⌨️ **Keyboard Shortcuts**: 
  - `Ctrl/Cmd+Shift+A` - Open directory
  - `Ctrl/Cmd+Shift+F` - Toggle favorites
  - `Ctrl/Cmd+Shift+Space` - Quick search
  - `Ctrl/Cmd+Shift+C` - Compare tools

### Advanced Features
- 🔌 **Offline Support**: Access cached resources without internet
- 🎯 **Context Menus**: Right-click actions for quick operations
- 🔔 **Notifications**: Stay updated with new tools and changes
- ♿ **Accessibility**: Full ARIA support and keyboard navigation
- 📊 **Usage Analytics**: Track your AI tool usage patterns
- 🎨 **Customizable**: Configure features and display preferences

## 🚀 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](#) (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/VpkDevs/ai-resource-directory.git
   cd ai-resource-directory
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory

## 📚 Resource Categories

### 🗂️ AI Tool Directories
- There's An AI For That
- Futurepedia
- And more...

### 💬 Interactive AI Models
- ChatGPT
- Claude
- And more...

### 👨‍💻 Development Resources
- Hugging Face
- Papers with Code
- And more...

### 📖 Learning & Community
- Fast.ai
- DeepLearning.AI
- And more...

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm
- Chrome browser

### Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Development mode with hot reload
npm run dev
```

### Project Structure
```
ai-resource-directory/
├── manifest.json          # Chrome extension manifest
├── popup.html            # Main popup interface
├── script.js             # Main application logic
├── styles.css            # Styling
├── serviceWorker.js      # Offline functionality
├── config.js             # Configuration
├── utils.js              # Utility functions
├── toast.js              # Toast notifications
├── options.html          # Settings page
├── options.js            # Settings logic
├── src/                  # TypeScript source files
├── __tests__/            # Test files
├── docs/                 # JSDoc documentation
└── images/               # Extension icons

```

### Tech Stack
- **Framework**: Vanilla JavaScript/TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier
- **Documentation**: JSDoc
- **Extension API**: Chrome Manifest V3

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📖 Documentation

- [Improvements TODO](./IMPROVEMENTS_TODO.md) - Comprehensive improvement roadmap
- [JSDoc Documentation](./docs/index.html) - Auto-generated API docs
- [Configuration Guide](./config.js) - Feature flags and settings

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Lint your code**: `npm run lint`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic
- Write clear commit messages

## 🔒 Privacy & Security

- **Local Storage**: All user data (favorites, settings) is stored locally
- **No Tracking**: We don't collect or transmit personal data
- **Permissions**: Only requests necessary permissions
- **Open Source**: Code is fully auditable

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- All the amazing AI tool creators
- Open source community
- Contributors and users

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/VpkDevs/ai-resource-directory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/VpkDevs/ai-resource-directory/discussions)
- **Email**: support@airesourcedirectory.com

## 🗺️ Roadmap

See [IMPROVEMENTS_TODO.md](./IMPROVEMENTS_TODO.md) for our comprehensive roadmap with 100+ planned improvements.

### Coming Soon
- Tool comparison matrix
- Advanced filtering and search
- AI-powered recommendations
- Cross-browser support (Firefox, Safari)
- Mobile app version

## 📊 Stats

- **Version**: 1.2.0
- **Tools Listed**: 10+ (growing daily)
- **Categories**: 4
- **Languages**: JavaScript/TypeScript
- **Minimum Chrome Version**: 88

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ by the AI Resource Directory Team**

*Helping you navigate the AI ecosystem, one tool at a time.*
