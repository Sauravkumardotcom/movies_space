# MovieSpace Testing - Quick Reference Guide

## ⚡ Quick Commands

### Frontend Tests
```bash
cd movies_space

# Run tests once
npm test -- run

# Watch mode (re-runs on changes)
npm test

# UI mode (visual test runner)
npm run test:ui

# Coverage report
npm run test:coverage

# Specific test file
npm test -- helpers.test.js

# Specific test pattern
npm test -- store
```

### Backend Tests
```bash
cd backend

# Run tests
npm test -- run

# Coverage
npm run test:coverage
```

---

## 📋 Test Files Location

### Frontend (`movies_space/src/test/`)
- `helpers.test.js` - Utility functions (31 tests)
- `videoService.test.js` - Video management (18 tests)
- `useAppStore.test.js` - State management (35 tests)
- `components.test.js` - React components (28 tests)
- `hooks.test.js` - React hooks (40 tests)
- `emailService.test.js` - Email functionality (42 tests)
- `integration.test.js` - End-to-end workflows (14 workflows)

### Backend (`backend/tests/`)
- `server.test.js` - Express server (18 tests)

---

## 🎯 Test Categories

### 1. Utilities (31 tests)
Test helper functions:
```bash
npm test -- helpers
```

**What's tested:**
- `formatDuration()` - Time formatting
- `formatNumber()` - Number abbreviations
- `formatDate()` - Relative dates
- `debounce()` - Function debouncing
- `getVideoUrl()` - URL conversion
- `getVideoErrorMessage()` - Error messages

---

### 2. Video Service (18 tests)
Test video management:
```bash
npm test -- videoService
```

**What's tested:**
- Get all videos
- Get video by ID (string and numeric)
- Search videos
- Filter by genre, trending, shorts

---

### 3. Store Management (35 tests)
Test Zustand store:
```bash
npm test -- useAppStore
```

**What's tested:**
- User authentication
- Custom movies (add, remove)
- Favorites management
- Watch history
- Movie requests
- Admin panel
- Theme settings
- **Persistence to localStorage**

---

### 4. Components (28 tests)
Test React components:
```bash
npm test -- components
```

**What's tested:**
- VideoCard rendering
- VideoPlayer functionality
- Header/Navigation
- Sidebar
- Request forms
- Admin panel
- Error boundary

---

### 5. Hooks (40 tests)
Test React hooks:
```bash
npm test -- hooks
```

**What's tested:**
- `useVideos()` - Video list hook
- `useVideoById()` - Single video hook
- `useSearchVideos()` - Search hook
- `useShortVideos()` - Shorts hook
- Store integration
- Loading/error states

---

### 6. Email Service (42 tests)
Test email functionality:
```bash
npm test -- emailService
```

**What's tested:**
- Request confirmations
- Admin notifications
- Contact emails
- Email validation
- Template rendering
- Error handling
- Gmail integration
- Rate limiting

---

### 7. Integration Tests (14 workflows)
Test complete workflows:
```bash
npm test -- integration
```

**What's tested:**
- Add movie → Persist → Watch
- Admin panel workflow
- Search and discovery
- Movie requests
- User authentication
- Data consistency
- Performance (100 movies)
- Error recovery

---

### 8. Backend (18 tests)
Test Express server:
```bash
cd backend
npm test -- run
```

**What's tested:**
- CORS configuration
- Health checks
- API endpoints
- Apps Script proxy
- Error handling

---

## 📊 Coverage Report

Generate and view:
```bash
npm run test:coverage
```

Reports available at:
- Frontend: `movies_space/coverage/index.html`
- Backend: `backend/coverage/index.html`

---

## 🔍 Common Testing Patterns

### Testing a Utility Function
```javascript
import { describe, it, expect } from 'vitest';
import { formatDuration } from '../utils/helpers';

describe('formatDuration', () => {
  it('should format seconds', () => {
    expect(formatDuration(65)).toBe('1:05');
  });
});
```

### Testing Store Functions
```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add custom movie', () => {
    const store = useAppStore.getState();
    store.addCustomMovie({ title: 'Test', src: 'url' });
    expect(store.customMovies.length).toBe(1);
  });
});
```

### Testing Service Methods
```javascript
describe('videoService', () => {
  it('should find video by ID', async () => {
    const video = await videoService.getVideoById('custom_1001', mockMovies);
    expect(video).toBeDefined();
  });
});
```

---

## 🐛 Debugging Tests

### Watch Mode
```bash
npm test
```
- Re-runs tests on file changes
- Shows only changed test suites
- Press 'a' for all tests
- Press 'q' to quit

### UI Mode
```bash
npm run test:ui
```
- Visual test runner
- Click to run individual tests
- See test results in browser
- Live reload

### Verbose Output
```bash
npm test -- run --reporter=verbose
```
- Detailed test output
- Each test result shown
- Helpful for debugging

### Single Test
```bash
npm test -- store.test.js
```
Run specific file only

---

## ✅ Test Quality Checklist

When writing tests:
- [ ] Test name clearly describes what's tested
- [ ] One assertion or related assertions
- [ ] Arrange-Act-Assert pattern
- [ ] Proper setup/cleanup
- [ ] No hardcoded dependencies
- [ ] Edge cases covered
- [ ] Error cases included

---

## 📈 Current Test Stats

| Category | Tests | Status |
|----------|-------|--------|
| Utilities | 31 | ✅ |
| Video Service | 18 | ✅ |
| Store | 35 | ✅ |
| Components | 28 | ✅ |
| Hooks | 40 | ✅ |
| Email Service | 42 | ✅ |
| Backend Server | 18 | ✅ |
| Integration | 14 | ✅ |
| **TOTAL** | **226** | ✅ |

---

## 🚀 CI/CD Ready

### GitHub Actions
Tests automatically run on:
- Every `git push`
- Every pull request
- Custom triggers

### Setup
1. Create `.github/workflows/tests.yml`
2. Configure triggers
3. Set notifications
4. Track coverage

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🆘 Troubleshooting

### "vitest not found"
```bash
npm install --save-dev vitest
```

### Tests timeout
Increase in `vitest.config.js`:
```javascript
test: {
  testTimeout: 10000,
}
```

### Import errors
Check alias in `vitest.config.js`:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### localStorage errors
Ensure setup file runs:
```javascript
export default defineConfig({
  test: {
    setupFiles: ['./src/test/setup.js'],
  },
})
```

---

## 📝 Adding New Tests

### Step 1: Create Test File
```bash
touch src/test/myFeature.test.js
```

### Step 2: Write Tests
```javascript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Step 3: Run Tests
```bash
npm test -- myFeature
```

---

## 🎓 Learning Resources

### Read First
1. TEST_SUMMARY.md - Overview
2. TESTING_GUIDE.md - Setup guide
3. This file - Quick reference

### Examples
- `src/test/helpers.test.js` - Simple tests
- `src/test/useAppStore.test.js` - Hook tests
- `src/test/integration.test.js` - Complex workflows

### Practice
Write a test for:
1. A new utility function
2. A store action
3. A service method
4. An integration workflow

---

## 🏆 Best Practices

✅ **Do:**
- Run tests before committing
- Keep tests focused and simple
- Use descriptive test names
- Clean up after tests
- Test behavior, not implementation

❌ **Don't:**
- Write tests that depend on other tests
- Mock everything
- Test third-party libraries
- Ignore test failures
- Over-test simple code

---

## 💬 Need Help?

1. Check test file examples
2. Review error message carefully
3. Use watch mode for debugging
4. Check vitest.config.js setup
5. Ensure dependencies installed

---

**Happy Testing! 🚀**

