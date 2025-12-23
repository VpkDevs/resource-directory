# Contributing to AI Resource Directory

Thank you for your interest in contributing to AI Resource Directory! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

### 1. Add New AI Tools
The most impactful way to contribute is by adding new AI tools to our directory.

**How to add a tool:**
1. Edit `popup.html`
2. Add a new resource card in the appropriate section
3. Follow the existing format:
```html
<li>
    <article class="resource-card">
        <div class="resource-header">
            <a href="https://example.com" 
               target="_blank" 
               rel="noopener noreferrer">
                Tool Name
            </a>
            <button class="favorite-btn" 
                    data-id="unique-tool-id" 
                    aria-label="Add to favorites">☆</button>
        </div>
        <p class="description">Brief description of the tool</p>
        <div class="tags" role="list" aria-label="Resource tags">
            <span class="tag" role="listitem">Category</span>
            <span class="tag" role="listitem">Pricing</span>
        </div>
    </article>
</li>
```

**Tool Submission Criteria:**
- ✅ Must be a functional AI tool or resource
- ✅ URL must be valid and accessible
- ✅ Description should be concise (1-2 sentences)
- ✅ Categorize appropriately
- ✅ Include relevant tags (pricing, type, features)
- ✅ Tool ID must be unique (lowercase, no spaces)

### 2. Report Bugs
Found a bug? Help us fix it!

**Before reporting:**
- Check existing issues to avoid duplicates
- Test on the latest version
- Gather relevant information

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- Extension Version: [e.g., 1.2.0]
- OS: [e.g., Windows 11]

**Additional context**
Any other context about the problem.
```

### 3. Suggest Features
Have an idea? We'd love to hear it!

**Feature Request Template:**
```markdown
**Feature Description**
Clear description of the feature.

**Problem It Solves**
What problem does this solve?

**Proposed Solution**
How would you implement it?

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Screenshots, mockups, or references.
```

### 4. Improve Documentation
- Fix typos or unclear explanations
- Add examples and use cases
- Translate documentation
- Create tutorials or guides

### 5. Code Contributions
- Fix bugs
- Implement new features
- Improve performance
- Enhance accessibility
- Write tests

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Chrome browser

### Setup Development Environment

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Clone and setup**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-resource-directory.git
   cd ai-resource-directory
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the code style guide
   - Add tests if applicable
   - Update documentation

5. **Test your changes**
   ```bash
   npm run lint        # Check code style
   npm run format      # Format code
   npm test           # Run tests
   npm run build      # Build extension
   ```

6. **Load extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory
   - Test your changes

7. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Submit for review

## 📝 Code Style Guide

### JavaScript/TypeScript
- Use modern ES6+ syntax
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Add JSDoc comments for functions
- Follow existing patterns

**Example:**
```javascript
/**
 * Filters resources by category
 * @param {Array<Resource>} resources - Array of resources
 * @param {string} category - Category to filter by
 * @returns {Array<Resource>} Filtered resources
 */
function filterByCategory(resources, category) {
    if (!category || category === 'all') {
        return resources;
    }
    return resources.filter(r => r.category === category);
}
```

### HTML
- Use semantic HTML5 elements
- Include ARIA labels for accessibility
- Follow existing structure
- Indent with 4 spaces

### CSS
- Use existing CSS variables for theming
- Mobile-first responsive design
- Use BEM naming convention where applicable
- Comment complex selectors

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

**Examples:**
```
feat: add comparison feature for AI tools
fix: resolve dark mode toggle issue
docs: update installation instructions
test: add tests for search functionality
```

## 🧪 Testing Guidelines

### Writing Tests
- Test new features and bug fixes
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

**Example:**
```javascript
import { describe, it, expect } from 'vitest';
import { filterByCategory } from './utils.js';

describe('filterByCategory', () => {
    it('should return all resources when category is "all"', () => {
        // Arrange
        const resources = [
            { id: 1, category: 'models' },
            { id: 2, category: 'directories' }
        ];
        
        // Act
        const result = filterByCategory(resources, 'all');
        
        // Assert
        expect(result).toEqual(resources);
    });
});
```

### Running Tests
```bash
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🔍 Code Review Process

### What We Look For
- ✅ Code follows style guidelines
- ✅ Tests pass and coverage is maintained
- ✅ Documentation is updated
- ✅ No breaking changes (or properly documented)
- ✅ Accessibility considerations
- ✅ Performance impact considered
- ✅ Security best practices followed

### Review Timeline
- Initial review: Within 2-3 days
- Follow-up reviews: Within 1-2 days
- Approval and merge: After all checks pass

### Addressing Feedback
- Respond to all comments
- Make requested changes
- Push updates to the same branch
- Mark conversations as resolved

## 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## How Has This Been Tested?
Description of testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Works in Chrome

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Extension credits

## 📚 Resources

### Documentation
- [README.md](./README.md) - Project overview
- [IMPROVEMENTS_TODO.md](./IMPROVEMENTS_TODO.md) - Roadmap
- [JSDoc Docs](./docs/index.html) - API documentation

### Learning Resources
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Web Accessibility](https://www.w3.org/WAI/fundamentals/)

### Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 🤔 Questions?

- Create a [Discussion](https://github.com/VpkDevs/ai-resource-directory/discussions)
- Ask in [Issues](https://github.com/VpkDevs/ai-resource-directory/issues)
- Email: support@airesourcedirectory.com

## 🎯 Good First Issues

New to the project? Look for issues labeled:
- `good first issue` - Perfect for beginners
- `help wanted` - Community contributions welcome
- `documentation` - Improve docs
- `content` - Add new AI tools

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Standards
- ✅ Use welcoming and inclusive language
- ✅ Be respectful of differing viewpoints
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ✅ Show empathy towards others

### Unacceptable Behavior
- ❌ Harassment or discriminatory language
- ❌ Trolling or insulting comments
- ❌ Public or private harassment
- ❌ Publishing others' private information
- ❌ Other unprofessional conduct

### Enforcement
Project maintainers will enforce these standards and may remove, edit, or reject contributions that violate them.

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for helping make AI Resource Directory better for everyone!

---

**Happy Contributing! 🚀**
