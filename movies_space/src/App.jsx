import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import NewPage from './pages/NewPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import ShortsPage from './pages/ShortsPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import GenrePage from './pages/GenrePage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanel from './pages/AdminPanel';
import OMDbMoviesPage from './pages/OMDbMoviesPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import UploadModal from './components/UploadModal';
import RequestMovieModal from './components/RequestMovieModal';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppStore } from './store/useAppStore';
import { AuthProvider, ThemeProvider, NotificationProvider } from './context';

// Create a client for React Query with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes - standard cache time
      gcTime: 1000 * 60 * 10,    // 10 minutes - garbage collection
      retry: (failureCount, error) => {
        // More aggressive retry on network errors
        if (error?.message?.includes('Network')) return failureCount < 3;
        // Single retry on other errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,  // Don't refetch when window regains focus
      refetchOnReconnect: true,     // Refetch when connection restored
    },
  },
});

function AppContent() {
  const { isUploadModalOpen, setUploadModalOpen, isRequestModalOpen, setRequestModalOpen } = useAppStore();

  return (
    <>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* OMDb Movie Application */}
            <Route path="/movies" element={<OMDbMoviesPage />} />

            {/* Original MovieSpace Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/panel" element={<ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/genre/:genre" element={<GenrePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/new" element={<NewPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/shorts" element={<ShortsPage />} />
            </Route>
          </Routes>
        </Router>
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
        <RequestMovieModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} />
      </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
      {/* React Query DevTools - toggle with button in bottom left */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}

export default App;
