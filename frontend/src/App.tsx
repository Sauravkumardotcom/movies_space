import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { useAuth } from './store/auth';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import MusicPage from './pages/MusicPage';
import PlaylistsPage from './pages/PlaylistsPage';
import UploadsPage from './pages/UploadsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { HistoryPage } from './pages/HistoryPage';
import { StatsPage } from './pages/StatsPage';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import SocialPage from './pages/SocialPage';

// Components
import NotificationBell from './components/notifications/NotificationBell';

// ============================================
// LAYOUT COMPONENTS
// ============================================

/**
 * Navigation Header - Shows different nav based on auth state
 */
const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={isAuthenticated ? '/' : '/login'} className="flex items-center gap-2 text-2xl font-bold text-white hover:text-blue-400 transition">
            <span>🎬</span>
            <span>Movies Space</span>
          </Link>

          {/* Navigation */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-300 hover:text-white transition">
                Home
              </Link>
              <Link to="/music" className="text-slate-300 hover:text-white transition">
                Music
              </Link>
              <Link to="/playlists" className="text-slate-300 hover:text-white transition">
                Playlists
              </Link>
              <Link to="/uploads" className="text-slate-300 hover:text-white transition">
                Uploads
              </Link>
              <Link to="/favorites" className="text-slate-300 hover:text-white transition">
                Favorites
              </Link>
              <Link to="/watchlist" className="text-slate-300 hover:text-white transition">
                Watchlist
              </Link>
              <Link to="/history" className="text-slate-300 hover:text-white transition">
                History
              </Link>
              <Link to="/stats" className="text-slate-300 hover:text-white transition">
                Stats
              </Link>
              <Link to="/search" className="text-slate-300 hover:text-white transition">
                Discover
              </Link>
              <Link to="/social/:userId" className="text-slate-300 hover:text-white transition">
                Social
              </Link>
              <div className="flex items-center gap-4 pl-8 border-l border-slate-700">
                <Link
                  to="/notifications"
                  className="text-slate-300 hover:text-white transition"
                >
                  <NotificationBell />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-white transition text-sm"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            <nav className="flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * Home Page - Shows different content based on auth state
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to Movies Space</h1>
          <p className="text-xl text-slate-400 mb-8">
            Your ultimate entertainment hub for movies, music, and more
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-slate-400 mb-12">Ready to explore your entertainment?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Music Card */}
          <Link
            to="/music"
            className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-white mb-2">Discover Music</h3>
            <p className="text-slate-400">Explore millions of songs, create playlists, and share your favorites</p>
          </Link>

          {/* Playlists Card */}
          <Link
            to="/playlists"
            className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Playlists</h3>
            <p className="text-slate-400">Organize your favorite tracks and manage your music collection</p>
          </Link>

          {/* Uploads Card */}
          <Link
            to="/uploads"
            className="bg-slate-800 hover:bg-slate-700 rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Uploads</h3>
            <p className="text-slate-400">Upload your own audio files and manage your media library</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

function AppContent(): JSX.Element {
  const { isAuthenticated, setUser } = useAuth();

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to restore user session:', err);
      }
    }
  }, [setUser]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/music"
            element={
              <ProtectedRoute>
                <MusicPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <PlaylistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploads"
            element={
              <ProtectedRoute>
                <UploadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social/:userId"
            element={
              <ProtectedRoute>
                <SocialPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
