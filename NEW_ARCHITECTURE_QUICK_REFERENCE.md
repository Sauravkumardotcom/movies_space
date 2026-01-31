# New Architecture Quick Reference

## 🎯 How to Use the New Services

### 1. Making API Calls in Components

```jsx
import { useVideos, useTrendingVideos } from '@/hooks/useVideos';

function HomePage() {
  // Hook automatically handles loading, error, data
  const { data: videos, isLoading, error } = useVideos();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <VideoGrid videos={videos} />;
}
```

### 2. Searching Videos

```jsx
import { useSearchVideos } from '@/hooks/useVideos';

function SearchPage() {
  const query = new URLSearchParams(location.search).get('q');
  const { data: results } = useSearchVideos(query);
  
  return <VideoGrid videos={results} />;
}
```

### 3. User Authentication

```jsx
import { useAuthContext } from '@/context';

function AdminLoginForm() {
  const { adminLogin, isAdmin, error } = useAuthContext();
  
  const handleLogin = async (password) => {
    try {
      await adminLogin(password);
      // User is now authenticated
    } catch (err) {
      console.error(err.message);
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(password);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### 4. Email Validation

```jsx
import { emailApi, validateEmail } from '@/services/api/emailApi';

// Direct validation
const isValid = validateEmail('user@example.com');

// Send email
await emailApi.sendRequestConfirmation({
  email: 'user@example.com',
  name: 'Movie Title',
  title: 'Movie Title',
  type: 'movie'
});
```

### 5. Form Handling

```jsx
import { useForm } from '@/hooks/useForm';

function RequestForm() {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm({
    initialValues: { title: '', email: '' },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = 'Required';
      if (!values.email) errors.email = 'Required';
      return errors;
    },
    onSubmit: async (values) => {
      await emailApi.sendRequestConfirmation(values);
    }
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Movie title"
      />
      {errors.title && <span>{errors.title}</span>}
    </form>
  );
}
```

### 6. Notifications/Toasts

```jsx
import { useNotificationContext } from '@/context';

function MyComponent() {
  const { success, error, warning } = useNotificationContext();
  
  const handleSave = async () => {
    try {
      await saveData();
      success('Data saved successfully!');
    } catch (err) {
      error('Failed to save data');
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

---

## 📁 File Structure Guide

### Adding a New Page
```
1. Create: src/pages/NewPage.jsx
2. Add route in src/App.jsx
3. Use hooks for data fetching
4. Use contexts for global state
```

### Adding a New Component
```
1. Determine type (common, layout, video, forms, error)
2. Create in: src/components/{type}/NewComponent.jsx
3. Import hooks if needed
4. Use contexts for state if needed
```

### Adding a New API Endpoint
```
1. Add method to src/services/api/{service}.ts
2. Use client (axios instance) for requests
3. Export from src/services/api/index.ts
4. Create corresponding hook if needed
```

---

## 🔑 Key Patterns

### Pattern 1: Data Fetching
```jsx
const { data, isLoading, error } = useVideos();
```

### Pattern 2: Global State
```jsx
const { isAdmin, adminLogin } = useAuthContext();
```

### Pattern 3: Notifications
```jsx
const { success, error } = useNotificationContext();
success('Action completed!');
```

### Pattern 4: Form Validation
```jsx
const { values, errors, handleSubmit } = useForm({ ... });
```

---

## ⚠️ Breaking Changes

### Old Way → New Way

| Old | New | Example |
|-----|-----|---------|
| `emailService.validateEmail()` | `validateEmail()` (import directly) | `import { validateEmail } from '@/services/api/emailApi'` |
| `emailService.sendEmail()` | `emailApi.sendRequestConfirmation()` | `emailApi.sendRequestConfirmation(data)` |
| `videoService.getVideos()` | `useVideos()` (hook) | `const { data } = useVideos()` |
| `useAppStore.user` | `useAuthContext().user` | `const { user } = useAuthContext()` |
| Prop drilling | Context API | `useNotificationContext()` |

---

## 🐛 Debugging

### Check API Client Config
```typescript
// src/services/api/client.ts
// - Verify BACKEND_URL
// - Check interceptors
// - Review error handling
```

### Check Auth State
```jsx
import { useAuthContext } from '@/context';

function DebugAuth() {
  const auth = useAuthContext();
  console.log('Auth state:', auth);
  return null;
}
```

### Check Network Requests
```
Browser DevTools > Network Tab
Look for: /api/* requests
Check: Status code, Response body, Headers
```

---

## 📋 Checklist for Component Migration

For each existing component/page:
- [ ] Identify all data fetching logic
- [ ] Replace with appropriate hook (useVideos, useSearchVideos, etc)
- [ ] Replace prop drilling with Context API
- [ ] Update imports to use new services
- [ ] Test component still works
- [ ] Check console for errors
- [ ] Update types if using TypeScript

