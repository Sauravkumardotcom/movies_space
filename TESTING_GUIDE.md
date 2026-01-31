# Unit Testing Guide for MovieSpace

## Overview

This guide covers the comprehensive unit testing setup for the MovieSpace project. Tests are organized for:
- Frontend (React components, hooks, services, store)
- Backend (Express server, CORS, endpoints)

## Test Framework

- **Vitest**: Fast unit test framework (Vite native)
- **React Testing Library**: Component and integration tests
- **Supertest**: HTTP assertion library for backend
- **jsdom**: DOM environment for tests

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
cd movies_space
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/ui jsdom
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install --save-dev vitest supertest
```

### 3. Configuration Files

Both frontend and backend have their own configuration:
- Frontend: `movies_space/vitest.config.js`
- Backend: `backend/vitest.config.js`

## Running Tests

### Frontend Tests

```bash
cd movies_space

# Run all tests once
npm test -- run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Backend Tests

```bash
cd backend

# Run all tests once
npm test -- run

# Run tests with coverage
npm run test:coverage
```

## Test Files Structure

### Frontend Tests (`src/test/`)

1. **helpers.test.js** - Utility function tests
   - formatDuration()
   - formatNumber()
   - formatDate()
   - debounce()
   - getVideoUrl()
   - getVideoErrorMessage()

2. **videoService.test.js** - Video service tests
   - getAllVideos()
   - getVideoById()
   - searchVideos()
   - getShortVideos()
   - getGenreVideos()
   - getTrendingVideos()

3. **useAppStore.test.js** - Zustand store tests
   - Authentication (login, logout, user state)
   - Theme management
   - Custom movies (add, remove, persistence)
   - Favorites management
   - Watch history
   - Movie requests
   - Modal states

### Backend Tests (`tests/`)

1. **server.test.js** - Backend server tests
   - CORS configuration
   - Health check endpoint
   - Apps Script proxy endpoint
   - Error handling
   - Request validation

## Test Coverage

### Current Coverage

| Area | Tests | Status |
|------|-------|--------|
| Utilities | 6 functions | ✅ Complete |
| Video Service | 6 functions | ✅ Complete |
| Zustand Store | 8 sections | ✅ Complete |
| Backend Server | 5 suites | ✅ Complete |
| React Components | Pending | ⏳ In Progress |
| React Hooks | Pending | ⏳ In Progress |

## Test Examples

### Testing Utilities

```javascript
import { describe, it, expect } from 'vitest';
import { formatDuration } from '../utils/helpers';

describe('formatDuration', () => {
  it('should format seconds to MM:SS', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('should format seconds to HH:MM:SS', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });
});
```

### Testing Store

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add custom movie', () => {
    const movie = { title: 'Test', src: 'url' };
    useAppStore.getState().addCustomMovie(movie);
    expect(useAppStore.getState().customMovies.length).toBe(1);
  });
});
```

### Testing Backend

```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('API Server', () => {
  it('should return server status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
```

## Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- helpers

# Run single test file
npm test -- helpers.test.js

# Run with specific reporter
npm test -- run --reporter=verbose
```

## Debugging Tests

### Watch Mode
```bash
# Run tests and re-run on file changes
npm test
```

### UI Mode
```bash
# Visual test runner with UI
npm run test:ui
```

### Debug Single Test
```bash
# Node debugging
node --inspect-brk ./node_modules/vitest/vitest.mjs run helpers.test.js
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- run
      - run: npm run test:coverage
```

## Common Issues and Solutions

### Issue: "vitest is not recognized"

**Solution 1**: Use npx
```bash
npx vitest run
```

**Solution 2**: Use npm script
```bash
npm test -- run
```

**Solution 3**: Install globally (not recommended)
```bash
npm install -g vitest
```

### Issue: Tests Timeout

**Solution**: Increase timeout in vitest.config.js
```javascript
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
});
```

### Issue: Import Errors

**Solution**: Ensure vitest.config.js has correct alias:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

## Writing New Tests

### Best Practices

1. **One assertion per test (when possible)**
   ```javascript
   it('should add to favorites', () => {
     store.addToFavorites(video);
     expect(store.favorites.length).toBe(1);
   });
   ```

2. **Use descriptive test names**
   ```javascript
   ✅ it('should add custom movie with auto-generated ID')
   ❌ it('should add movie')
   ```

3. **Clean up after tests**
   ```javascript
   afterEach(() => {
     localStorage.clear();
     store.reset();
   });
   ```

4. **Use arrange-act-assert pattern**
   ```javascript
   it('should delete movie', () => {
     // Arrange
     store.addCustomMovie(movie);
     const id = store.customMovies[0].id;
     
     // Act
     store.removeCustomMovie(id);
     
     // Assert
     expect(store.customMovies.length).toBe(0);
   });
   ```

## Component Testing (To Be Added)

Examples for testing React components:

```javascript
import { render, screen } from '@testing-library/react';
import { VideoCard } from '../components/VideoCard';

describe('VideoCard', () => {
  it('should render video title', () => {
    render(<VideoCard video={{ title: 'Test' }} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Coverage Reports

Generate and view coverage:

```bash
npm run test:coverage

# Open HTML report
# Frontend: coverage/index.html
# Backend: coverage/index.html
```

## Next Steps

1. ✅ Utilities testing - Complete
2. ✅ Services testing - Complete
3. ✅ Store testing - Complete
4. ✅ Backend testing - Complete
5. ⏳ Component testing - Add VideoCard, VideoPlayer, etc.
6. ⏳ Hook testing - Add useVideos, useVideoById tests
7. ⏳ Integration testing - End-to-end workflows
8. ⏳ Performance testing - Component render performance

## Resources

- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

